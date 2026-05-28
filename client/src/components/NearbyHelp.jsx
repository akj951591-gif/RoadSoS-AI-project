import { useEffect, useMemo, useState } from "react";

import {
  FaHospital,
  FaShieldAlt,
  FaAmbulance,
  FaTools,
  FaCarCrash,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearchLocation,
  FaRoute,
  FaStar,
} from "react-icons/fa";

const serviceTypes = [
  {
    name: "Hospitals",
    query: "hospital",
    emergency: "108",
    icon: <FaHospital />,
    color: "from-red-600 to-orange-500",
    text: "Nearest hospitals and trauma care.",
    tag: "Medical",
  },
  {
    name: "Police",
    query: "police station",
    emergency: "100",
    icon: <FaShieldAlt />,
    color: "from-blue-600 to-cyan-500",
    text: "Nearby police support.",
    tag: "Safety",
  },
  {
    name: "Ambulance",
    query: "ambulance service",
    emergency: "108",
    icon: <FaAmbulance />,
    color: "from-green-600 to-emerald-500",
    text: "Emergency ambulance help.",
    tag: "Medical",
  },
  {
    name: "Towing",
    query: "towing service",
    emergency: "112",
    icon: <FaCarCrash />,
    color: "from-orange-600 to-yellow-500",
    text: "Vehicle towing support.",
    tag: "Vehicle",
  },
  {
    name: "Mechanic",
    query: "mechanic near me",
    emergency: "112",
    icon: <FaTools />,
    color: "from-violet-600 to-purple-500",
    text: "Nearby repair help.",
    tag: "Vehicle",
  },
  {
    name: "Puncture Shop",
    query: "tyre puncture repair",
    emergency: "112",
    icon: <FaTools />,
    color: "from-yellow-500 to-orange-500",
    text: "Tyre and puncture repair.",
    tag: "Vehicle",
  },
  {
    name: "Showroom",
    query: "vehicle showroom",
    emergency: "112",
    icon: <FaMapMarkerAlt />,
    color: "from-pink-600 to-red-500",
    text: "Vehicle showrooms nearby.",
    tag: "Vehicle",
  },
];

export default function NearbyHelp() {
  const [position, setPosition] = useState(null);
  const [selected, setSelected] = useState(serviceTypes[0]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        setPosition({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      },
      () => {
        alert("Please allow location permission for nearby help.");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);

  const filteredServices = useMemo(() => {
    return serviceTypes.filter((service) =>
      service.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const openGoogleSearch = (service) => {
    if (!position) {
      alert("Location is loading. Please try again.");
      return;
    }

    window.open(
      `https://www.google.com/maps/search/${encodeURIComponent(
        service.query
      )}/@${position.lat},${position.lng},14z`,
      "_blank"
    );
  };

  const openGoogleNavigation = (service) => {
    if (!position) {
      alert("Location is loading. Please try again.");
      return;
    }

    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${position.lat},${position.lng}&destination=${encodeURIComponent(
        service.query
      )}&travelmode=driving`,
      "_blank"
    );
  };

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#111827]/80 p-8 md:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-red-500/20 blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-6">
                <FaSearchLocation />
                Smart Emergency Locator
              </div>

              <h1 className="text-4xl md:text-6xl font-black leading-tight">
                Nearby Emergency
                <span className="block bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text text-transparent">
                  Help Center
                </span>
              </h1>

              <p className="mt-5 text-gray-400 text-lg">
                Quickly find hospitals, police, ambulance, towing, mechanics,
                puncture shops and showrooms using your live GPS location.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href="tel:112">
                  <button className="px-6 py-4 rounded-2xl bg-red-600 hover:bg-red-700 font-black flex items-center gap-2 shadow-lg shadow-red-600/30">
                    <FaPhoneAlt />
                    Call 112
                  </button>
                </a>

                <button
                  onClick={() => openGoogleSearch(selected)}
                  className="px-6 py-4 rounded-2xl bg-white text-black hover:bg-gray-200 font-black flex items-center gap-2"
                >
                  <FaSearchLocation />
                  Search Selected
                </button>
              </div>
            </div>

            <div className="bg-black/30 border border-white/10 rounded-[2rem] p-6">
              <p className="text-gray-400">Live Location Status</p>

              <div className="mt-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-green-500/20 text-green-400 flex items-center justify-center text-2xl">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    {position ? "GPS Active" : "Fetching GPS..."}
                  </h2>

                  <p className="text-gray-400">
                    {position
                      ? `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`
                      : "Allow location permission"}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <Stat label="Services" value="7+" />
                <Stat label="Mode" value="Live" />
                <Stat label="Global" value="Yes" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help: hospital, police, towing..."
            className="w-full p-5 rounded-2xl bg-white/10 border border-white/10 outline-none text-white placeholder:text-gray-500"
          />
        </div>

        <div className="mt-6 flex gap-3 overflow-x-auto pb-3">
          {serviceTypes.map((service) => (
            <button
              key={service.name}
              onClick={() => setSelected(service)}
              className={`shrink-0 px-5 py-3 rounded-full font-bold flex items-center gap-2 transition ${
                selected.name === service.name
                  ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-600/30"
                  : "bg-white/10 hover:bg-white/20 text-gray-300"
              }`}
            >
              {service.icon}
              {service.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-[#111827]/80 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl">
              <div
                className={`w-24 h-24 rounded-3xl bg-gradient-to-r ${selected.color} flex items-center justify-center text-5xl shadow-xl`}
              >
                {selected.icon}
              </div>

              <div className="mt-6 inline-flex items-center gap-2 text-yellow-400">
                <FaStar />
                Selected Service
              </div>

              <h2 className="text-4xl font-black mt-3">{selected.name}</h2>

              <p className="text-gray-400 mt-4 text-lg">{selected.text}</p>

              <div className="mt-8 space-y-4">
                <a href={`tel:${selected.emergency}`}>
                  <button className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 font-black text-lg flex items-center justify-center gap-3">
                    <FaPhoneAlt />
                    Call {selected.emergency}
                  </button>
                </a>

                <button
                  onClick={() => openGoogleSearch(selected)}
                  className="w-full py-4 rounded-2xl bg-white text-black hover:bg-gray-200 font-black text-lg flex items-center justify-center gap-3"
                >
                  <FaSearchLocation />
                  Find Nearby
                </button>

                <button
                  onClick={() => openGoogleNavigation(selected)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 font-black text-lg flex items-center justify-center gap-3"
                >
                  <FaRoute />
                  Start Route
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.name}
                className="group bg-white/5 border border-white/10 rounded-[2rem] p-7 backdrop-blur-xl hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_35px_rgba(34,211,238,0.15)] transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`text-4xl w-20 h-20 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center`}
                  >
                    {service.icon}
                  </div>

                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-gray-300">
                    {service.tag}
                  </span>
                </div>

                <h2 className="text-2xl font-black mt-6">{service.name}</h2>

                <p className="text-gray-400 mt-3">{service.text}</p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a href={`tel:${service.emergency}`}>
                    <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold">
                      Call
                    </button>
                  </a>

                  <button
                    onClick={() => openGoogleSearch(service)}
                    className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold"
                  >
                    Find
                  </button>

                  <button
                    onClick={() => openGoogleNavigation(service)}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl font-bold"
                  >
                    Route
                  </button>
                </div>
              </div>
            ))}

            {filteredServices.length === 0 && (
              <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-[2rem] p-10 text-center text-gray-400">
                No service found.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 text-center">
      <h3 className="text-2xl font-black text-cyan-400">{value}</h3>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}