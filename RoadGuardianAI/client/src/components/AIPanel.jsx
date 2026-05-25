import { useState } from "react";

export default function AIPanel() {
  const [speed, setSpeed] = useState(80);
  const [vibration, setVibration] = useState(60);
  const [weather, setWeather] = useState(40);
  const [driver, setDriver] = useState(50);
  const [risk, setRisk] = useState(null);
  const [error, setError] = useState("");

  const checkRisk = async () => {
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          speed: Number(speed),
          vibration: Number(vibration),
          weather: Number(weather),
          driver_condition: Number(driver),
        }),
      });

      const data = await response.json();
      setRisk(data);
    } catch (err) {
      setError("AI backend not running on port 8000");
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl backdrop-blur-2xl">
      <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-3xl w-[600px]">
        <h1 className="text-5xl text-center font-bold text-red-500">
          AI Risk Analysis
        </h1>

        <div className="mt-10 space-y-6">
          <label className="block text-xl">Speed: {speed}</label>
          <input className="w-full" type="range" min="0" max="150" value={speed} onChange={(e) => setSpeed(e.target.value)} />

          <label className="block text-xl">Vibration: {vibration}</label>
          <input className="w-full" type="range" min="0" max="100" value={vibration} onChange={(e) => setVibration(e.target.value)} />

          <label className="block text-xl">Weather Risk: {weather}</label>
          <input className="w-full" type="range" min="0" max="100" value={weather} onChange={(e) => setWeather(e.target.value)} />

          <label className="block text-xl">Driver Condition: {driver}</label>
          <input className="w-full" type="range" min="0" max="100" value={driver} onChange={(e) => setDriver(e.target.value)} />
        </div>

        <button onClick={checkRisk} className="mt-10 w-full py-4 bg-red-600 hover:bg-red-700 rounded-xl text-xl">
          Analyze Risk
        </button>

        {error && <p className="mt-6 text-red-400 text-center">{error}</p>}

        {risk && (
          <div className="mt-8 space-y-4 text-xl">
            <div className="bg-zinc-800 p-4 rounded-xl">Risk: <b className="text-red-500">{risk.accident_risk}</b></div>
            <div className="bg-zinc-800 p-4 rounded-xl">Severity: <b className="text-yellow-400">{risk.severity}</b></div>
            <div className="bg-zinc-800 p-4 rounded-xl">Emergency: <b className="text-green-400">{risk.emergency ? "YES" : "NO"}</b></div>
          </div>
        )}
      </div>
    </div>
  );
}