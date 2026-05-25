import { useState } from "react";

import {
  FaHome,
  FaAmbulance,
  FaMapMarkedAlt,
  FaBrain,
  FaHospital,
  FaCarCrash,
  FaSignOutAlt,
} from "react-icons/fa";

import Login from "./components/Login";
import DashboardHome from "./components/DashboardHome";
import SOSPanel from "./components/SOSPanel";
import NearbyHelp from "./components/NearbyHelp";
import MapView from "./components/MapView";
import AITriage from "./components/AITriage";
import DriverMonitor from "./components/DriverMonitor";

const tabs = [
  {
    name: "Home",
    icon: <FaHome />,
  },

  {
    name: "SOS",
    icon: <FaAmbulance />,
  },

  {
    name: "Nearby Help",
    icon: <FaHospital />,
  },

  {
    name: "Map",
    icon: <FaMapMarkedAlt />,
  },

  {
    name: "AI Triage",
    icon: <FaBrain />,
  },

  {
    name: "Driver Monitor",
    icon: <FaCarCrash />,
  },
];

function App() {

  const [isLoggedIn, setIsLoggedIn] =
    useState(
      localStorage.getItem(
        "roadsos_loggedin"
      ) === "true"
    );

  const [activeTab, setActiveTab] =
    useState("Home");

  // LOGIN PAGE

  if (!isLoggedIn) {

    return (

      <Login
        onLogin={() => {

          localStorage.setItem(
            "roadsos_loggedin",
            "true"
          );

          setIsLoggedIn(true);
        }}
      />

    );
  }

  // TAB RENDERING

  const renderTab = () => {

    if (activeTab === "Home") {

      return (

        <DashboardHome
          setActiveTab={setActiveTab}
        />

      );
    }

    if (activeTab === "SOS") {

      return <SOSPanel />;
    }

    if (activeTab === "Nearby Help") {

      return <NearbyHelp />;
    }

    if (activeTab === "Map") {

      return <MapView />;
    }

    if (activeTab === "AI Triage") {

      return <AITriage />;
    }

    if (activeTab === "Driver Monitor") {

      return <DriverMonitor />;
    }

    return (

      <DashboardHome
        setActiveTab={setActiveTab}
      />

    );
  };

  return (

    <div
      className="
      min-h-screen
      bg-[#030303]
      text-white
      overflow-hidden
      "
    >

      {/* BACKGROUND */}

      <div
        className="
        fixed
        inset-0
        -z-10
        bg-[radial-gradient(circle_at_top_left,#7f1d1d55,transparent_35%),radial-gradient(circle_at_bottom_right,#1e3a8a55,transparent_35%)]
        "
      />

      {/* NAVBAR */}

      <nav
        className="
        fixed
        top-0
        left-0
        w-full
        z-50
        bg-black/50
        backdrop-blur-2xl
        border-b
        border-white/10
        "
      >

        <div
          className="
          max-w-7xl
          mx-auto
          px-5
          py-4
          flex
          flex-wrap
          items-center
          justify-between
          gap-5
          "
        >

          {/* LOGO */}

          <h1
            className="
            text-2xl
            md:text-3xl
            font-black
            tracking-tight
            "
          >

            <span className="text-red-500">
              RoadSoS
            </span>

            {" "}AI

          </h1>

          {/* RIGHT SECTION */}

          <div
            className="
            flex
            items-center
            justify-end
            gap-3
            flex-wrap
            "
          >

            {/* TABS */}

            {
              tabs.map((tab) => (

                <button
                  key={tab.name}

                  onClick={() =>
                    setActiveTab(tab.name)
                  }

                  className={`
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-bold
                  transition-all

                  ${
                    activeTab === tab.name

                    ? "bg-red-600 text-white shadow-lg shadow-red-600/40 scale-105"

                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }
                  `}
                >

                  {tab.icon}

                  {tab.name}

                </button>
              ))
            }

            {/* USER PROFILE */}

            <div
              className="
              flex
              items-center
              gap-3
              px-4
              py-2
              rounded-full
              bg-white/10
              border
              border-white/10
              ml-2
              "
            >

              {/* AVATAR */}

              <div
                className="
                w-10
                h-10
                rounded-full
                bg-red-600
                flex
                items-center
                justify-center
                font-black
                text-lg
                shadow-lg
                shadow-red-600/40
                "
              >

                {
                  JSON.parse(
                    localStorage.getItem(
                      "roadsos_user"
                    )
                  )?.name?.charAt(0)
                }

              </div>

              {/* USER DETAILS */}

              <div className="text-left">

                <p
                  className="
                  text-xs
                  text-gray-400
                  "
                >

                  Logged in as

                </p>

                <h3
                  className="
                  text-sm
                  font-bold
                  "
                >

                  {
                    JSON.parse(
                      localStorage.getItem(
                        "roadsos_user"
                      )
                    )?.name
                  }

                </h3>

              </div>

            </div>

            {/* LOGOUT */}

            <button

              onClick={() => {

                localStorage.removeItem(
                  "roadsos_loggedin"
                );

                setIsLoggedIn(false);

                setActiveTab("Home");
              }}

              className="
              flex
              items-center
              gap-2
              px-5
              py-2
              rounded-full
              text-sm
              font-bold
              bg-red-600
              hover:bg-red-700
              text-white
              transition
              shadow-lg
              shadow-red-600/40
              "
            >

              <FaSignOutAlt />

              Logout

            </button>

          </div>

        </div>

      </nav>

      {/* PAGE CONTENT */}

      <main
        className="
        pt-32
        px-4
        md:px-10
        pb-10
        max-w-7xl
        mx-auto
        "
      >

        {renderTab()}

      </main>

    </div>
  );
}

export default App;