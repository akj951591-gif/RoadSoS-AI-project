import {
    FaAmbulance,
    FaHospital,
    FaMapMarkedAlt,
    FaBrain,
    FaCarCrash,
    FaShieldAlt,
  } from "react-icons/fa";
  
  const cards = [
    {
      title: "Emergency SOS",
      desc: "Trigger SOS and share live location instantly.",
      icon: <FaAmbulance />,
      tab: "SOS",
    },
    {
      title: "Nearby Help",
      desc: "Find trauma centers, ambulance, police and rescue.",
      icon: <FaHospital />,
      tab: "Nearby Help",
    },
    {
      title: "Live Map",
      desc: "Show user location, nearest hospital and route.",
      icon: <FaMapMarkedAlt />,
      tab: "Map",
    },
    {
      title: "AI Triage",
      desc: "Fill accident details and predict emergency priority.",
      icon: <FaBrain />,
      tab: "AI Triage",
    },
    {
      title: "Driver Monitor",
      desc: "OpenCV drowsiness status connected to frontend.",
      icon: <FaCarCrash />,
      tab: "Driver Monitor",
    },
  ];
  
  export default function DashboardHome({ setActiveTab }) {
    return (
      <section className="py-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mb-8">
            <FaShieldAlt />
            RoadSoS AI Dashboard
          </div>
  
          <h1 className="text-5xl md:text-7xl font-black">
            Emergency Response
            <span className="block text-red-500">Control Center</span>
          </h1>
  
          <p className="mt-5 text-gray-400 text-xl">
            Access SOS, nearby hospitals, live map, AI triage and driver monitoring from one place.
          </p>
        </div>
  
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-14">
          {cards.map((card) => (
            <button
              key={card.title}
              onClick={() => setActiveTab(card.tab)}
              className="text-left bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl hover:scale-105 hover:border-red-500/50 transition"
            >
              <div className="text-5xl text-red-500 mb-6">
                {card.icon}
              </div>
  
              <h2 className="text-3xl font-black">{card.title}</h2>
  
              <p className="mt-3 text-gray-400">{card.desc}</p>
  
              <div className="mt-6 text-red-400 font-bold">
                Open →
              </div>
            </button>
          ))}
        </div>
      </section>
    );
  }