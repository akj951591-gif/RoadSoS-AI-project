import { useEffect, useState } from "react";
import axios from "axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

export default function MapView() {
  const [position, setPosition] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [route, setRoute] = useState([]);
  const [error, setError] = useState("");
  const [loadingHospitals, setLoadingHospitals] = useState(false);

  const API_KEY = import.meta.env.VITE_ORS_API_KEY;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        const lat = location.coords.latitude;
        const lng = location.coords.longitude;

        setPosition([lat, lng]);
        fetchHospitals(lat, lng);
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
  }, []);

  const fetchHospitals = async (lat, lng) => {
    setLoadingHospitals(true);
    setError("");

    try {
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:10000,${lat},${lng});
          way["amenity"="hospital"](around:10000,${lat},${lng});
          relation["amenity"="hospital"](around:10000,${lat},${lng});
          node["healthcare"="hospital"](around:10000,${lat},${lng});
          way["healthcare"="hospital"](around:10000,${lat},${lng});
        );
        out center tags;
      `;

      const response = await axios.post(
        "https://overpass.kumi.systems/api/interpreter",
        query,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );

      const hospitalData = response.data.elements
        .map((item) => {
          const hospitalLat = item.lat || item.center?.lat;
          const hospitalLon = item.lon || item.center?.lon;

          if (!hospitalLat || !hospitalLon) return null;

          return {
            id: item.id,
            name: item.tags?.name || "Unnamed Hospital",
            lat: hospitalLat,
            lon: hospitalLon,
            distance: getDistanceKm(lat, lng, hospitalLat, hospitalLon),
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.distance - b.distance);

      setHospitals(hospitalData.slice(0, 8));

      if (hospitalData.length > 0) {
        getRoute(lat, lng, hospitalData[0].lat, hospitalData[0].lon);
      } else {
        setError("No hospital found nearby. Try increasing search radius.");
      }
    } catch (err) {
      console.log(err);
      setError("Hospital search failed on deployed site. Overpass API may be blocked or busy.");
    }

    setLoadingHospitals(false);
  };

  const getRoute = async (startLat, startLng, endLat, endLng) => {
    if (!API_KEY) {
      setError("OpenRouteService API key missing in Vercel environment variables.");
      return;
    }

    try {
      const response = await axios.get(
        "https://api.openrouteservice.org/v2/directions/driving-car",
        {
          params: {
            api_key: API_KEY,
            start: `${startLng},${startLat}`,
            end: `${endLng},${endLat}`,
          },
        }
      );

      const coords = response.data.features[0].geometry.coordinates;
      const convertedCoords = coords.map((coord) => [coord[1], coord[0]]);

      setRoute(convertedCoords);
    } catch (err) {
      console.log(err);
      setError("Route failed. Check VITE_ORS_API_KEY in Vercel.");
    }
  };

  if (!position) {
    return (
      <div className="text-center py-20 text-3xl">
        Loading Map...
      </div>
    );
  }

  return (
    <section className="py-10">
      <h1 className="text-5xl font-black text-center mb-8">
        Nearest Hospital Route
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
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker position={position}>
              <Popup>Your Location</Popup>
            </Marker>

            {hospitals.map((hospital) => (
              <Marker key={hospital.id} position={[hospital.lat, hospital.lon]}>
                <Popup>{hospital.name}</Popup>
              </Marker>
            ))}

            {route.length > 0 && (
              <Polyline positions={route} color="red" />
            )}
          </MapContainer>
        </div>

        <div className="bg-[#111827]/70 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
          <h2 className="text-3xl font-black text-cyan-400">
            Nearby Hospitals
          </h2>

          {loadingHospitals && (
            <p className="mt-5 text-yellow-400">Searching hospitals...</p>
          )}

          <div className="mt-6 space-y-4">
            {hospitals.map((hospital, index) => (
              <div
                key={hospital.id}
                className="bg-black/30 border border-white/10 rounded-2xl p-4"
              >
                <h3 className="text-lg font-bold">
                  {index + 1}. {hospital.name}
                </h3>

                <p className="text-gray-400 mt-2">
                  Approx distance: {hospital.distance.toFixed(2)} km
                </p>

                <button
                  onClick={() =>
                    getRoute(
                      position[0],
                      position[1],
                      hospital.lat,
                      hospital.lon
                    )
                  }
                  className="mt-4 w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 rounded-xl font-bold"
                >
                  Show Fastest Route
                </button>
              </div>
            ))}
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