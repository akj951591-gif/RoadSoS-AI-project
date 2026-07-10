import {
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase";

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
  {
    name: "Home",
    icon: FaHome,
    color:
      "from-blue-500 to-cyan-500",
  },

  {
    name: "SOS",
    icon: FaAmbulance,
    color:
      "from-red-500 to-orange-500",
  },

  {
    name: "Nearby Help",
    icon: FaHospital,
    color:
      "from-green-500 to-emerald-500",
  },

  {
    name: "Map",
    icon: FaMapMarkedAlt,
    color:
      "from-purple-500 to-pink-500",
  },

  {
    name: "AI Risk",
    icon: FaShieldAlt,
    color:
      "from-yellow-500 to-orange-500",
  },

  {
    name: "AI Triage",
    icon: FaBrain,
    color:
      "from-indigo-500 to-purple-500",
  },

  {
    name: "Driver Monitor",
    icon: FaCarCrash,
    color:
      "from-red-500 to-pink-500",
  },
];

function App() {
  // FIREBASE USER

  const [
    firebaseUser,
    setFirebaseUser,
  ] = useState(null);

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  // DASHBOARD STATES

  const [
    activeTab,
    setActiveTab,
  ] = useState("Home");

  const [
    isDropdownOpen,
    setIsDropdownOpen,
  ] = useState(false);

  // CHECK FIREBASE LOGIN

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,

        (user) => {
          setFirebaseUser(user);

          setAuthLoading(false);

          if (user) {
            const previousUser =
              JSON.parse(
                localStorage.getItem(
                  "roadsos_user"
                ) || "{}"
              );

            const updatedUser = {
              ...previousUser,

              uid:
                user.uid,

              name:
                user.displayName ||
                previousUser.name ||
                "User",

              email:
                user.email ||
                previousUser.email ||
                "",

              photoURL:
                user.photoURL ||
                previousUser.photoURL ||
                "",
            };

            // Never save password

            delete updatedUser.password;

            localStorage.setItem(
              "roadsos_user",

              JSON.stringify(
                updatedUser
              )
            );
          }
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);

  // FIREBASE LOADING SCREEN

  if (authLoading) {
    return (
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#030303]
        text-white
        "
      >
        <div className="text-center">

          <div
            className="
            w-14
            h-14
            mx-auto
            rounded-full
            border-4
            border-white/20
            border-t-red-500
            animate-spin
            "
          />

          <p
            className="
            mt-4
            text-gray-400
            "
          >
            Loading RoadSoS AI...
          </p>

        </div>
      </div>
    );
  }

  // SHOW LOGIN PAGE

  if (!firebaseUser) {
    return <Login />;
  }

  // GET USER DETAILS

  const savedUser =
    JSON.parse(
      localStorage.getItem(
        "roadsos_user"
      ) || "{}"
    );

  const userName =
    firebaseUser.displayName ||
    savedUser.name ||
    "User";

  const userEmail =
    firebaseUser.email ||
    savedUser.email ||
    "No email available";

  const userPhoto =
    firebaseUser.photoURL ||
    savedUser.photoURL ||
    "";

  const userInitial =
    userName
      .charAt(0)
      .toUpperCase();

  // SHOW SELECTED PAGE

  const renderTab = () => {
    switch (activeTab) {

      case "Home":

        return (
          <DashboardHome
            setActiveTab={
              setActiveTab
            }
          />
        );

      case "SOS":

        return (
          <SOSPanel />
        );

      case "Nearby Help":

        return (
          <NearbyHelp />
        );

      case "Map":

        return (
          <MapView />
        );

      case "AI Risk":

        return (
          <AIPanel />
        );

      case "AI Triage":

        return (
          <AITriage />
        );

      case "Driver Monitor":

        return (
          <DriverMonitor />
        );

      default:

        return (
          <DashboardHome
            setActiveTab={
              setActiveTab
            }
          />
        );
    }
  };

  const currentTab =
    navigationItems.find(
      (item) =>
        item.name ===
        activeTab
    );

  const CurrentIcon =
    currentTab?.icon ||
    FaHome;

  // FIREBASE LOGOUT

  const handleLogout =
    async () => {

      try {

        setIsDropdownOpen(
          false
        );

        setActiveTab(
          "Home"
        );

        await signOut(
          auth
        );

      } catch (error) {

        console.error(
          "Firebase logout error:",
          error
        );

        alert(
          "Unable to log out. Please try again."
        );
      }
    };

  return (
    <div
      className="
      min-h-screen
      bg-[#030303]
      text-white
      overflow-x-hidden
      w-full
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
        sticky
        top-0
        left-0
        w-full
        z-50
        bg-black/80
        backdrop-blur-2xl
        border-b
        border-white/10
        "
      >

        <div
          className="
          max-w-7xl
          mx-auto
          px-3
          sm:px-4
          md:px-5
          py-3
          sm:py-4
          "
        >

          <div
            className="
            flex
            items-center
            justify-between
            gap-2
            sm:gap-5
            "
          >

            {/* LOGO */}

            <h1
              className="
              text-xl
              sm:text-2xl
              md:text-4xl
              font-black
              tracking-tight
              whitespace-nowrap
              "
            >

              <span
                className="
                text-red-500
                "
              >

                RoadSoS

              </span>

              {" "}AI

            </h1>

            {/* RIGHT NAV */}

            <div
              className="
              flex
              items-center
              gap-2
              sm:gap-3
              min-w-0
              "
            >

              {/* TRANSLATOR */}

              <div
                className="
                scale-90
                sm:scale-100
                origin-right
                "
              >

                <GoogleTranslate />

              </div>

              {/* USER MENU */}

              <div
                className="
                relative
                "
              >

                <button
                  type="button"

                  onClick={() => {

                    setIsDropdownOpen(
                      (
                        previous
                      ) =>
                        !previous
                    );

                  }}

                  className="
                  flex
                  items-center
                  gap-2
                  sm:gap-3
                  px-2
                  sm:px-4
                  py-2
                  rounded-full
                  bg-white/10
                  hover:bg-white/20
                  border
                  border-white/10
                  transition-all
                  duration-200
                  max-w-[180px]
                  sm:max-w-none
                  "
                >

                  {/* CURRENT PAGE ICON */}

                  <div
                    className={`
                    p-1
                    rounded-full
                    bg-gradient-to-r
                    ${
                      currentTab?.color ||
                      "from-red-500 to-orange-500"
                    }
                    `}
                  >

                    <CurrentIcon
                      className="
                      text-white
                      text-xs
                      sm:text-sm
                      "
                    />

                  </div>

                  {/* FIREBASE USER PHOTO */}

                  {
                    userPhoto
                    ? (

                      <img
                        src={
                          userPhoto
                        }

                        alt={
                          userName
                        }

                        referrerPolicy=
                          "no-referrer"

                        className="
                        w-8
                        h-8
                        sm:w-10
                        sm:h-10
                        rounded-full
                        object-cover
                        border
                        border-white/20
                        shadow-lg
                        "
                      />

                    )
                    : (

                      <div
                        className="
                        w-8
                        h-8
                        sm:w-10
                        sm:h-10
                        rounded-full
                        bg-gradient-to-r
                        from-red-600
                        to-red-500
                        flex
                        items-center
                        justify-center
                        font-black
                        text-sm
                        sm:text-lg
                        shadow-lg
                        "
                      >

                        {
                          userInitial
                        }

                      </div>

                    )
                  }

                  {/* USER NAME */}

                  <div
                    className="
                    hidden
                    md:block
                    text-left
                    "
                  >

                    <p
                      className="
                      text-sm
                      font-semibold
                      truncate
                      max-w-[120px]
                      "
                    >

                      {
                        userName
                      }

                    </p>

                    <p
                      className="
                      text-xs
                      text-gray-400
                      truncate
                      "
                    >

                      {
                        activeTab
                      }

                    </p>

                  </div>

                  <FaChevronDown
                    className={`
                    text-xs
                    transition-transform
                    duration-200

                    ${
                      isDropdownOpen

                      ? "rotate-180"

                      : ""
                    }
                    `}
                  />

                </button>

                {/* DROPDOWN */}

                {
                  isDropdownOpen
                  && (

                    <>

                      {/* CLOSE BACKGROUND */}

                      <button
                        type="button"

                        aria-label=
                          "Close menu"

                        className="
                        fixed
                        inset-0
                        z-40
                        cursor-default
                        "

                        onClick={() => {

                          setIsDropdownOpen(
                            false
                          );

                        }}
                      />

                      {/* MENU */}

                      <div
                        className="
                        fixed
                        sm:absolute
                        right-3
                        sm:right-0
                        left-3
                        sm:left-auto
                        top-[75px]
                        sm:top-auto
                        sm:mt-2
                        w-auto
                        sm:w-72
                        bg-gray-900/95
                        backdrop-blur-xl
                        border
                        border-gray-700
                        rounded-2xl
                        shadow-2xl
                        overflow-hidden
                        z-50
                        animate-slide-in
                        "
                      >

                        {/* USER PROFILE */}

                        <div
                          className="
                          p-4
                          border-b
                          border-gray-800
                          bg-gradient-to-r
                          from-red-600/10
                          to-blue-600/10
                          "
                        >

                          <div
                            className="
                            flex
                            items-center
                            gap-3
                            "
                          >

                            {
                              userPhoto
                              ? (

                                <img
                                  src={
                                    userPhoto
                                  }

                                  alt={
                                    userName
                                  }

                                  referrerPolicy=
                                    "no-referrer"

                                  className="
                                  w-12
                                  h-12
                                  rounded-full
                                  object-cover
                                  border
                                  border-white/20
                                  shadow-lg
                                  "
                                />

                              )
                              : (

                                <div
                                  className="
                                  w-12
                                  h-12
                                  rounded-full
                                  bg-gradient-to-r
                                  from-red-600
                                  to-red-500
                                  flex
                                  items-center
                                  justify-center
                                  font-bold
                                  text-xl
                                  shadow-lg
                                  "
                                >

                                  {
                                    userInitial
                                  }

                                </div>

                              )
                            }

                            <div
                              className="
                              min-w-0
                              "
                            >

                              <p
                                className="
                                font-bold
                                truncate
                                "
                              >

                                {
                                  userName
                                }

                              </p>

                              <p
                                className="
                                text-xs
                                text-gray-400
                                truncate
                                "
                              >

                                {
                                  userEmail
                                }

                              </p>

                            </div>

                          </div>

                        </div>

                        {/* NAVIGATION ITEMS */}

                        <div
                          className="
                          py-2
                          max-h-[65vh]
                          overflow-y-auto
                          "
                        >

                          {
                            navigationItems.map(

                              (
                                item
                              ) => {

                                const ItemIcon =
                                  item.icon;

                                return (

                                  <button
                                    type="button"

                                    key={
                                      item.name
                                    }

                                    onClick={() => {

                                      setActiveTab(
                                        item.name
                                      );

                                      setIsDropdownOpen(
                                        false
                                      );

                                    }}

                                    className={`
                                    w-full
                                    flex
                                    items-center
                                    gap-3
                                    px-4
                                    py-3
                                    hover:bg-white/10
                                    transition-all
                                    duration-200
                                    group

                                    ${
                                      activeTab ===
                                      item.name

                                      ? "bg-white/5"

                                      : ""
                                    }
                                    `}
                                  >

                                    <div
                                      className={`
                                      p-2
                                      rounded-lg
                                      bg-gradient-to-r
                                      ${item.color}
                                      group-hover:scale-110
                                      transition-transform
                                      `}
                                    >

                                      <ItemIcon
                                        className="
                                        text-white
                                        text-sm
                                        "
                                      />

                                    </div>

                                    <span
                                      className="
                                      flex-1
                                      text-left
                                      font-medium
                                      "
                                    >

                                      {
                                        item.name
                                      }

                                    </span>

                                    {
                                      activeTab ===
                                      item.name
                                      && (

                                        <span
                                          className="
                                          text-xs
                                          text-green-400
                                          "
                                        >

                                          Active

                                        </span>

                                      )
                                    }

                                  </button>

                                );

                              }

                            )
                          }

                        </div>

                        {/* LOGOUT */}

                        <div
                          className="
                          border-t
                          border-gray-800
                          p-2
                          "
                        >

                          <button
                            type="button"

                            onClick={
                              handleLogout
                            }

                            className="
                            w-full
                            flex
                            items-center
                            gap-3
                            px-4
                            py-3
                            text-red-400
                            hover:bg-red-500/10
                            rounded-lg
                            transition-colors
                            "
                          >

                            <FaSignOutAlt />

                            <span>

                              Logout

                            </span>

                          </button>

                        </div>

                      </div>

                    </>

                  )
                }

              </div>

            </div>

          </div>

        </div>

      </nav>

      {/* PAGE */}

      <main
        className="
        px-3
        sm:px-5
        md:px-10
        pb-10
        max-w-7xl
        mx-auto
        w-full
        overflow-x-hidden
        "
      >

        {
          renderTab()
        }

      </main>

      {/* ANIMATION */}

      <style>
        {`

        @keyframes slideIn {

          from {

            transform:
              translateY(
                -10px
              );

            opacity: 0;

          }

          to {

            transform:
              translateY(
                0
              );

            opacity: 1;

          }

        }

        .animate-slide-in {

          animation:
            slideIn
            0.2s
            ease-out;

        }

        `}
      </style>

    </div>
  );
}

export default App;