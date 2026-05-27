import { useEffect, useState } from "react";

import {
  FaAmbulance,
  FaHospital,
  FaMapMarkedAlt,
  FaBrain,
  FaCarCrash,
  FaShieldAlt,
  FaSms,
  FaMapMarkerAlt,
  FaBolt,
  FaPhoneAlt,
  FaHeartbeat,
} from "react-icons/fa";

const cards = [
  {
    title: "Emergency SOS",
    desc: "Trigger SOS and share live location instantly.",
    icon: <FaAmbulance />,
    tab: "SOS",
    color: "from-red-600 to-orange-500",
  },

  {
    title: "Nearby Help",
    desc: "Find hospitals, police, towing and rescue.",
    icon: <FaHospital />,
    tab: "Nearby Help",
    color: "from-cyan-600 to-blue-500",
  },

  {
    title: "Live Map",
    desc: "Live route guidance and emergency navigation.",
    icon: <FaMapMarkedAlt />,
    tab: "Map",
    color: "from-violet-600 to-purple-500",
  },

  {
    title: "AI Triage",
    desc: "AI powered accident severity prediction.",
    icon: <FaBrain />,
    tab: "AI Triage",
    color: "from-green-600 to-emerald-500",
  },

  {
    title: "Driver Monitor",
    desc: "Real-time drowsiness and safety detection.",
    icon: <FaCarCrash />,
    tab: "Driver Monitor",
    color: "from-yellow-500 to-orange-500",
  },
];

export default function DashboardHome({
  setActiveTab,
}) {
  const savedUser =
    JSON.parse(
      localStorage.getItem(
        "roadsos_user"
      )
    ) || {};

  const [location, setLocation] =
    useState(null);

  const [network, setNetwork] =
    useState(
      navigator.onLine
    );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      }
    );

    const online = () =>
      setNetwork(true);

    const offline = () =>
      setNetwork(false);

    window.addEventListener(
      "online",
      online
    );

    window.addEventListener(
      "offline",
      offline
    );

    return () => {
      window.removeEventListener(
        "online",
        online
      );

      window.removeEventListener(
        "offline",
        offline
      );
    };
  }, []);

  const sendDirectSMS = () => {
    if (!savedUser?.phone) {
      alert(
        "No emergency number saved."
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const lat =
          location.coords.latitude;

        const lng =
          location.coords.longitude;

        const phone =
          savedUser.phone.replace(
            /\D/g,
            ""
          );

        const message =
          `🚨 RoadSoS Emergency Alert 🚨\n\n` +
          `${savedUser.name || "User"} needs immediate help.\n\n` +
          `📍 Live Location:\n` +
          `https://maps.google.com/?q=${lat},${lng}\n\n` +
          `Please contact emergency services immediately.`;

        window.location.href =
          `sms:${phone}?body=${encodeURIComponent(
            message
          )}`;
      }
    );
  };

  return (
    <section className="py-8 md:py-10">
      {/* HERO */}

      <div className="text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mb-8 animate-pulse">
          <FaShieldAlt />

          RoadSoS AI Emergency System
        </div>

        <h1 className="text-5xl md:text-7xl font-black leading-tight">
          Smart Emergency
          <span className="block bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            Response Dashboard
          </span>
        </h1>

        <p className="mt-6 text-gray-400 text-lg md:text-2xl">
          AI powered road safety,
          live navigation,
          crash detection,
          emergency rescue
          and real-time assistance.
        </p>

        {/* QUICK STATUS */}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3 justify-center">
              <FaMapMarkerAlt className="text-red-500 text-2xl" />

              <div>
                <p className="text-gray-400 text-sm">
                  GPS Status
                </p>

                <h3 className="font-black text-lg">
                  {location
                    ? "Active"
                    : "Fetching"}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3 justify-center">
              <FaBolt className="text-yellow-400 text-2xl" />

              <div>
                <p className="text-gray-400 text-sm">
                  Network
                </p>

                <h3 className="font-black text-lg">
                  {network
                    ? "Online"
                    : "Offline"}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3 justify-center">
              <FaHeartbeat className="text-green-400 text-2xl" />

              <div>
                <p className="text-gray-400 text-sm">
                  Emergency System
                </p>

                <h3 className="font-black text-lg">
                  Ready
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">
          <button
            onClick={() =>
              setActiveTab("SOS")
            }
            className="
            px-10
            py-5
            rounded-3xl
            bg-gradient-to-r
            from-red-600
            to-orange-500
            hover:scale-105
            transition
            font-black
            text-xl
            shadow-2xl
            shadow-red-600/40
            flex
            items-center
            justify-center
            gap-3
            "
          >
            <FaAmbulance />

            Emergency SOS
          </button>

          <button
            onClick={sendDirectSMS}
            className="
            px-10
            py-5
            rounded-3xl
            bg-gradient-to-r
            from-yellow-500
            to-orange-500
            hover:scale-105
            transition
            font-black
            text-xl
            text-black
            shadow-2xl
            shadow-yellow-500/30
            flex
            items-center
            justify-center
            gap-3
            "
          >
            <FaSms />

            Direct SMS SOS
          </button>

          <a href="tel:112">
            <button
              className="
              px-10
              py-5
              rounded-3xl
              bg-gradient-to-r
              from-cyan-600
              to-blue-500
              hover:scale-105
              transition
              font-black
              text-xl
              shadow-2xl
              shadow-cyan-600/30
              flex
              items-center
              justify-center
              gap-3
              "
            >
              <FaPhoneAlt />

              Call 112
            </button>
          </a>
        </div>
      </div>

      {/* FEATURE CARDS */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7 mt-16">
        {cards.map((card) => (
          <button
            key={card.title}
            onClick={() =>
              setActiveTab(card.tab)
            }
            className="
            group
            text-left
            bg-white/5
            border
            border-white/10
            rounded-[2rem]
            p-8
            backdrop-blur-xl
            hover:scale-[1.03]
            hover:border-red-500/40
            transition-all
            duration-300
            "
          >
            <div
              className={`
              text-5xl
              w-24
              h-24
              rounded-3xl
              bg-gradient-to-r
              ${card.color}
              flex
              items-center
              justify-center
              shadow-2xl
              `}
            >
              {card.icon}
            </div>

            <h2 className="text-3xl font-black mt-8 group-hover:text-red-400 transition">
              {card.title}
            </h2>

            <p className="mt-4 text-gray-400 leading-relaxed">
              {card.desc}
            </p>

            <div className="mt-8 flex items-center gap-2 text-red-400 font-black text-lg">
              Open Dashboard →

            </div>
          </button>
        ))}
      </div>
    </section>
  );
}