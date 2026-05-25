import { useState } from "react";

export default function AITriage() {
  const [form, setForm] = useState({
    injury: "",
    bleeding: "",
    consciousness: "",
    breathing: "",
    distance: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const API_URL = "https://roadsos-ai-project.onrender.com";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: Number(e.target.value),
    });
  };

  const analyze = async () => {
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/triage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      setResult(data);
    } catch {
      setError("AI backend not responding.");
    }
  };

  return (
    <section className="min-h-[75vh] flex items-center justify-center">
      <div className="w-full max-w-3xl bg-[#111827]/70 border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl backdrop-blur-2xl">
        <h1 className="text-5xl font-black text-center bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          AI Emergency Triage
        </h1>

        <p className="text-gray-400 text-center mt-4">
          Fill accident details and AI will predict emergency priority.
        </p>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <SelectBox
            label="Injury Severity"
            name="injury"
            value={form.injury}
            onChange={handleChange}
            options={[
              ["", "Select injury level"],
              [20, "Minor injury"],
              [50, "Moderate injury"],
              [80, "Severe injury"],
              [100, "Critical injury"],
            ]}
          />

          <SelectBox
            label="Bleeding Level"
            name="bleeding"
            value={form.bleeding}
            onChange={handleChange}
            options={[
              ["", "Select bleeding level"],
              [10, "No bleeding"],
              [40, "Mild bleeding"],
              [75, "Heavy bleeding"],
              [100, "Uncontrolled bleeding"],
            ]}
          />

          <SelectBox
            label="Consciousness"
            name="consciousness"
            value={form.consciousness}
            onChange={handleChange}
            options={[
              ["", "Select consciousness"],
              [10, "Fully conscious"],
              [50, "Confused / semi-conscious"],
              [85, "Unconscious"],
              [100, "Not responding"],
            ]}
          />

          <SelectBox
            label="Breathing Condition"
            name="breathing"
            value={form.breathing}
            onChange={handleChange}
            options={[
              ["", "Select breathing"],
              [10, "Normal breathing"],
              [50, "Difficulty breathing"],
              [80, "Very weak breathing"],
              [100, "Not breathing"],
            ]}
          />

          <SelectBox
            label="Hospital Distance"
            name="distance"
            value={form.distance}
            onChange={handleChange}
            options={[
              ["", "Select distance"],
              [10, "Less than 2 km"],
              [35, "2 - 5 km"],
              [65, "5 - 10 km"],
              [90, "More than 10 km"],
            ]}
          />
        </div>

        <button
          onClick={analyze}
          className="mt-10 w-full py-4 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 rounded-2xl text-xl font-bold shadow-lg shadow-violet-500/40"
        >
          Predict Emergency Priority
        </button>

        {error && <p className="mt-5 text-red-400 text-center">{error}</p>}

        {result && (
          <div className="mt-8 bg-black/40 border border-white/10 rounded-3xl p-6 text-center">
            <h2 className="text-4xl font-black text-cyan-400">
              {result.priority} PRIORITY
            </h2>

            <p className="mt-4 text-2xl">
              Triage Score:{" "}
              <span className="text-yellow-400 font-bold">
                {result.triage_score}
              </span>
            </p>

            <p className="mt-4 text-green-400 text-xl font-bold">
              {result.action}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function SelectBox({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block mb-2 text-lg font-bold">{label}</label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white outline-none"
      >
        {options.map(([value, text]) => (
          <option key={text} value={value}>
            {text}
          </option>
        ))}
      </select>
    </div>
  );
}