import { useState, useEffect } from "react";
import {
  FaHome,
  FaSos,
  FaMapMarkedAlt,
  FaBrain,
  FaAmbulance,
  FaUserMd,
  FaHeartbeat,
  FaUserCircle,
  FaSignOutAlt,
  FaCalendarAlt,
  FaTint,
  FaNotesMedical,
  FaPhone,
  FaEnvelope,
  FaShieldAlt,
  FaExclamationTriangle,
  FaHospital,
  FaCar,
  FaCloudSun,
} from "react-icons/fa";

export default function Home({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("home");
  const [isEditing, setIsEditing] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  
  // User profile state
  const [profile, setProfile] = useState({
    age: "",
    bloodGroup: "",
    diseases: "",
    allergies: "",
    medications: "",
    emergencyContact: "",
    emergencyContactName: "",
    address: "",
    medicalHistory: "",
    organDonor: false,
  });

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem(`profile_${user?.email}`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, [user]);

  // Save profile to localStorage
  const saveProfile = () => {
    localStorage.setItem(`profile_${user?.email}`, JSON.stringify(profile));
    setIsEditing(false);
    alert("✅ Profile saved successfully! This information will be used during emergencies.");
  };

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({
      ...profile,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  // SOS Emergency Function
  const triggerSOS = () => {
    setSosActive(true);
    const emergencyMessage = `
🚨 EMERGENCY SOS ALERT! 🚨

User: ${user?.name}
Contact: ${user?.email}

MEDICAL INFO:
- Age: ${profile.age || "Not provided"}
- Blood Group: ${profile.bloodGroup || "Not provided"}
- Diseases: ${profile.diseases || "None"}
- Allergies: ${profile.allergies || "None"}
- Medications: ${profile.medications || "None"}

Emergency Contact: ${profile.emergencyContactName} (${profile.emergencyContact || "Not provided"})
Address: ${profile.address || "Not provided"}

⚠️ IMMEDIATE ASSISTANCE REQUIRED! ⚠️
    `;
    
    alert("🆘 SOS ACTIVATED! Emergency services and your contacts will be notified.\n\n" + emergencyMessage);
    
    // In real implementation, this would:
    // 1. Send SMS to emergency contacts
    // 2. Call emergency services
    // 3. Share live location
    // 4. Send medical info to hospital
    
    setTimeout(() => setSosActive(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#7C3AED55,transparent_35%),radial-gradient(circle_at_bottom_right,#06B6D455,transparent_35%)]" />

      <div className="flex h-screen">
        {/* ========== SIDEBAR NAVIGATION ========== */}
        <div className="w-72 bg-[#111827]/80 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
            <FaShieldAlt className="text-cyan-400 text-3xl" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              RoadSoS AI
            </h1>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-2">
            {[
              { id: "home", name: "Home", icon: FaHome, color: "from-blue-500 to-cyan-500" },
              { id: "sos", name: "SOS Emergency", icon: FaSos, color: "from-red-500 to-orange-500" },
              { id: "nearby", name: "Nearby Help", icon: FaAmbulance, color: "from-green-500 to-emerald-500" },
              { id: "map", name: "Live Map", icon: FaMapMarkedAlt, color: "from-purple-500 to-pink-500" },
              { id: "risk", name: "AI Risk", icon: FaBrain, color: "from-yellow-500 to-orange-500" },
              { id: "triage", name: "AI Triage", icon: FaUserMd, color: "from-indigo-500 to-purple-500" },
              { id: "monitor", name: "Driver Monitor", icon: FaHeartbeat, color: "from-red-500 to-pink-500" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? `bg-gradient-to-r ${item.color} shadow-lg`
                    : "hover:bg-white/10"
                }`}
              >
                <item.icon className="text-lg" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="pt-6 mt-6 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white/5">
              <FaUserCircle className="text-4xl text-cyan-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Logged in as</p>
                <p className="font-bold text-sm">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all duration-200"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* ========== MAIN CONTENT ========== */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* HOME TAB */}
          {activeTab === "home" && (
            <div className="space-y-6">
              {/* Welcome Header */}
              <div className="bg-gradient-to-r from-violet-600/30 to-cyan-500/30 rounded-2xl p-8 border border-white/20 backdrop-blur-sm">
                <h2 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.name?.split(" ")[0]}! 👋
                </h2>
                <p className="text-gray-200">
                  Your safety is our priority. Complete your profile for faster emergency response.
                </p>
              </div>

              {/* USER COMPLETE DETAILS SECTION */}
              <div className="bg-[#111827]/70 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <FaUserCircle className="text-cyan-400" />
                    Complete User Details
                  </h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-semibold transition shadow-lg"
                    >
                      ✏️ Edit Profile
                    </button>
                  ) : (
                    <div className="space-x-3">
                      <button
                        onClick={saveProfile}
                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl font-semibold transition"
                      >
                        💾 Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 rounded-xl font-semibold transition"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Age */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <FaCalendarAlt className="text-cyan-400" />
                      Age
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="age"
                        value={profile.age}
                        onChange={handleProfileChange}
                        className="w-full p-3 rounded-xl bg-black/50 border border-white/10 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        placeholder="Enter your age"
                      />
                    ) : (
                      <p className="p-3 rounded-xl bg-black/30 border border-white/10">
                        {profile.age ? `${profile.age} years` : "❌ Not set"}
                      </p>
                    )}
                  </div>

                  {/* Blood Group */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <FaTint className="text-red-400" />
                      Blood Group
                    </label>
                    {isEditing ? (
                      <select
                        name="bloodGroup"
                        value={profile.bloodGroup}
                        onChange={handleProfileChange}
                        className="w-full p-3 rounded-xl bg-black/50 border border-white/10 outline-none focus:border-cyan-400"
                      >
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="p-3 rounded-xl bg-black/30 border border-white/10">
                        {profile.bloodGroup || "❌ Not set"}
                      </p>
                    )}
                  </div>

                  {/* Diseases / Medical Conditions */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <FaNotesMedical className="text-yellow-400" />
                      Diseases / Medical Conditions
                    </label>
                    {isEditing ? (
                      <textarea
                        name="diseases"
                        value={profile.diseases}
                        onChange={handleProfileChange}
                        rows="3"
                        className="w-full p-3 rounded-xl bg-black/50 border border-white/10 outline-none focus:border-cyan-400"
                        placeholder="e.g., Diabetes, Hypertension, Asthma, Heart Disease"
                      />
                    ) : (
                      <p className="p-3 rounded-xl bg-black/30 border border-white/10 min-h-[80px]">
                        {profile.diseases || "✅ No diseases reported"}
                      </p>
                    )}
                  </div>

                  {/* Allergies */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <FaExclamationTriangle className="text-orange-400" />
                      Allergies
                    </label>
                    {isEditing ? (
                      <textarea
                        name="allergies"
                        value={profile.allergies}
                        onChange={handleProfileChange}
                        rows="3"
                        className="w-full p-3 rounded-xl bg-black/50 border border-white/10 outline-none focus:border-cyan-400"
                        placeholder="e.g., Penicillin, Nuts, Pollen, Latex"
                      />
                    ) : (
                      <p className="p-3 rounded-xl bg-black/30 border border-white/10 min-h-[80px]">
                        {profile.allergies || "✅ No allergies reported"}
                      </p>
                    )}
                  </div>

                  {/* Current Medications */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <FaNotesMedical className="text-green-400" />
                      Current Medications
                    </label>
                    {isEditing ? (
                      <textarea
                        name="medications"
                        value={profile.medications}
                        onChange={handleProfileChange}
                        rows="3"
                        className="w-full p-3 rounded-xl bg-black/50 border border-white/10 outline-none focus:border-cyan-400"
                        placeholder="e.g., Insulin 10mg, Lisinopril 5mg"
                      />
                    ) : (
                      <p className="p-3 rounded-xl bg-black/30 border border-white/10 min-h-[80px]">
                        {profile.medications || "✅ No medications listed"}
                      </p>
                    )}
                  </div>

                  {/* Medical History */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <FaNotesMedical className="text-purple-400" />
                      Medical History
                    </label>
                    {isEditing ? (
                      <textarea
                        name="medicalHistory"
                        value={profile.medicalHistory}
                        onChange={handleProfileChange}
                        rows="3"
                        className="w-full p-3 rounded-xl bg-black/50 border border-white/10 outline-none focus:border-cyan-400"
                        placeholder="Previous surgeries, hospitalizations, etc."
                      />
                    ) : (
                      <p className="p-3 rounded-xl bg-black/30 border border-white/10 min-h-[80px]">
                        {profile.medicalHistory || "✅ No significant medical history"}
                      </p>
                    )}
                  </div>

                  {/* Emergency Contact Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <FaPhone className="text-red-400" />
                      Emergency Contact Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="emergencyContactName"
                        value={profile.emergencyContactName}
                        onChange={handleProfileChange}
                        className="w-full p-3 rounded-xl bg-black/50 border border-white/10 outline-none focus:border-cyan-400"
                        placeholder="e.g., Rajesh Kumar"
                      />
                    ) : (
                      <p className="p-3 rounded-xl bg-black/30 border border-white/10">
                        {profile.emergencyContactName || "❌ Not set"}
                      </p>
                    )}
                  </div>

                  {/* Emergency Contact Number */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <FaPhone className="text-red-400" />
                      Emergency Contact Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="emergencyContact"
                        value={profile.emergencyContact}
                        onChange={handleProfileChange}
                        className="w-full p-3 rounded-xl bg-black/50 border border-white/10 outline-none focus:border-cyan-400"
                        placeholder="+91 98765 43210"
                      />
                    ) : (
                      <p className="p-3 rounded-xl bg-black/30 border border-white/10">
                        {profile.emergencyContact || "❌ Not set"}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <FaEnvelope className="text-cyan-400" />
                      Home Address
                    </label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={profile.address}
                        onChange={handleProfileChange}
                        rows="2"
                        className="w-full p-3 rounded-xl bg-black/50 border border-white/10 outline-none focus:border-cyan-400"
                        placeholder="Enter your full address for emergency services"
                      />
                    ) : (
                      <p className="p-3 rounded-xl bg-black/30 border border-white/10">
                        {profile.address || "❌ Not set"}
                      </p>
                    )}
                  </div>

                  {/* Organ Donor */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <FaHeartbeat className="text-red-400" />
                      Organ Donor
                    </label>
                    {isEditing ? (
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-black/50 border border-white/10 cursor-pointer">
                        <input
                          type="checkbox"
                          name="organDonor"
                          checked={profile.organDonor}
                          onChange={handleProfileChange}
                          className="w-5 h-5"
                        />
                        <span>I am an organ donor</span>
                      </label>
                    ) : (
                      <p className="p-3 rounded-xl bg-black/30 border border-white/10">
                        {profile.organDonor ? "✅ Yes, I am an organ donor" : "❌ Not an organ donor"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Emergency Info Warning */}
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl">
                  <p className="text-yellow-400 text-sm flex items-center gap-2">
                    <FaShieldAlt />
                    ⚠️ MEDICAL ALERT: This information will be automatically shared with emergency services during an SOS alert for faster and better medical response.
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 rounded-2xl p-4 border border-blue-500/30">
                  <FaShieldAlt className="text-2xl text-blue-400 mb-2" />
                  <p className="text-xs text-gray-400">Safety Score</p>
                  <p className="text-2xl font-bold text-blue-400">98%</p>
                </div>
                <div className="bg-gradient-to-br from-green-600/20 to-green-900/20 rounded-2xl p-4 border border-green-500/30">
                  <FaHeartbeat className="text-2xl text-green-400 mb-2" />
                  <p className="text-xs text-gray-400">Health Profile</p>
                  <p className="text-2xl font-bold text-green-400">
                    {profile.bloodGroup ? "Complete" : "Pending"}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 rounded-2xl p-4 border border-purple-500/30">
                  <FaPhone className="text-2xl text-purple-400 mb-2" />
                  <p className="text-xs text-gray-400">Emergency Contact</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {profile.emergencyContact ? "Set" : "Not Set"}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-red-600/20 to-red-900/20 rounded-2xl p-4 border border-red-500/30">
                  <FaSos className="text-2xl text-red-400 mb-2" />
                  <p className="text-xs text-gray-400">SOS Status</p>
                  <p className="text-2xl font-bold text-red-400">Ready</p>
                </div>
              </div>
            </div>
          )}

          {/* SOS TAB - Emergency Page */}
          {activeTab === "sos" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-2xl">
                <FaSos className="text-8xl text-red-500 mx-auto mb-6 animate-pulse" />
                <h2 className="text-4xl font-bold mb-4">Emergency SOS</h2>
                <p className="text-gray-300 mb-8">
                  Press the button below to instantly alert emergency services and your emergency contacts.
                  Your location and medical information will be shared automatically.
                </p>
                <button
                  onClick={triggerSOS}
                  disabled={sosActive}
                  className={`px-12 py-6 rounded-2xl font-bold text-2xl transition-all ${
                    sosActive
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 animate-pulse shadow-lg shadow-red-500/50"
                  }`}
                >
                  {sosActive ? "🆘 SOS ACTIVATED 🆘" : "🔴 TRIGGER SOS 🔴"}
                </button>
                <div className="mt-8 p-4 bg-yellow-500/10 rounded-xl">
                  <p className="text-yellow-400 text-sm">
                    ⚠️ Only use this in real emergencies. False alarms may delay help for others.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {["nearby", "map", "risk", "triage", "monitor"].includes(activeTab) && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-7xl mb-6">
                  {activeTab === "nearby" && "🚑🏥"}
                  {activeTab === "map" && "🗺️📍"}
                  {activeTab === "risk" && "⚠️📊"}
                  {activeTab === "triage" && "🏥🩺"}
                  {activeTab === "monitor" && "📱🎥"}
                </div>
                <h3 className="text-3xl font-bold mb-3 capitalize">
                  {activeTab} Page
                </h3>
                <p className="text-gray-400 text-lg">
                  This feature is under development.
                </p>
                <p className="text-gray-500 mt-2">
                  Coming soon with real-time updates!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}