import { FaHospital, FaShieldAlt, FaAmbulance, FaTools } from "react-icons/fa";

export default function NearbyHelp() {
  const services = [
    {
      name: "Trauma Center",
      number: "108",
      icon: <FaHospital />,
      color: "bg-red-600",
      text: "Find nearest emergency trauma care.",
    },
    {
      name: "Ambulance",
      number: "108",
      icon: <FaAmbulance />,
      color: "bg-green-600",
      text: "Call ambulance support instantly.",
    },
    {
      name: "Police Station",
      number: "100",
      icon: <FaShieldAlt />,
      color: "bg-blue-600",
      text: "Contact nearby police assistance.",
    },
    {
      name: "Vehicle Rescue",
      number: "112",
      icon: <FaTools />,
      color: "bg-orange-600",
      text: "Roadside rescue and vehicle support.",
    },
  ];

  return (
    <section className="py-10">
      <h1 className="text-5xl font-black text-center mb-12">
        Nearby Emergency Help
      </h1>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {services.map((service) => (
          <div
            key={service.name}
            className="bg-white/5 border border-white/10 rounded-3xl p-7 backdrop-blur-xl hover:scale-105 transition"
          >
            <div
              className={`text-4xl w-20 h-20 rounded-2xl ${service.color} flex items-center justify-center`}
            >
              {service.icon}
            </div>

            <h2 className="text-2xl font-black mt-6">{service.name}</h2>
            <p className="text-gray-400 mt-3">{service.text}</p>

            <a href={`tel:${service.number}`}>
              <button className="mt-6 w-full py-3 bg-white text-black rounded-xl font-bold">
                Call {service.number}
              </button>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}