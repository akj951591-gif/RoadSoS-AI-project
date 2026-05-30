import { useState } from "react";

import {
  FaHome,
  FaAmbulance,
  FaMapMarkedAlt,
  FaBrain,
  FaHospital,
  FaCarCrash,
  FaSignOutAlt,
  FaShieldAlt,
  FaChevronDown,
} from "react-icons/fa";

import Login from "./components/Login";
import DashboardHome from "./components/DashboardHome";
import SOSPanel from "./components/SOSPanel";
import NearbyHelp from "./components/NearbyHelp";
import MapView from "./components/MapView";
import AITriage from "./components/AITriage";
import AIPanel from "./components/AIPanel";
import DriverMonitor from "./components/DriverMonitor";
import GoogleTranslate from "./components/GoogleTranslate";

const navigationItems = [
  { name: "Home", icon: FaHome, color: "from-blue-500 to-cyan-500" },
  { name: "SOS", icon: FaAmbulance, color: "from-red-500 to-orange-500" },
  { name: "Nearby Help", icon: FaHospital, color: "from-green-500 to-emerald-500" },
  { name: "Map", icon: FaMapMarkedAlt, color: "from-purple-500 to-pink-500" },
  { name: "AI Risk", icon: FaShieldAlt, color: "from-yellow-500 to-orange-500" },
  { name: "AI Triage", icon: FaBrain, color: "from-indigo-500 to-purple-500" },
  { name: "Driver Monitor", icon: FaCarCrash, color: "from-red-500 to-pink-500" },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("roadsos_loggedin") === "true"
  );

  const [activeTab, setActiveTab] = useState("Home");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={() => {
          localStorage.setItem("roadsos_loggedin", "true");
          setIsLoggedIn(true);
        }}
      />
    );
  }

  const savedUser = JSON.parse(localStorage.getItem("roadsos_user") || "{}");

  const renderTab = () => {
    switch (activeTab) {
      case "Home":
        return <DashboardHome setActiveTab={setActiveTab} />;
      case "SOS":
        return <SOSPanel />;
      case "Nearby Help":
        return <NearbyHelp />;
      case "Map":
        return <MapView />;
      case "AI Risk":
        return <AIPanel />;
      case "AI Triage":
        return <AITriage />;
      case "Driver Monitor":
        return <DriverMonitor />;
      default:
        return <DashboardHome setActiveTab={setActiveTab} />;
    }
  };

  const currentTab = navigationItems.find((item) => item.name === activeTab);
  const CurrentIcon = currentTab?.icon || FaHome;

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden w-full">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#7f1d1d55,transparent_35%),radial-gradient(circle_at_bottom_right,#1e3a8a55,transparent_35%)]" />

      <nav className="sticky top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-5">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-black tracking-tight whitespace-nowrap">
              <span className="text-red-500">RoadSoS</span> AI
            </h1>

            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="scale-90 sm:scale-100 origin-right">
                <GoogleTranslate />
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-200 max-w-[170px] sm:max-w-none"
                >
                  <div
                    className={`p-1 rounded-full bg-gradient-to-r ${
                      currentTab?.color || "from-red-500 to-orange-500"
                    }`}
                  >
                    <CurrentIcon className="text-white text-xs sm:text-sm" />
                  </div>

                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center font-black text-sm sm:text-lg shadow-lg">
                    {savedUser?.name?.charAt(0) || "U"}
                  </div>

                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold truncate max-w-[120px]">
                      {savedUser?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{activeTab}</p>
                  </div>

                  <FaChevronDown
                    className={`text-xs transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />

                    <div className="fixed sm:absolute right-3 sm:right-0 left-3 sm:left-auto top-[75px] sm:top-auto sm:mt-2 w-auto sm:w-72 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-in">
                      <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-red-600/10 to-blue-600/10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center font-bold text-xl shadow-lg">
                            {savedUser?.name?.charAt(0) || "U"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold truncate">
                              {savedUser?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {savedUser?.email || "user@example.com"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2 max-h-[65vh] overflow-y-auto">
                        {navigationItems.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => {
                              setActiveTab(item.name);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-all duration-200 group ${
                              activeTab === item.name ? "bg-white/5" : ""
                            }`}
                          >
                            <div
                              className={`p-2 rounded-lg bg-gradient-to-r ${item.color} group-hover:scale-110 transition-transform`}
                            >
                              <item.icon className="text-white text-sm" />
                            </div>

                            <span className="flex-1 text-left font-medium">
                              {item.name}
                            </span>

                            {activeTab === item.name && (
                              <span className="text-xs text-green-400">
                                Active
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-gray-800 p-2">
                        <button
                          onClick={() => {
                            localStorage.removeItem("roadsos_loggedin");
                            setIsLoggedIn(false);
                            setActiveTab("Home");
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <FaSignOutAlt />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="px-3 sm:px-5 md:px-10 pb-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        {renderTab()}
      </main>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;