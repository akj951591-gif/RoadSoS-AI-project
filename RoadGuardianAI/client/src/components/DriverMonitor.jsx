import { useEffect, useState } from "react";

import {
  FaCarCrash,
  FaEye,
  FaShieldAlt,
  FaHeartbeat,
  FaWifi,
} from "react-icons/fa";

export default function DriverMonitor() {
  const [status, setStatus] =
    useState("LOADING");

  const [error, setError] =
    useState("");

  const [lastUpdated, setLastUpdated] =
    useState("");

  const DRIVER_API =
    "https://roadsos-ai-project-2.onrender.com";

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(
          `${DRIVER_API}/driver-status`
        );

        const data =
          await response.json();

        setStatus(data.status);

        setLastUpdated(
          new Date().toLocaleTimeString()
        );

        setError("");
      } catch {
        setStatus("OFFLINE");

        setError(
          "Driver monitoring server not responding."
        );
      }
    };

    fetchStatus();

    const interval =
      setInterval(fetchStatus, 1000);

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <section className="min-h-[75vh] flex items-center justify-center py-10">
      <div
        className="
        w-full
        max-w-5xl
        bg-[#111827]/70
        border
        border-white/10
        rounded-[2rem]
        p-8
        md:p-12
        shadow-2xl
        backdrop-blur-2xl
        "
      >

        {/* HEADER */}

        <div className="text-center">
          <div
            className="
            inline-flex
            items-center
            gap-3
            px-5
            py-2
            rounded-full
            bg-violet-500/10
            border
            border-violet-500/30
            text-violet-400
            mb-8
            "
          >

            <FaShieldAlt />

            AI Driver Safety Monitoring

          </div>

          <h1
            className="
            text-5xl
            md:text-6xl
            font-black
            bg-gradient-to-r
            from-violet-400
            to-cyan-400
            bg-clip-text
            text-transparent
            "
          >

            Driver Monitor AI

          </h1>

          <p className="mt-5 text-gray-400 text-lg">
            Real-time OpenCV based drowsiness detection
            connected with live emergency system.
          </p>
        </div>

        {/* STATUS CARDS */}

        <div className="grid md:grid-cols-3 gap-5 mt-12">

          <div
            className="
            bg-white/5
            border
            border-white/10
            rounded-3xl
            p-6
            text-center
            "
          >

            <FaEye className="text-4xl text-cyan-400 mx-auto" />

            <p className="mt-4 text-gray-400">
              Eye Detection
            </p>

            <h2 className="text-2xl font-black mt-2">
              Active
            </h2>

          </div>

          <div
            className="
            bg-white/5
            border
            border-white/10
            rounded-3xl
            p-6
            text-center
            "
          >

            <FaWifi className="text-4xl text-green-400 mx-auto" />

            <p className="mt-4 text-gray-400">
              API Connection
            </p>

            <h2 className="text-2xl font-black mt-2">
              {
                status === "OFFLINE"
                  ? "Offline"
                  : "Connected"
              }
            </h2>

          </div>

          <div
            className="
            bg-white/5
            border
            border-white/10
            rounded-3xl
            p-6
            text-center
            "
          >

            <FaHeartbeat className="text-4xl text-red-400 mx-auto" />

            <p className="mt-4 text-gray-400">
              System Status
            </p>

            <h2 className="text-2xl font-black mt-2">
              Monitoring
            </h2>

          </div>

        </div>

        {/* MAIN STATUS */}

        <div
          className={`
          mt-12
          text-center
          rounded-[2rem]
          p-10
          border
          transition-all

          ${
            status === "SAFE"

            ? "bg-green-500/10 border-green-500/30"

            : status === "DROWSY"

            ? "bg-red-500/10 border-red-500/30 animate-pulse"

            : "bg-yellow-500/10 border-yellow-500/30"
          }
          `}
        >

          <FaCarCrash
            className={`
            text-7xl
            mx-auto

            ${
              status === "SAFE"
                ? "text-green-400"

                : status === "DROWSY"
                ? "text-red-400"

                : "text-yellow-400"
            }
            `}
          />

          <h2
            className={`
            mt-6
            text-6xl
            font-black

            ${
              status === "SAFE"
                ? "text-green-400"

                : status === "DROWSY"
                ? "text-red-400"

                : "text-yellow-400"
            }
            `}
          >

            {status}

          </h2>

          <p className="mt-4 text-gray-400 text-lg">
            {
              status === "SAFE"
                ? "Driver is alert and safe."

                : status === "DROWSY"
                ? "Drowsiness detected. Please stop and rest."

                : "Connecting to driver monitoring system..."
            }
          </p>

          {
            lastUpdated && (

              <p className="mt-4 text-sm text-gray-500">
                Last updated:
                {" "}
                {lastUpdated}
              </p>

            )
          }

          {
            error && (

              <p className="mt-5 text-red-400">
                {error}
              </p>

            )
          }

        </div>

      </div>
    </section>
  );
}