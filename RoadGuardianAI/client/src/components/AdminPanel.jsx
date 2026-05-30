import { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
  FaAmbulance,
  FaMapMarkedAlt,
  FaBrain,
  FaHospital,
  FaCarCrash,
  FaShieldAlt,
  FaUsers,
  FaChartBar,
  FaBell,
  FaSearch,
  FaFilter,
  FaEye,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaTint,
  FaNotesMedical,
  FaPhone,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaUserMd,
  FaRobot,
  FaChartLine,
} from "react-icons/fa";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminPanel({ user, onLogout, setActiveTab }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [sosActive, setSosActive] = useState(false);
  
  // Sample users data (in real app, fetch from backend)
  const [users, setUsers] = useState(() => {
    const savedUsers = [];
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem("roadsos_user") || "{}");
    if (currentUser.email) {
      savedUsers.push({
        id: 1,
        name: currentUser.name || "Admin User",
        email: currentUser.email,
        phone: currentUser.phone || "9876543210",
        age: "20",
        bloodGroup: "B+",
        address: "Madhaipur",
        status: "active",
        joinDate: "2024-01-15",
        lastActive: "2024-12-29",
        emergencyContact: "AA - 0987654321",
        diseases: "None",
        allergies: "None",
        medications: "None",
        medicalHistory: "None",
        avatar: currentUser.name?.charAt(0) || "A",
        sosCount: 3,
        safetyScore: 98,
        tripsCompleted: 24,
      });
    }
    return savedUsers;
  });

  // Stats data
  const stats = [
    { label: "Total Users", value: users.length, icon: FaUsers, color: "from-blue-500 to-cyan-500", change: "+12%" },
    { label: "Active SOS Today", value: "2", icon: FaAmbulance, color: "from-red-500 to-orange-500", change: "+0%" },
    { label: "Safety Score Avg", value: "94%", icon: FaShieldAlt, color: "from-green-500 to-emerald-500", change: "+5%" },
    { label: "Total Trips", value: "156", icon: FaCarCrash, color: "from-purple-500 to-pink-500", change: "+23%" },
  ];

  // Chart data
  const safetyTrendData = [
    { month: "Jan", score: 85 },
    { month: "Feb", score: 88 },
    { month: "Mar", score: 92 },
    { month: "Apr", score: 89 },
    { month: "May", score: 94 },
    { month: "Jun", score: 96 },
    { month: "Jul", score: 98 },
  ];

  const riskData = [
    { name: "Safe Driving", value: 85, color: "#10B981" },
    { name: "Risk Factors", value: 15, color: "#EF4444" },
  ];

  const sosData = [
    { time: "Week 1", count: 3 },
    { time: "Week 2", count: 5 },
    { time: "Week 3", count: 2 },
    { time: "Week 4", count: 4 },
  ];

  // Trigger SOS function
  const triggerSOS = () => {
    setSosActive(true);
    alert("🆘 SOS ACTIVATED! Emergency services notified.\nYour location and medical info have been shared.");
    setTimeout(() => setSosActive(false), 5000);
  };

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#7C3AED55,transparent_35%),radial-gradient(circle_at_bottom_right,#06B6D455,transparent_35%)]" />

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-cyan-400 text-2xl" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                RoadSoS AI - Admin Portal
              </h1>
            </div>

            {/* Right side - User Dropdown & SOS Button */}
            <div className="flex items-center gap-4">
              {/* Circular SOS Button */}
              <button
                onClick={triggerSOS}
                className={`relative w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 flex items-center justify-center shadow-lg transition-all duration-300 ${sosActive ? 'animate-pulse scale-110' : 'hover:scale-110'}`}
              >
                <FaAmbulance className="text-white text-xl" />
                {sosActive && (
                  <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></span>
                )}
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 border border-gray-700"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center font-bold text-lg">
                    {user?.name?.charAt(0) || "A"}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold">{user?.name || "Admin"}</p>
                    <p className="text-xs text-gray-400">Administrator</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-in">
                    <div className="p-4 border-b border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center font-bold text-xl">
                          {user?.name?.charAt(0) || "A"}
                        </div>
                        <div>
                          <p className="font-bold">{user?.name || "Admin"}</p>
                          <p className="text-xs text-gray-400">{user?.email || "admin@roadsos.com"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      {[
                        { icon: FaHome, label: "Dashboard", section: "dashboard" },
                        { icon: FaAmbulance, label: "Emergency SOS", section: "emergency" },
                        { icon: FaUsers, label: "User Management", section: "users" },
                        { icon: FaChartBar, label: "Analytics", section: "analytics" },
                        { icon: FaMapMarkedAlt, label: "Live Tracking", section: "tracking" },
                        { icon: FaRobot, label: "AI Reports", section: "reports" },
                      ].map((item) => (
                        <button
                          key={item.section}
                          onClick={() => {
                            setSelectedSection(item.section);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors"
                        >
                          <item.icon className="text-gray-400 text-lg" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-800 p-2">
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Section */}
        {selectedSection === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <stat.icon className={`text-3xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                    <span className="text-sm font-semibold text-green-400">{stat.change}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Safety Trend */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-4">Safety Trend Overview</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={safetyTrendData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="score" stroke="#3B82F6" fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Risk Assessment */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-4">Risk Assessment</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={riskData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                  <span className="text-green-400 font-bold">85% Safe</span>
                  <span className="text-gray-400 mx-2">|</span>
                  <span className="text-red-400 font-bold">15% Risk</span>
                </div>
              </div>
            </div>

            {/* SOS Activity Chart */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">SOS Activity (Last 4 Weeks)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={sosData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="#EF4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Alerts */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Recent Emergency Alerts</h3>
              <div className="space-y-3">
                {[
                  { user: "John Doe", location: "Highway 101, Exit 45", time: "10 minutes ago", status: "resolved" },
                  { user: "Jane Smith", location: "Downtown, Main St", time: "1 hour ago", status: "responding" },
                  { user: "Mike Johnson", location: "Airport Road", time: "3 hours ago", status: "resolved" },
                ].map((alert, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                    <div>
                      <p className="font-semibold">{alert.user}</p>
                      <p className="text-xs text-gray-400">{alert.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{alert.time}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${alert.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {alert.status === 'resolved' ? 'Resolved' : 'Responding'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Emergency SOS Section */}
        {selectedSection === "emergency" && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-2xl">
              <div className="relative mb-8">
                <button
                  onClick={triggerSOS}
                  className={`w-48 h-48 rounded-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 flex flex-col items-center justify-center gap-3 shadow-2xl transition-all duration-300 mx-auto ${sosActive ? 'animate-pulse scale-110' : 'hover:scale-110'}`}
                >
                  <FaAmbulance className="text-white text-6xl" />
                  <span className="text-white font-bold text-xl">SOS</span>
                </button>
                {sosActive && (
                  <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                )}
              </div>
              <h2 className="text-3xl font-bold mb-4">Emergency SOS Button</h2>
              <p className="text-gray-300 mb-6">
                Press the SOS button in case of emergency. Your location and medical information will be immediately shared with emergency services and your emergency contacts.
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-yellow-400 text-sm">
                  ⚠️ Only use this in real emergencies. False alarms may delay help for others.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User Management Section */}
        {selectedSection === "users" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-2xl font-bold">User Management</h2>
              <div className="flex gap-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button className="px-4 py-2 bg-gray-800 rounded-xl flex items-center gap-2 hover:bg-gray-700 transition">
                  <FaFilter /> Filter
                </button>
              </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div key={user.id} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300">
                  {/* User Header */}
                  <div className="bg-gradient-to-r from-violet-600/20 to-cyan-500/20 p-6 text-center border-b border-gray-800">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center text-3xl font-bold mx-auto mb-3 shadow-lg">
                      {user.avatar}
                    </div>
                    <h3 className="text-xl font-bold">{user.name}</h3>
                    <p className="text-sm text-gray-400">{user.email}</p>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Phone</span>
                      <span className="text-white text-sm">{user.phone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Age / Blood Group</span>
                      <span className="text-white text-sm">{user.age} / {user.bloodGroup}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Emergency Contact</span>
                      <span className="text-white text-sm">{user.emergencyContact}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Safety Score</span>
                      <span className="text-green-400 text-sm font-bold">{user.safetyScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">SOS Count</span>
                      <span className="text-red-400 text-sm font-bold">{user.sosCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Trips Completed</span>
                      <span className="text-white text-sm">{user.tripsCompleted}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Last Active</span>
                      <span className="text-white text-sm">{user.lastActive}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="flex-1 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 text-sm flex items-center justify-center gap-2 transition"
                      >
                        <FaEye /> View Details
                      </button>
                      <button className="flex-1 px-3 py-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-400 text-sm flex items-center justify-center gap-2 transition">
                        <FaEdit /> Edit
                      </button>
                      <button className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 text-sm flex items-center justify-center gap-2 transition">
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Section */}
        {selectedSection === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">System Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-bold mb-4">User Growth</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={safetyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                    <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-bold mb-4">Emergency Response Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sosData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                    <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-800">
              <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-2xl font-bold">User Details</h2>
                <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-white">
                  <FaTimesCircle className="text-2xl" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center text-4xl font-bold mx-auto mb-4">
                    {selectedUser.avatar}
                  </div>
                  <h3 className="text-2xl font-bold">{selectedUser.name}</h3>
                  <p className="text-gray-400">{selectedUser.email}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Phone</p>
                    <p className="font-semibold">{selectedUser.phone}</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Age</p>
                    <p className="font-semibold">{selectedUser.age}</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Blood Group</p>
                    <p className="font-semibold">{selectedUser.bloodGroup}</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Address</p>
                    <p className="font-semibold">{selectedUser.address}</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Emergency Contact</p>
                    <p className="font-semibold">{selectedUser.emergencyContact}</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Safety Score</p>
                    <p className="font-semibold text-green-400">{selectedUser.safetyScore}%</p>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Medical Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Diseases:</span> {selectedUser.diseases}</p>
                    <p><span className="text-gray-400">Allergies:</span> {selectedUser.allergies}</p>
                    <p><span className="text-gray-400">Medications:</span> {selectedUser.medications}</p>
                    <p><span className="text-gray-400">Medical History:</span> {selectedUser.medicalHistory}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}