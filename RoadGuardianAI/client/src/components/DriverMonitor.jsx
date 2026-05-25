import { useEffect, useState } from "react";

export default function DriverMonitor() {
  const [status, setStatus] = useState("LOADING");
  const [error, setError] = useState("");

  const DRIVER_API = "https://roadsos-driver-api.onrender.com";

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${DRIVER_API}/driver-status`);
        const data = await response.json();

        setStatus(data.status);
        setError("");
      } catch {
        setStatus("OFFLINE");
        setError("Driver API not responding.");
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-[75vh] flex items-center justify-center">
      <div className="w-full max-w-2xl bg-[#111827]/70 border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl backdrop-blur-2xl text-center">
        <h1 className="text-5xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          Driver Monitor AI
        </h1>

        <p className="mt-4 text-gray-400">
          OpenCV drowsiness detection connected with live frontend.
        </p>

        <div
          className={`mt-10 text-5xl font-black p-8 rounded-3xl ${
            status === "SAFE"
              ? "bg-green-500/20 text-green-400"
              : status === "DROWSY"
              ? "bg-red-500/20 text-red-400 animate-pulse"
              : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {status}
        </div>

        {error && <p className="mt-5 text-red-400">{error}</p>}

        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => fetch(`${DRIVER_API}/set-safe`)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold"
          >
            Test SAFE
          </button>

          <button
            onClick={() => fetch(`${DRIVER_API}/set-drowsy`)}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold"
          >
            Test DROWSY
          </button>
        </div>
      </div>
    </section>
  );
}