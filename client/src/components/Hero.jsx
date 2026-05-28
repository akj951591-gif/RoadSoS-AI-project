import { motion } from "framer-motion";
import { FaAmbulance, FaMapMarkerAlt, FaBrain } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-5xl"
      >
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mb-8">
          Emergency Care • AI • Live Location
        </div>

        <h1 className="text-5xl md:text-8xl font-black leading-tight">
          RoadSoS AI
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
            Rescue Assistant
          </span>
        </h1>

        <p className="mt-6 text-gray-400 text-lg md:text-2xl">
          Location-based SOS, trauma center discovery, ambulance help, police access,
          vehicle rescue, and AI emergency triage.
        </p>

        <div className="grid md:grid-cols-3 gap-5 mt-16">
          {[
            ["Live SOS Location", <FaMapMarkerAlt />],
            ["Nearby Emergency Help", <FaAmbulance />],
            ["AI Triage Engine", <FaBrain />],
          ].map(([title, icon]) => (
            <div
              key={title}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
            >
              <div className="text-red-500 text-3xl mb-3">{icon}</div>
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}