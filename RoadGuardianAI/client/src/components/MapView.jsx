import { useEffect, useState } from "react";
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

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
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

        if (hospitals.length === 0 && !loadingHospitals) {
          fetchHospitals(lat, lng);
        }
      },
      () => {
        setError("Location permission denied. Please allow location access.");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [hospitals.length, loadingHospitals]);

  const fetchHospitals = async (lat, lng) => {
    setLoadingHospitals(true);
    setError("");
    setRoute([]);
    setSelectedHospital(null);

    try {
      const query = `
        [out:json][timeout:15];
        (
          node["amenity"="hospital"](around:10000,${lat},${lng});
          way["amenity"="hospital"](around:10000,${lat},${lng});
          relation["amenity"="hospital"](around:10000,${lat},${lng});
          node["healthcare"="hospital"](around:10000,${lat},${lng});
          way["healthcare"="hospital"](around:10000,${lat},${lng});
          relation["healthcare"="hospital"](around:10000,${lat},${lng});
        );
        out center tags;
      `;

      const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        query,
        {
          headers: {
            "Content-Type": "text/plain",
          },
          timeout: 20000,
        }
      );

      const hospitalData = response.data.elements
        .map((item) => {
          const hospitalLat = item.lat || item.center?.lat;
          const hospitalLon = item.lon || item.center?.lon;

          if (!hospitalLat || !hospitalLon) {
            return null;
          }

          return {
            id: item.id,
            name: item.tags?.name || "Unnamed Hospital",
            lat: hospitalLat,
            lon: hospitalLon,
            distance: getDistanceKm(
              lat,
              lng,
              hospitalLat,
              hospitalLon
            ),
          };
        })
        .filter(Boolean)
        .filter((hospital) => hospital.distance <= 10)
        .sort((a, b) => a.distance - b.distance);

      if (hospitalData.length === 0) {
        setHospitals([]);
        setError(
          "No real hospital found nearby. Try refresh or allow accurate location."
        );
      } else {
        setHospitals(hospitalData.slice(0, 8));
      }
    } catch (err) {
      console.log("HOSPITAL ERROR:", err);
      setHospitals([]);
      setError("Hospital search failed. Please try again.");
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

      const coords =
        response.data.features[0].geometry.coordinates;

      const convertedCoords = coords.map((coord) => [
        coord[1],
        coord[0],
      ]);

      setRoute(convertedCoords);
    } catch (err) {
      console.log("ROUTE ERROR:", err);
      setError(
        "Fastest route failed. Google Maps navigation will still open."
      );
    }

    setRouteLoading(false);
  };

  const startLiveNavigation = (hospital) => {
    setSelectedHospital(hospital);

    getRoute(
      position[0],
      position[1],
      hospital.lat,
      hospital.lon
    );

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
        <div className="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-300 text-center">
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

            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker position={position}>
              <Popup>Your Live Location</Popup>
            </Marker>

            {hospitals.map((hospital, index) => (
              <Marker
                key={hospital.id}
                position={[hospital.lat, hospital.lon]}
              >
                <Popup>
                  {index + 1}. {hospital.name}
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
            Nearby Hospitals
          </h2>

          <p className="text-gray-400 mt-2">
            Real hospitals only. Select one to draw route and open Google Maps guidance.
          </p>

          {loadingHospitals && (
            <p className="mt-5 text-yellow-400">
              Searching real nearby hospitals...
            </p>
          )}

          {routeLoading && (
            <p className="mt-5 text-cyan-400">
              Finding fastest route...
            </p>
          )}

          <button
            onClick={() =>
              fetchHospitals(position[0], position[1])
            }
            className="mt-5 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold"
          >
            Refresh Nearby Hospitals
          </button>

          <div className="mt-6 space-y-4 max-h-[55vh] overflow-y-auto pr-2">
            {hospitals.map((hospital, index) => (
              <div
                key={hospital.id}
                className={`bg-black/30 border rounded-2xl p-4 ${
                  selectedHospital?.id === hospital.id
                    ? "border-cyan-400"
                    : "border-white/10"
                }`}
              >
                <h3 className="text-lg font-bold">
                  {index + 1}. {hospital.name}
                </h3>

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
                No hospital data available yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
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
