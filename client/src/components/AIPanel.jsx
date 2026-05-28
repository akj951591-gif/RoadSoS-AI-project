import { useState } from "react";
import {
  FaShieldAlt,
  FaRoad,
  FaCloudSun,
  FaCarCrash,
} from "react-icons/fa";

export default function AIPanel() {

  const [speed, setSpeed] = useState(80);
  const [vibration, setVibration] = useState(60);
  const [weather, setWeather] = useState(40);
  const [driver, setDriver] = useState(50);

  const [risk, setRisk] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // SAME URL AS AITriage.jsx

  const API_URL =
    "https://roadsos-ai-project.onrender.com";

  const checkRisk = async () => {

    setError("");
    setRisk(null);
    setLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/predict`,
        {
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
        }
      );

      const data = await response.json();

      setRisk(data);

    } catch {

      setError(
        "AI backend not responding."
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <section className="min-h-[75vh] flex items-center justify-center py-12">

      <div
        className="
        w-full
        max-w-4xl
        bg-[#111827]/80
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
            mx-auto
            w-20
            h-20
            rounded-3xl
            bg-gradient-to-br
            from-red-600
            to-orange-500
            flex
            items-center
            justify-center
            shadow-lg
            shadow-red-600/40
            "
          >

            <FaShieldAlt className="text-4xl text-white" />

          </div>

          <h1
            className="
            mt-6
            text-5xl
            font-black
            bg-gradient-to-r
            from-red-500
            to-orange-400
            bg-clip-text
            text-transparent
            "
          >

            AI Risk Analysis

          </h1>

          <p className="mt-3 text-gray-400 text-lg">

            Predict accident risk using
            speed, weather, vibration and
            driver condition.

          </p>

        </div>

        {/* SLIDERS */}

        <div className="mt-10 grid md:grid-cols-2 gap-6">

          <Slider
            icon={<FaCarCrash />}
            label="Vehicle Speed"
            value={speed}
            max="150"
            setValue={setSpeed}
            unit=" km/h"
          />

          <Slider
            icon={<FaRoad />}
            label="Road Vibration"
            value={vibration}
            max="100"
            setValue={setVibration}
            unit="%"
          />

          <Slider
            icon={<FaCloudSun />}
            label="Weather Risk"
            value={weather}
            max="100"
            setValue={setWeather}
            unit="%"
          />

          <Slider
            icon={<FaShieldAlt />}
            label="Driver Condition"
            value={driver}
            max="100"
            setValue={setDriver}
            unit="%"
          />

        </div>

        {/* BUTTON */}

        <button

          onClick={checkRisk}

          disabled={loading}

          className="
          mt-10
          w-full
          py-4
          rounded-2xl
          bg-gradient-to-r
          from-red-600
          to-orange-500
          hover:from-red-700
          hover:to-orange-600
          text-xl
          font-black
          shadow-lg
          shadow-red-600/40
          disabled:opacity-60
          "
        >

          {
            loading
              ? "Analyzing..."
              : "Analyze Accident Risk"
          }

        </button>

        {/* ERROR */}

        {
          error && (

            <p
              className="
              mt-6
              text-red-400
              text-center
              font-bold
              "
            >

              {error}

            </p>
          )
        }

        {/* RESULT */}

        {
          risk && (

            <div className="mt-8 grid md:grid-cols-3 gap-5">

              <Result
                title="Accident Risk"
                value={risk.accident_risk}
                color="text-red-400"
              />

              <Result
                title="Severity"
                value={risk.severity}
                color="text-yellow-400"
              />

              <Result
                title="Emergency"
                value={
                  risk.emergency
                    ? "YES"
                    : "NO"
                }
                color="text-green-400"
              />

            </div>
          )
        }

      </div>

    </section>
  );
}

function Slider({
  icon,
  label,
  value,
  setValue,
  max,
  unit,
}) {

  return (

    <div
      className="
      bg-black/30
      border
      border-white/10
      rounded-3xl
      p-6
      "
    >

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3 text-xl font-bold">

          <span className="text-red-400">
            {icon}
          </span>

          {label}

        </div>

        <span className="text-cyan-400 font-black">

          {value}
          {unit}

        </span>

      </div>

      <input
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
        className="mt-6 w-full accent-red-500"
      />

    </div>
  );
}

function Result({
  title,
  value,
  color,
}) {

  return (

    <div
      className="
      bg-black/40
      border
      border-white/10
      rounded-3xl
      p-6
      text-center
      "
    >

      <p className="text-gray-400">
        {title}
      </p>

      <h2
        className={`
        mt-2
        text-3xl
        font-black
        ${color}
        `}
      >

        {value}

      </h2>

    </div>
  );
}