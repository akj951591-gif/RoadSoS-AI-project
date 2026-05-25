import { useEffect, useState } from "react";

export default function DriverMonitor() {
  const [status, setStatus] = useState("LOADING");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("http://127.0.0.1:9000/driver-status");
        const data = await response.json();

        setStatus(data.status);
        setError("");
      } catch {
        setStatus("OFFLINE");
        setError("Driver API not running on port 9000.");
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-[75vh] flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl backdrop-blur-2xl text-center">
        <h1 className="text-5xl font-black text-red-500">
          Driver Monitor AI
        </h1>

        <p className="mt-4 text-gray-400">
          OpenCV-based webcam monitoring connected to frontend.
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

        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => fetch("http://127.0.0.1:9000/set-safe")}
            className="px-6 py-3 bg-green-600 rounded-xl font-bold"
          >
            Test SAFE
          </button>

          <button
            onClick={() => fetch("http://127.0.0.1:9000/set-drowsy")}
            className="px-6 py-3 bg-red-600 rounded-xl font-bold"
          >
            Test DROWSY
          </button>
        </div>
      </div>
    </section>
  );
}