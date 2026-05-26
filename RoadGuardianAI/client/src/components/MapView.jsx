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
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
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

        const newPosition = [lat, lng];
        setPosition(newPosition);

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

    const query = `
      [out:json][timeout:10];
      (
        node["amenity"="hospital"](around:8000,${lat},${lng});
        way["amenity"="hospital"](around:8000,${lat},${lng});
        relation["amenity"="hospital"](around:8000,${lat},${lng});

        node["healthcare"="hospital"](around:8000,${lat},${lng});
        way["healthcare"="hospital"](around:8000,${lat},${lng});
        relation["healthcare"="hospital"](around:8000,${lat},${lng});

        node["amenity"="clinic"](around:5000,${lat},${lng});
        node["healthcare"="clinic"](around:5000,${lat},${lng});

        node["amenity"="doctors"](around:5000,${lat},${lng});
      );
      out center tags;
    `;

    let response = null;

    for (const url of OVERPASS_URLS) {
      try {
        response = await axios.post(url, query, {
          headers: {
            "Content-Type": "text/plain",
          },
          timeout: 12000,
        });

        if (response?.data?.elements) {
          break;
        }
      } catch (err) {
        console.log("OVERPASS FAILED:", url, err);
      }
    }

    if (!response?.data?.elements) {
      setHospitals([]);
      setError("Hospital search server is busy. Please try Refresh.");
      setLoadingHospitals(false);
      return;
    }

    const uniqueMap = new Map();

    response.data.elements.forEach((item) => {
      const hospitalLat = item.lat || item.center?.lat;
      const hospitalLon = item.lon || item.center?.lon;

      if (!hospitalLat || !hospitalLon) return;

      const name =
        item.tags?.name ||
        item.tags?.["name:en"] ||
        item.tags?.operator ||
        getDefaultMedicalName(item.tags);

      const distance = getDistanceKm(lat, lng, hospitalLat, hospitalLon);

      if (distance > 8) return;

      const key = `${name}-${hospitalLat.toFixed(5)}-${hospitalLon.toFixed(5)}`;

      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, {
          id: item.id || key,
          name,
          lat: hospitalLat,
          lon: hospitalLon,
          distance,
          type: getMedicalType(item.tags),
        });
      }
    });

    const hospitalData = Array.from(uniqueMap.values()).sort(
      (a, b) => a.distance - b.distance
    );

    if (hospitalData.length === 0) {
      setHospitals([]);
      setError("No real medical center found nearby. Try Refresh or check location permission.");
    } else {
      const topHospitals = hospitalData.slice(0, 8);
      setHospitals(topHospitals);
      saveCachedHospitals(lat, lng, topHospitals);
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
                  <b>{index + 1}. {hospital.name}</b>
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
            Real medical places from OpenStreetMap. Open Google Maps for live guidance.
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
                No hospital data available. Try Refresh.
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
