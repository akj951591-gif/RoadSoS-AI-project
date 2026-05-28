import {
    FaHospital,
    FaShieldAlt,
    FaAmbulance
  } from "react-icons/fa";
  
  export default function EmergencyServices() {
  
    const services = [
  
      {
        name: "Nearest Hospital",
        icon: <FaHospital />,
        number: "102",
        color: "bg-red-600",
      },
  
      {
        name: "Police Station",
        icon: <FaShieldAlt />,
        number: "100",
        color: "bg-blue-600",
      },
  
      {
        name: "Ambulance",
        icon: <FaAmbulance />,
        number: "108",
        color: "bg-green-600",
      },
    ];
  
    return (
  
      <div className="bg-zinc-950 p-10">
  
        <h1 className="text-5xl font-bold text-center text-white mb-10">
          Emergency Services
        </h1>
  
        <div className="grid md:grid-cols-3 gap-8">
  
          {
            services.map((service, index) => (
  
              <div
                key={index}
                className="
                bg-zinc-900
                p-8
                rounded-3xl
                shadow-xl
                border
                border-zinc-800
                hover:scale-105
                transition
                "
              >
  
                <div
                  className={`
                  text-5xl
                  w-20
                  h-20
                  flex
                  items-center
                  justify-center
                  rounded-full
                  text-white
                  ${service.color}
                  `}
                >
                  {service.icon}
                </div>
  
                <h2 className="text-3xl mt-6 font-bold text-white">
                  {service.name}
                </h2>
  
                <p className="text-gray-400 mt-4">
                  Emergency Contact Number
                </p>
  
                <button
                  className="
                  mt-6
                  px-6
                  py-3
                  bg-white
                  text-black
                  rounded-xl
                  font-bold
                  hover:bg-gray-200
                  transition
                  "
                >
                  Call {service.number}
                </button>
  
              </div>
            ))
          }
  
        </div>
  
      </div>
    );
  }