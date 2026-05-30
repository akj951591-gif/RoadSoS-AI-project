import { useEffect, useRef, useState } from "react";
import {
  FaCarCrash,
  FaEye,
  FaShieldAlt,
  FaHeartbeat,
  FaWifi,
  FaBell,
} from "react-icons/fa";

export default function DriverMonitor() {
  const [status, setStatus] = useState("LOADING");
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [drowsySeconds, setDrowsySeconds] = useState(0);
  const [alarmEnabled, setAlarmEnabled] = useState(false);

  const alarmRef = useRef(null);

  const DRIVER_API = "https://roadsos-ai-project-2.onrender.com";

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${DRIVER_API}/driver-status`);
        const data = await response.json();

        setStatus(data.status);
        setLastUpdated(new Date().toLocaleTimeString());
        setError("");
      } catch {
        setStatus("OFFLINE");
        setError("Driver monitoring server not responding.");
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer;

    if (status === "DROWSY") {
      timer = setInterval(() => {
        setDrowsySeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setDrowsySeconds(0);
      stopAlarm();
    }

    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (drowsySeconds >= 10 && alarmEnabled) {
      startAlarm();
  
      if (navigator.vibrate) {
        navigator.vibrate([1000, 500, 1000, 500, 1000]);
      }
    }
  
    if (drowsySeconds >= 15) {
      localStorage.setItem("roadsos_auto_sos", "true");
  
      window.dispatchEvent(
        new CustomEvent("roadsos-auto-sos")
      );
    }
  }, [drowsySeconds, alarmEnabled]);

  const startAlarm = async () => {
    try {
      if (!alarmRef.current) return;

      alarmRef.current.currentTime = 0;
      await alarmRef.current.play();
      setError("");
    } catch (err) {
      console.log(err);
      setError("Alarm blocked. Click Enable Alarm Sound first.");
    }
  };

  const stopAlarm = () => {
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
  };

  const enableAlarm = async () => {
    try {
      if (!alarmRef.current) return;

      await alarmRef.current.play();
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;

      setAlarmEnabled(true);
      setError("");
      alert("Alarm enabled successfully.");
    } catch (err) {
      console.log(err);
      alert("Browser blocked sound. Click again or allow audio.");
    }
  };

  return (
    <section className="min-h-[75vh] flex items-center justify-center py-10">
      {/* Put alarm.mp3 inside client/public/alarm.mp3 */}
      <audio ref={alarmRef} src="/alarm.mp3" preload="auto" loop />

      <div className="w-full max-w-5xl-flex items bg-[#111827]/70 border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl backdrop-blur-2xl">
        <div className="text-center">
          <div className="inline-center gap-3 px-5 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 mb-8">
            <FaShieldAlt />
            AI Driver Safety Monitoring
          </div>

          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Driver Monitor AI
          </h1>

          <p className="mt-5 text-gray-400 text-lg">
            Alarm rings if driver stays drowsy for more than 20 seconds.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={enableAlarm}
              className={`px-7 py-4 rounded-2xl font-black inline-flex items-center justify-center gap-3 transition ${
                alarmEnabled
                  ? "bg-green-500 text-black"
                  : "bg-yellow-500 hover:bg-yellow-600 text-black"
              }`}
            >
              <FaBell />
              {alarmEnabled ? "Alarm Enabled" : "Enable Alarm Sound"}
            </button>

            <button
              onClick={startAlarm}
              className="px-7 py-4 rounded-2xl bg-red-600 hover:bg-red-700 font-black"
            >
              Test Alarm
            </button>

            <button
              onClick={stopAlarm}
              className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 font-black"
            >
              Stop Alarm
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-12">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
            <FaEye className="text-4xl text-cyan-400 mx-auto" />
            <p className="mt-4 text-gray-400">Eye Detection</p>
            <h2 className="text-2xl font-black mt-2">
              {status === "OFFLINE" ? "Offline" : "Active"}
            </h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
            <FaWifi className="text-4xl text-green-400 mx-auto" />
            <p className="mt-4 text-gray-400">API Connection</p>
            <h2 className="text-2xl font-black mt-2">
              {status === "OFFLINE" ? "Offline" : "Connected"}
            </h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
            <FaHeartbeat className="text-4xl text-red-400 mx-auto" />
            <p className="mt-4 text-gray-400">Alarm System</p>
            <h2 className="text-2xl font-black mt-2">
              {drowsySeconds >= 10 && alarmEnabled ? "Ringing" : "Standby"}
            </h2>
          </div>
        </div>

        <div
          className={`mt-12 text-center rounded-[2rem] p-10 border transition-all ${
            status === "SAFE"
              ? "bg-green-500/10 border-green-500/30"
              : status === "DROWSY"
              ? "bg-red-500/10 border-red-500/30 animate-pulse"
              : "bg-yellow-500/10 border-yellow-500/30"
          }`}
        >
          <FaCarCrash
            className={`text-7xl mx-auto ${
              status === "SAFE"
                ? "text-green-400"
                : status === "DROWSY"
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          />

          <h2
            className={`mt-6 text-6xl font-black ${
              status === "SAFE"
                ? "text-green-400"
                : status === "DROWSY"
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {status}
          </h2>

          <p className="mt-4 text-gray-400 text-lg">
            {status === "SAFE"
              ? "Driver is alert and safe."
              : status === "DROWSY"
              ? "Drowsiness detected. Please stop and rest."
              : "Connecting to driver monitoring system..."}
          </p>

          {status === "DROWSY" && (
            <div className="mt-6 bg-black/30 border border-red-500/30 rounded-2xl p-5">
              <p className="text-red-400 font-bold text-xl">
                Drowsy for {drowsySeconds}s
              </p>

              {drowsySeconds < 10 ? (
                <p className="mt-2 text-yellow-400 font-bold">
                  Alarm will activate in {10 - drowsySeconds}s
                </p>
              ) : (
                <p className="mt-2 text-yellow-400 font-black text-2xl animate-pulse">
                  ALARM ACTIVATED
                </p>
              )}
            </div>
          )}

          {lastUpdated && (
            <p className="mt-4 text-sm text-gray-500">
              Last updated: {lastUpdated}
            </p>
          )}

          {error && <p className="mt-5 text-red-400">{error}</p>}
        </div>
      </div>
    </section>
  );
}