import { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaCalendarAlt,
  FaTint,
  FaNotesMedical,
  FaPhone,
  FaEnvelope,
  FaHeartbeat,
  FaShieldAlt,
  FaExclamationTriangle,
  FaSyringe,
  FaAmbulance,
  FaMapMarkerAlt,
  FaFileMedical,
  FaUserMd,
  FaEdit,
  FaSave,
  FaTimes,
  FaChartLine,
  FaClock,
  FaCheckCircle,
  FaBell,
  FaHospital,
  FaCar,
  FaCloudSun,
  FaRoad,
  FaUsers,
  FaStar,
  FaAward,
} from "react-icons/fa";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function DashboardHome({ setActiveTab }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  const savedUser = JSON.parse(localStorage.getItem("roadsos_user") || "{}");
  
  const [profile, setProfile] = useState({
    age: "",
    bloodGroup: "",
    diseases: "",
    allergies: "",
    medications: "",
    emergencyContactName: "",
    emergencyContact: "",
    address: "",
    medicalHistory: "",
    organDonor: false,
    bloodPressure: "",
    weight: "",
    height: "",
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem(`profile_${savedUser?.email}`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, [savedUser?.email]);

  const saveProfile = () => {
    localStorage.setItem(`profile_${savedUser?.email}`, JSON.stringify(profile));
    setIsEditing(false);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({
      ...profile,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  // Sample data for charts
  const safetyData = [
    { time: "Mon", score: 92 },
    { time: "Tue", score: 88 },
    { time: "Wed", score: 95 },
    { time: "Thu", score: 91 },
    { time: "Fri", score: 94 },
    { time: "Sat", score: 98 },
    { time: "Sun", score: 96 },
  ];

  const riskData = [
    { name: "Safe Driving", value: 85, color: "#10B981" },
    { name: "Risk Factors", value: 15, color: "#EF4444" },
  ];

  const COLORS = ["#10B981", "#EF4444"];

  const stats = [
    { label: "Safety Score", value: "98%", change: "+5%", icon: FaShieldAlt, color: "from-blue-500 to-cyan-500" },
    { label: "Trips This Month", value: "24", change: "+8", icon: FaCar, color: "from-green-500 to-emerald-500" },
    { label: "Emergency Contacts", value: profile.emergencyContact ? "2" : "1", change: profile.emergencyContact ? "+1" : "0", icon: FaUsers, color: "from-purple-500 to-pink-500" },
    { label: "Response Time", value: "2.4s", change: "-0.3s", icon: FaClock, color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2">
            <FaCheckCircle className="text-xl" />
            <span>Profile saved successfully!</span>
          </div>
        </div>
      )}

      {/* Welcome Section with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Welcome back, {savedUser?.name?.split(" ")[0] || "User"}
              </h2>
              <p className="text-gray-400 text-lg">Your safety dashboard is ready. Stay vigilant on the road.</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-700">
                <FaClock className="inline mr-2 text-blue-400" />
                <span className="text-sm text-gray-300">Last trip: Today, 2:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="group relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
            <div className="relative">
              <div className="flex justify-between items-start mb-3">
                <stat.icon className={`text-3xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Profile Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-6 py-4 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FaUserCircle className="text-3xl text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Complete Medical Profile</h3>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 text-sm font-semibold"
                  >
                    <FaEdit /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={saveProfile}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200 text-sm font-semibold"
                    >
                      <FaSave /> Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 text-sm font-semibold"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Personal Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300 border-b border-gray-800 pb-2">
                    <FaUserMd className="text-blue-400" />
                    <span className="font-semibold">Personal Information</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Age</span>
                      {isEditing ? (
                        <input type="number" name="age" value={profile.age} onChange={handleProfileChange} className="bg-gray-800 px-3 py-1 rounded-lg text-white text-sm w-24 text-right" placeholder="Age" />
                      ) : (
                        <span className="text-white font-medium">{profile.age || "—"}</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Blood Group</span>
                      {isEditing ? (
                        <select name="bloodGroup" value={profile.bloodGroup} onChange={handleProfileChange} className="bg-gray-800 px-3 py-1 rounded-lg text-white text-sm">
                          <option value="">Select</option>
                          {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </select>
                      ) : (
                        <span className="text-white font-medium">{profile.bloodGroup || "—"}</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Weight / Height</span>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <input type="number" name="weight" value={profile.weight} onChange={handleProfileChange} placeholder="kg" className="bg-gray-800 px-2 py-1 rounded-lg text-white text-sm w-16 text-right" />
                          <input type="number" name="height" value={profile.height} onChange={handleProfileChange} placeholder="cm" className="bg-gray-800 px-2 py-1 rounded-lg text-white text-sm w-16 text-right" />
                        </div>
                      ) : (
                        <span className="text-white font-medium">{profile.weight ? `${profile.weight}kg / ${profile.height}cm` : "—"}</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Blood Pressure</span>
                      {isEditing ? (
                        <input type="text" name="bloodPressure" value={profile.bloodPressure} onChange={handleProfileChange} className="bg-gray-800 px-3 py-1 rounded-lg text-white text-sm w-24 text-right" placeholder="120/80" />
                      ) : (
                        <span className="text-white font-medium">{profile.bloodPressure || "—"}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300 border-b border-gray-800 pb-2">
                    <FaPhone className="text-red-400" />
                    <span className="font-semibold">Emergency Contact</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Contact Name</span>
                      {isEditing ? (
                        <input type="text" name="emergencyContactName" value={profile.emergencyContactName} onChange={handleProfileChange} className="bg-gray-800 px-3 py-1 rounded-lg text-white text-sm w-32 text-right" placeholder="Name" />
                      ) : (
                        <span className="text-white font-medium">{profile.emergencyContactName || "—"}</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Phone Number</span>
                      {isEditing ? (
                        <input type="tel" name="emergencyContact" value={profile.emergencyContact} onChange={handleProfileChange} className="bg-gray-800 px-3 py-1 rounded-lg text-white text-sm w-32 text-right" placeholder="+91..." />
                      ) : (
                        <span className="text-white font-medium">{profile.emergencyContact || "—"}</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Organ Donor</span>
                      {isEditing ? (
                        <label className="flex items-center gap-2">
                          <input type="checkbox" name="organDonor" checked={profile.organDonor} onChange={handleProfileChange} className="w-4 h-4" />
                          <span className="text-white text-sm">Yes</span>
                        </label>
                      ) : (
                        <span className="text-white font-medium">{profile.organDonor ? "✅ Yes" : "❌ No"}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Medical Conditions */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-3 text-gray-300 border-b border-gray-800 pb-2">
                    <FaNotesMedical className="text-yellow-400" />
                    <span className="font-semibold">Medical Information</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isEditing ? (
                      <>
                        <textarea name="diseases" value={profile.diseases} onChange={handleProfileChange} rows="2" className="bg-gray-800 px-3 py-2 rounded-lg text-white text-sm" placeholder="Diseases / Conditions"></textarea>
                        <textarea name="allergies" value={profile.allergies} onChange={handleProfileChange} rows="2" className="bg-gray-800 px-3 py-2 rounded-lg text-white text-sm" placeholder="Allergies"></textarea>
                        <textarea name="medications" value={profile.medications} onChange={handleProfileChange} rows="2" className="bg-gray-800 px-3 py-2 rounded-lg text-white text-sm" placeholder="Medications"></textarea>
                        <textarea name="medicalHistory" value={profile.medicalHistory} onChange={handleProfileChange} rows="2" className="bg-gray-800 px-3 py-2 rounded-lg text-white text-sm" placeholder="Medical History"></textarea>
                      </>
                    ) : (
                      <>
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <p className="text-gray-400 text-xs mb-1">Diseases</p>
                          <p className="text-white text-sm">{profile.diseases || "None reported"}</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <p className="text-gray-400 text-xs mb-1">Allergies</p>
                          <p className="text-white text-sm">{profile.allergies || "None reported"}</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <p className="text-gray-400 text-xs mb-1">Medications</p>
                          <p className="text-white text-sm">{profile.medications || "None listed"}</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <p className="text-gray-400 text-xs mb-1">Medical History</p>
                          <p className="text-white text-sm">{profile.medicalHistory || "None significant"}</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Address</span>
                      {isEditing && <span className="text-xs text-gray-500">For emergency services</span>}
                    </div>
                    {isEditing ? (
                      <textarea name="address" value={profile.address} onChange={handleProfileChange} rows="2" className="w-full bg-gray-800 px-3 py-2 rounded-lg text-white text-sm" placeholder="Your full address"></textarea>
                    ) : (
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <p className="text-white text-sm">{profile.address || "No address set"}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Charts & Insights */}
        <div className="space-y-6">
          {/* Safety Score Chart */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Safety Trend</h3>
              <FaChartLine className="text-blue-400" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={safetyData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="score" stroke="#3B82F6" fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-3 text-center">
              <span className="text-green-400 text-sm">↑ 5% improvement this week</span>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Risk Assessment</h3>
              <FaShieldAlt className="text-green-400" />
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={riskData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <span className="text-green-400 font-bold">85% Safe</span>
              <span className="text-gray-400 text-sm mx-2">|</span>
              <span className="text-red-400 font-bold">15% Risk</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => setActiveTab("SOS")} className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-600/40 flex items-center justify-center gap-2">
                <FaAmbulance /> 🚨 TRIGGER SOS
              </button>
              <button onClick={() => setActiveTab("Nearby Help")} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/40 flex items-center justify-center gap-2">
                <FaHospital /> 🏥 Find Hospitals
              </button>
              <button onClick={() => setActiveTab("Map")} className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-600/40 flex items-center justify-center gap-2">
                <FaMapMarkerAlt /> 📍 Share Location
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          <FaBell className="text-gray-400" />
        </div>
        <div className="space-y-3">
          {[
            { action: "Safety check completed", time: "2 hours ago", status: "success" },
            { action: "Route optimization applied", time: "Yesterday", status: "info" },
            { action: "Emergency contact notified", time: "2 days ago", status: "warning" },
          ].map((activity, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-400' : activity.status === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'}`}></div>
                <span className="text-white text-sm">{activity.action}</span>
              </div>
              <span className="text-gray-500 text-xs">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Alert Banner */}
      <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-2xl p-4 border border-yellow-600/30">
        <div className="flex items-center gap-3">
          <FaExclamationTriangle className="text-yellow-400 text-xl" />
          <p className="text-yellow-400 text-sm">
            ⚠️ MEDICAL ALERT: Your profile information will be shared with emergency services during SOS activation for faster response.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}