import { useEffect, useState } from "react";

import {
  FaAmbulance,
  FaHospital,
  FaMapMarkedAlt,
  FaBrain,
  FaCarCrash,
  FaShieldAlt,
  FaSms,
  FaMapMarkerAlt,
  FaBolt,
  FaPhoneAlt,
  FaHeartbeat,
  FaUserMd,
  FaNotesMedical,
  FaEdit,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

const cards = [
  {
    title: "Emergency SOS",
    desc: "Trigger SOS, share live location and medical history instantly.",
    icon: <FaAmbulance />,
    tab: "SOS",
    color: "from-red-600 to-orange-500",
  },
  {
    title: "Nearby Help",
    desc: "Find hospitals, police, towing, rescue and mechanics.",
    icon: <FaHospital />,
    tab: "Nearby Help",
    color: "from-cyan-600 to-blue-500",
  },
  {
    title: "Live Map",
    desc: "Track live location and navigate to emergency help.",
    icon: <FaMapMarkedAlt />,
    tab: "Map",
    color: "from-violet-600 to-purple-500",
  },
  {
    title: "AI Risk Analysis",
    desc: "Predict accident probability before crashes happen.",
    icon: <FaShieldAlt />,
    tab: "AI Risk",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "AI Triage",
    desc: "Predict emergency severity after an accident.",
    icon: <FaBrain />,
    tab: "AI Triage",
    color: "from-green-600 to-emerald-500",
  },
  {
    title: "Driver Monitor",
    desc: "Detect drowsiness and unsafe driving conditions.",
    icon: <FaCarCrash />,
    tab: "Driver Monitor",
    color: "from-yellow-500 to-orange-500",
  },
];

export default function DashboardHome({ setActiveTab }) {
  const savedUser = JSON.parse(localStorage.getItem("roadsos_user")) || {};
  const extraContacts =
    JSON.parse(localStorage.getItem("roadsos_extra_contacts")) || [];

  const [location, setLocation] = useState(null);
  const [network, setNetwork] = useState(navigator.onLine);
  const [editingMedical, setEditingMedical] = useState(false);

  const [medicalProfile, setMedicalProfile] = useState(
    JSON.parse(localStorage.getItem("roadsos_medical_profile")) || {
      age: "",
      bloodGroup: "",
      weight: "",
      height: "",
      allergies: "",
      medication: "",
      chronicDisease: "",
      pastSurgery: "",
      emergencyNotes: "",
      organDonor: "No",
    }
  );

  const emergencyContactCount =
    extraContacts.length + (savedUser?.phone ? 1 : 0);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {},
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

    const online = () => setNetwork(true);
    const offline = () => setNetwork(false);

    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  const handleMedicalChange = (e) => {
    setMedicalProfile({
      ...medicalProfile,
      [e.target.name]: e.target.value,
    });
  };

  const saveMedicalProfile = () => {
    localStorage.setItem(
      "roadsos_medical_profile",
      JSON.stringify(medicalProfile)
    );

    setEditingMedical(false);
    alert("Medical profile saved successfully");
  };

  const sendDirectSMS = () => {
    if (!savedUser?.phone) {
      alert("No emergency number saved.");
      return;
    }

    navigator.geolocation.getCurrentPosition((location) => {
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;
      const phone = savedUser.phone.replace(/\D/g, "");

      const message =
        `RoadSoS Emergency Alert\n\n` +
        `${savedUser.name || "User"} needs immediate help.\n\n` +
        `Live Location:\n` +
        `https://maps.google.com/?q=${lat},${lng}\n\n` +
        `Please contact emergency services immediately.`;

      window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`;
    });
  };

  return (
    <section className="py-8 md:py-10">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-black via-[#111827] to-black p-8 md:p-14 shadow-2xl">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-red-600/30 blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/20 blur-[120px]" />

        <div className="relative text-center max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mb-8 font-black shadow-lg shadow-red-600/10">
            <FaShieldAlt />
            RoadSoS AI Emergency System
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Smart Emergency
            <span className="block bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              Response Dashboard
            </span>
          </h1>

          <p className="mt-6 text-gray-400 text-lg md:text-2xl max-w-4xl mx-auto">
            AI powered road safety, live GPS, crash detection, medical history
            sharing and emergency rescue assistance.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatusCard
              icon={<FaMapMarkerAlt />}
              title="GPS Status"
              value={location ? "Active" : "Fetching"}
              color="text-red-400"
            />

            <StatusCard
              icon={<FaBolt />}
              title="Network"
              value={network ? "Online" : "Offline"}
              color="text-yellow-400"
            />

            <StatusCard
              icon={<FaHeartbeat />}
              title="Emergency System"
              value="Ready"
              color="text-green-400"
            />
          </div>

          <div className="mt-12 flex flex-col md:flex-row justify-center gap-5">
            <button
              onClick={() => setActiveTab("SOS")}
              className="px-10 py-5 rounded-3xl bg-gradient-to-r from-red-600 to-orange-500 hover:scale-105 transition font-black text-xl shadow-2xl shadow-red-600/40 flex items-center justify-center gap-3"
            >
              <FaAmbulance />
              Emergency SOS
            </button>

            <button
              onClick={sendDirectSMS}
              className="px-10 py-5 rounded-3xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-105 transition font-black text-xl text-black shadow-2xl shadow-yellow-500/30 flex items-center justify-center gap-3"
            >
              <FaSms />
              Direct SMS SOS
            </button>

            <a href="tel:112">
              <button className="w-full px-10 py-5 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition font-black text-xl shadow-2xl shadow-cyan-600/30 flex items-center justify-center gap-3">
                <FaPhoneAlt />
                Call 112
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* USER OVERVIEW */}
      <div className="mt-10 grid xl:grid-cols-3 gap-7">
        <div className="xl:col-span-2 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-cyan-400 font-black">Welcome back</p>

              <h2 className="mt-2 text-4xl md:text-5xl font-black">
                {savedUser?.name || "User"}
              </h2>

              <p className="mt-4 text-gray-400 text-lg">
                Your safety dashboard is active. Keep your medical profile and
                emergency contacts updated.
              </p>
            </div>

            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-5xl shadow-2xl shadow-red-600/30">
              <FaShieldAlt />
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-5">
        

            <MiniInfo
              title="Location"
              value={location ? "GPS Active" : "Waiting"}
              icon={<FaMapMarkerAlt />}
              color="text-red-400"
            />

            <MiniInfo
              title="Medical Sharing"
              value="Enabled"
              icon={<FaNotesMedical />}
              color="text-green-400"
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-yellow-500/30 bg-gradient-to-br from-yellow-500/15 to-orange-500/10 p-8 shadow-2xl shadow-yellow-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 font-black">Emergency Contacts</p>

              <h3 className="mt-3 text-7xl font-black">
                {emergencyContactCount}
              </h3>
            </div>

            <div className="w-20 h-20 rounded-3xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-4xl">
              <FaUsers />
            </div>
          </div>

          <p className="mt-5 text-gray-400">
            Contacts ready to receive SOS alerts with live location and medical
            history.
          </p>

          <button
            onClick={() => setActiveTab("SOS")}
            className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black hover:scale-[1.02] transition"
          >
            Manage Contacts
          </button>
        </div>
      </div>

      {/* MEDICAL PROFILE */}
      <div className="mt-10 rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
        <div className="bg-gradient-to-r from-cyan-600/80 to-violet-600/80 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <FaUserMd className="text-3xl" />
              <h2 className="text-3xl font-black">Medical Profile</h2>
            </div>

            <p className="text-white/75 mt-2">
              Shared automatically during SOS to help rescuers respond faster.
            </p>
          </div>

          <button
            onClick={() =>
              editingMedical ? saveMedicalProfile() : setEditingMedical(true)
            }
            className="px-6 py-3 rounded-2xl bg-white text-black hover:bg-gray-200 font-black flex items-center gap-2"
          >
            <FaEdit />
            {editingMedical ? "Save Profile" : "Edit Medical Info"}
          </button>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 p-6">
          <MedicalField
            label="Age"
            name="age"
            value={medicalProfile.age}
            editing={editingMedical}
            onChange={handleMedicalChange}
          />

          <MedicalField
            label="Blood Group"
            name="bloodGroup"
            value={medicalProfile.bloodGroup}
            editing={editingMedical}
            onChange={handleMedicalChange}
          />

          <MedicalField
            label="Weight"
            name="weight"
            value={medicalProfile.weight}
            editing={editingMedical}
            onChange={handleMedicalChange}
          />

          <MedicalField
            label="Height"
            name="height"
            value={medicalProfile.height}
            editing={editingMedical}
            onChange={handleMedicalChange}
          />

          <MedicalField
            label="Allergies"
            name="allergies"
            value={medicalProfile.allergies}
            editing={editingMedical}
            onChange={handleMedicalChange}
          />

          <MedicalField
            label="Current Medication"
            name="medication"
            value={medicalProfile.medication}
            editing={editingMedical}
            onChange={handleMedicalChange}
          />

          <MedicalField
            label="Chronic Disease"
            name="chronicDisease"
            value={medicalProfile.chronicDisease}
            editing={editingMedical}
            onChange={handleMedicalChange}
          />

          <MedicalField
            label="Past Surgery"
            name="pastSurgery"
            value={medicalProfile.pastSurgery}
            editing={editingMedical}
            onChange={handleMedicalChange}
          />

          <MedicalField
            label="Organ Donor"
            name="organDonor"
            value={medicalProfile.organDonor}
            editing={editingMedical}
            onChange={handleMedicalChange}
          />

          <MedicalField
            label="Emergency Notes"
            name="emergencyNotes"
            value={medicalProfile.emergencyNotes}
            editing={editingMedical}
            onChange={handleMedicalChange}
          />
        </div>
      </div>

      {/* MEDICAL HISTORY */}
      <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-2xl">
        <div className="flex items-center gap-3">
          <FaNotesMedical className="text-cyan-400 text-3xl" />
          <h2 className="text-3xl font-black text-cyan-400">
            Medical History Summary
          </h2>
        </div>

        <div className="mt-7 grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          <HistoryCard
            title="Past Surgery"
            value={medicalProfile.pastSurgery || "Not Set"}
          />

          <HistoryCard
            title="Chronic Disease"
            value={medicalProfile.chronicDisease || "Not Set"}
          />

          <HistoryCard
            title="Current Medication"
            value={medicalProfile.medication || "Not Set"}
          />

          <HistoryCard
            title="Emergency Notes"
            value={medicalProfile.emergencyNotes || "Not Set"}
          />
        </div>
      </div>

      {/* FEATURE CARDS */}
      <div className="mt-12">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-7">
          <div>
            <h2 className="text-4xl font-black">Quick Access</h2>
            <p className="text-gray-400 mt-2">
              Open any RoadSoS AI safety module.
            </p>
          </div>

          <div className="px-5 py-3 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-black flex items-center gap-2">
            <FaCheckCircle />
            All Systems Ready
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
          {cards.map((card) => (
            <button
              key={card.title}
              onClick={() => setActiveTab(card.tab)}
              className="group relative overflow-hidden text-left bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl hover:scale-[1.03] hover:border-red-500/40 transition-all duration-300 shadow-xl"
            >
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition" />

              <div
                className={`relative text-5xl w-24 h-24 rounded-3xl bg-gradient-to-r ${card.color} flex items-center justify-center shadow-2xl`}
              >
                {card.icon}
              </div>

              <h2 className="relative text-3xl font-black mt-8 group-hover:text-red-400 transition">
                {card.title}
              </h2>

              <p className="relative mt-4 text-gray-400 leading-relaxed text-lg">
                {card.desc}
              </p>

              <div className="relative mt-8 flex items-center gap-2 text-red-400 font-black text-lg">
                Open Dashboard →
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatusCard({ icon, title, value, color }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:scale-105 transition shadow-xl">
      <div className="flex items-center gap-4 justify-center">
        <div className={`text-3xl ${color}`}>{icon}</div>

        <div className="text-left">
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="font-black text-xl">{value}</h3>
        </div>
      </div>
    </div>
  );
}

function MiniInfo({ title, value, icon, color }) {
  return (
    <div className="bg-black/30 border border-white/10 rounded-2xl p-5">
      <div className={`text-2xl ${color}`}>{icon}</div>

      <p className="text-gray-400 text-sm mt-3">{title}</p>

      <h3 className="font-black mt-1">{value}</h3>
    </div>
  );
}

function MedicalField({ label, name, value, editing, onChange }) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl p-5 hover:border-cyan-400/40 transition">
      <p className="text-gray-400 text-sm font-bold">{label}</p>

      {editing ? (
        <input
          name={name}
          value={value}
          onChange={onChange}
          placeholder={`Enter ${label}`}
          className="mt-3 w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none text-white focus:border-cyan-400"
        />
      ) : (
        <h3 className="font-black text-lg mt-3">{value || "Not Set"}</h3>
      )}
    </div>
  );
}

function HistoryCard({ title, value }) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl p-5 hover:border-cyan-400/40 transition">
      <p className="text-gray-400 text-sm font-bold">{title}</p>
      <h3 className="font-black text-lg mt-3">{value}</h3>
    </div>
  );
}