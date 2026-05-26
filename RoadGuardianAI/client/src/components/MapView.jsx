import { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const OVERPASS_URLS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, {
        duration: 0.8,
      });
    }
  }, [position, map]);

  return null;
}

export default function MapView() {
  const [position, setPosition] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [route, setRoute] = useState([]);
  const [error, setError] = useState("");
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const hasFetchedRef = useRef(false);
  const lastFetchLocationRef = useRef(null);

  const API_KEY = import.meta.env.VITE_ORS_API_KEY;

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (location) => {
        const lat = location.coords.latitude;
        const lng = location.coords.longitude;

        setPosition([lat, lng]);

        const cachedHospitals = getCachedHospitals(lat, lng);

        if (cachedHospitals && cachedHospitals.length > 0) {
          setHospitals(cachedHospitals);
          return;
        }

        if (!hasFetchedRef.current) {
          hasFetchedRef.current = true;
          fetchHospitals(lat, lng);
          return;
        }

        const last = lastFetchLocationRef.current;

        if (last) {
          const movedKm = getDistanceKm(lat, lng, last.lat, last.lng);

          if (movedKm > 2) {
            fetchHospitals(lat, lng);
          }
        }
      },
      () => {
        setError("Location permission denied. Please allow location access.");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const fetchHospitals = async (lat, lng) => {
    setLoadingHospitals(true);
    setError("");
    setRoute([]);
    setSelectedHospital(null);

    lastFetchLocationRef.current = {
      lat,
      lng,
    };

    // Fast Overpass query
    const query = `
      [out:json][timeout:6];
      (
        node["amenity"="hospital"](around:6000,${lat},${lng});
        node["healthcare"="hospital"](around:6000,${lat},${lng});
        node["amenity"="clinic"](around:6000,${lat},${lng});
        node["healthcare"="clinic"](around:6000,${lat},${lng});
        node["amenity"="doctors"](around:6000,${lat},${lng});
      );
      out tags;
    `;

    let hospitalData = [];

    // Try Overpass first
    for (const url of OVERPASS_URLS) {
      try {
        const response = await axios.post(url, query, {
          headers: {
            "Content-Type": "text/plain",
          },
          timeout: 8000,
        });

        hospitalData = response.data.elements
          .map((item) => {
            if (!item.lat || !item.lon) {
              return null;
            }

            return {
              id: item.id,
              name: item.tags?.name || getDefaultMedicalName(item.tags),
              lat: item.lat,
              lon: item.lon,
              distance: getDistanceKm(lat, lng, item.lat, item.lon),
              type: getMedicalType(item.tags),
            };
          })
          .filter(Boolean)
          .filter((place) => place.distance <= 8)
          .sort((a, b) => a.distance - b.distance);

        if (hospitalData.length > 0) {
          break;
        }
      } catch (err) {
        console.log("OVERPASS FAILED:", url, err);
      }
    }

    // If Overpass fails, use Nominatim fallback
    if (hospitalData.length === 0) {
      try {
        const nominatim = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              format: "json",
              q: "hospital",
              limit: 8,
              bounded: 1,
              viewbox: `${lng - 0.08},${lat + 0.08},${lng + 0.08},${lat - 0.08}`,
            },
            timeout: 8000,
          }
        );

        hospitalData = nominatim.data
          .map((item) => ({
            id: item.place_id,
            name: item.display_name?.split(",")[0] || "Nearby Hospital",
            lat: Number(item.lat),
            lon: Number(item.lon),
            distance: getDistanceKm(
              lat,
              lng,
              Number(item.lat),
              Number(item.lon)
            ),
            type: "Hospital",
          }))
          .filter((place) => place.distance <= 10)
          .sort((a, b) => a.distance - b.distance);
      } catch (err) {
        console.log("NOMINATIM FAILED:", err);
      }
    }

    if (hospitalData.length > 0) {
      const topHospitals = removeDuplicates(hospitalData).slice(0, 8);

      setHospitals(topHospitals);
      saveCachedHospitals(lat, lng, topHospitals);
    } else {
      setHospitals([]);
      setError("No hospital found nearby. Use Google Maps search.");
    }

    setLoadingHospitals(false);
  };

  const getRoute = async (startLat, startLng, endLat, endLng) => {
    setError("");
    setRouteLoading(true);

    if (!API_KEY) {
      setError("Route API key missing. Add VITE_ORS_API_KEY in Vercel.");
      setRouteLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          coordinates: [
            [startLng, startLat],
            [endLng, endLat],
          ],
        },
        {
          headers: {
            Authorization: API_KEY,
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      const coords = response.data.features[0].geometry.coordinates;

      const convertedCoords = coords.map((coord) => [
        coord[1],
        coord[0],
      ]);

      setRoute(convertedCoords);
    } catch (err) {
      console.log("ROUTE ERROR:", err);
      setError("In-app route failed. Google Maps navigation will still open.");
    }

    setRouteLoading(false);
  };

  const startLiveNavigation = (hospital) => {
    setSelectedHospital(hospital);

    getRoute(position[0], position[1], hospital.lat, hospital.lon);

    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${position[0]},${position[1]}&destination=${hospital.lat},${hospital.lon}&travelmode=driving`,
      "_blank"
    );
  };

  if (!position) {
    return (
      <div className="text-center py-20 text-3xl">
        Loading Live Map...
      </div>
    );
  }

  return (
    <section className="py-10">
      <h1 className="text-3xl md:text-5xl font-black text-center mb-8 mt-6">
        Nearest Hospital & Live Navigation
      </h1>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-center">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapContainer
            center={position}
            zoom={14}
            className="h-[75vh] rounded-[2rem]"
          >
            <RecenterMap position={position} />

            <TileLayer
              attribution="OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={position}>
              <Popup>Your Live Location</Popup>
            </Marker>

            {hospitals.map((hospital, index) => (
              <Marker
                key={`${hospital.id}-${index}`}
                position={[hospital.lat, hospital.lon]}
              >
                <Popup>
                  <b>
                    {index + 1}. {hospital.name}
                  </b>
                  <br />
                  {hospital.type}
                  <br />
                  {hospital.distance.toFixed(2)} km away
                </Popup>
              </Marker>
            ))}

            {route.length > 0 && (
              <Polyline positions={route} color="red" weight={5} />
            )}
          </MapContainer>
        </div>

        <div className="bg-[#111827]/70 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
          <h2 className="text-3xl font-black text-cyan-400">
            Nearby Medical Help
          </h2>

          <p className="text-gray-400 mt-2">
            Real medical places from OpenStreetMap. Open Google Maps for live
            guidance.
          </p>

          {loadingHospitals && (
            <p className="mt-5 text-yellow-400">
              Searching nearby medical centers...
            </p>
          )}

          {routeLoading && (
            <p className="mt-5 text-cyan-400">
              Drawing route...
            </p>
          )}

          <button
            onClick={() => fetchHospitals(position[0], position[1])}
            className="mt-5 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold"
          >
            Refresh Nearby Help
          </button>

          <a
            href={`https://www.google.com/maps/search/hospital+near+me/@${position[0]},${position[1]},14z`}
            target="_blank"
            rel="noreferrer"
          >
            <button className="mt-3 w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold">
              Open Hospitals in Google Maps
            </button>
          </a>

          <div className="mt-6 space-y-4 max-h-[55vh] overflow-y-auto pr-2">
            {hospitals.map((hospital, index) => (
              <div
                key={`${hospital.id}-card-${index}`}
                className={`bg-black/30 border rounded-2xl p-4 ${
                  selectedHospital?.id === hospital.id
                    ? "border-cyan-400"
                    : "border-white/10"
                }`}
              >
                <h3 className="text-lg font-bold">
                  {index + 1}. {hospital.name}
                </h3>

                <p className="text-sm text-cyan-300 mt-1">
                  {hospital.type}
                </p>

                <p className="text-gray-400 mt-2">
                  Approx distance: {hospital.distance.toFixed(2)} km
                </p>

                <button
                  onClick={() => startLiveNavigation(hospital)}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 rounded-xl font-bold"
                >
                  Start Live Navigation
                </button>
              </div>
            ))}

            {!loadingHospitals && hospitals.length === 0 && (
              <p className="text-gray-400 text-center">
                No hospital data available. Try Refresh or open Google Maps.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function getMedicalType(tags = {}) {
  if (tags.amenity === "hospital" || tags.healthcare === "hospital") {
    return "Hospital";
  }

  if (tags.amenity === "clinic" || tags.healthcare === "clinic") {
    return "Clinic";
  }

  if (tags.amenity === "doctors") {
    return "Doctor / Medical Help";
  }

  return "Medical Help";
}

function getDefaultMedicalName(tags = {}) {
  if (tags.amenity === "hospital" || tags.healthcare === "hospital") {
    return "Nearby Hospital";
  }

  if (tags.amenity === "clinic" || tags.healthcare === "clinic") {
    return "Nearby Clinic";
  }

  if (tags.amenity === "doctors") {
    return "Nearby Doctor";
  }

  return "Nearby Medical Help";
}

function removeDuplicates(places) {
  const map = new Map();

  places.forEach((place) => {
    const key = `${place.name}-${place.lat.toFixed(5)}-${place.lon.toFixed(5)}`;

    if (!map.has(key)) {
      map.set(key, place);
    }
  });

  return Array.from(map.values());
}

function saveCachedHospitals(lat, lng, hospitals) {
  try {
    sessionStorage.setItem(
      "roadsos_hospitals",
      JSON.stringify({
        lat,
        lng,
        time: Date.now(),
        hospitals,
      })
    );
  } catch {
    // ignore cache error
  }
}

function getCachedHospitals(lat, lng) {
  try {
    const raw = sessionStorage.getItem("roadsos_hospitals");

    if (!raw) return null;

    const cached = JSON.parse(raw);

    const isFresh = Date.now() - cached.time < 10 * 60 * 1000;
    const isNearby = getDistanceKm(lat, lng, cached.lat, cached.lng) < 2;

    if (isFresh && isNearby) {
      return cached.hospitals;
    }

    return null;
  } catch {
    return null;
  }
}

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371;
  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(degToRad(lat1)) *
      Math.cos(degToRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return earthRadius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function degToRad(deg) {
  return deg * (Math.PI / 180);
}
