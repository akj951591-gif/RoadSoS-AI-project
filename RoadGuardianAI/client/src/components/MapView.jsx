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

  const [selectedHospital, setSelectedHospital] =
    useState(null);

  const API_KEY =
    import.meta.env.VITE_ORS_API_KEY;
    console.log("ORS KEY:", API_KEY);

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(
      async (location) => {

        const lat = location.coords.latitude;
        const lng = location.coords.longitude;

        setPosition([lat, lng]);

        fetchHospitals(lat, lng);

      },
      (error) => {
        console.log(error);
      }
    );

  }, []);

  const fetchHospitals = async (lat, lng) => {

    try {

      // Overpass API (FREE)
      const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:10000,${lat},${lng});
      );
      out;
      `;

      const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        query,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );

      const hospitalData = response.data.elements;

      setHospitals(hospitalData);

      if (hospitalData.length > 0) {

        getRoute(
          lat,
          lng,
          hospitalData[0].lat,
          hospitalData[0].lon
        );

        setSelectedHospital(hospitalData[0]);
      }

    } catch (error) {

      console.log(error);
    }
  };

  const getRoute = async (
    startLat,
    startLng,
    endLat,
    endLng
  ) => {

    try {

      const response = await axios.get(
        `https://api.openrouteservice.org/v2/directions/driving-car`,
        {
          params: {
            api_key: API_KEY,
            start: `${startLng},${startLat}`,
            end: `${endLng},${endLat}`,
          },
        }
      );

      const coords =
        response.data.features[0].geometry.coordinates;

      const convertedCoords = coords.map(
        (coord) => [coord[1], coord[0]]
      );

      setRoute(convertedCoords);

    } catch (error) {

      console.log(error);
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

      <h1
        className="
        text-5xl
        font-black
        text-center
        mb-8
        "
      >
        Nearest Hospital Route
      </h1>

      <div
        className="
        grid
        lg:grid-cols-3
        gap-6
        "
      >

        <div className="lg:col-span-2">

          <MapContainer
            center={position}
            zoom={14}
            className="
            h-[75vh]
            rounded-[2rem]
            "
          >

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={position}>
              <Popup>Your Location</Popup>
            </Marker>

            {
              hospitals.map((hospital, index) => (

                <Marker
                  key={index}
                  position={[
                    hospital.lat,
                    hospital.lon
                  ]}
                >

                  <Popup>
                    {
                      hospital.tags.name ||
                      "Hospital"
                    }
                  </Popup>

                </Marker>
              ))
            }

            {
              route.length > 0 && (

                <Polyline
                  positions={route}
                  color="red"
                />
              )
            }

          </MapContainer>

        </div>

        <div
          className="
          bg-white/5
          border
          border-white/10
          rounded-[2rem]
          p-6
          backdrop-blur-xl
          "
        >

          <h2 className="text-3xl font-black text-red-500">
            Nearby Hospitals
          </h2>

          <div className="mt-6 space-y-4">

            {
              hospitals.slice(0,5).map(
                (hospital, index) => (

                <div
                  key={index}
                  className="
                  bg-black/30
                  border
                  border-white/10
                  rounded-2xl
                  p-4
                  "
                >

                  <h3 className="text-lg font-bold">

                    {
                      hospital.tags.name ||
                      "Unnamed Hospital"
                    }

                  </h3>

                  <p className="text-gray-400 mt-2">

                    Emergency Hospital Nearby

                  </p>

                  <button
                    onClick={() => {

                      setSelectedHospital(
                        hospital
                      );

                      getRoute(
                        position[0],
                        position[1],
                        hospital.lat,
                        hospital.lon
                      );
                    }}

                    className="
                    mt-4
                    w-full
                    py-3
                    bg-red-600
                    hover:bg-red-700
                    rounded-xl
                    font-bold
                    "
                  >

                    Show Fastest Route

                  </button>

                </div>
              ))
            }

          </div>

        </div>

      </div>

    </section>
  );
}