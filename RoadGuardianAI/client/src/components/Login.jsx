import { useState } from "react";

import {
  FaLock,
  FaUserPlus,
  FaUserShield,
  FaKey,
  FaPhone,
} from "react-icons/fa";

// 📌 QUOTES RELATED TO ROAD SAFETY & SOS
const safetyQuotes = [
  "🛡️ Your safety is our mission – one tap can save a life.",
  "🚗 A safe driver is a live driver. Stay alert, stay alive.",
  "📡 RoadSoS AI: Because every second counts in an emergency.",
  "🆘 Be prepared. Be protected. Your guardian on the road.",
  "🧠 AI + Human care = Zero preventable road tragedies.",
  "⚠️ Don't wait for an emergency – set up your SOS now.",
  "🌍 Your family trusts you. Drive like they're watching.",
  "🔔 Fast alert. Real help. RoadSoS AI always has your back.",
];

export default function Login({ onLogin }) {

  const [mode, setMode] = useState("signin");
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    newPassword: "",
  });

  // 📌 Select a random quote when component loads
  const [randomQuote] = useState(
    safetyQuotes[Math.floor(Math.random() * safetyQuotes.length)]
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // ============================================
    // SIGN UP
    // ============================================
    if (mode === "signup") {
      if (!form.phone || form.phone.replace(/\D/g, "").length < 10) {
        alert("Please enter at least one valid emergency contact number.");
        setIsLoading(false);
        return;
      }

      // Save to localStorage (backup)
      const userData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      };
      localStorage.setItem("roadsos_user", JSON.stringify(userData));

      // Save to MySQL via API
      try {
        const response = await fetch("http://localhost:10000/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            contact: form.email,
            password: form.password,
          }),
        });
        
        const data = await response.json();
        if (data.success) {
          console.log("✅ User saved to MySQL successfully!");
          alert("Account created successfully and saved to database!");
        } else {
          console.log("⚠️ MySQL save issue:", data);
          alert("Account created but database save failed. Using local storage.");
        }
      } catch (error) {
        console.log("⚠️ Backend not running. User saved only to localStorage.");
        alert("Account created successfully! (Saved locally only)");
      }

      setMode("signin");
      setIsLoading(false);
      return;
    }

    // ============================================
    // SIGN IN
    // ============================================
    if (mode === "signin") {
      // Try MySQL login first
      try {
        const response = await fetch("http://localhost:10000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contact: form.email,
            password: form.password,
          }),
        });
        
        const data = await response.json();
        if (data.success) {
          console.log("✅ Logged in via MySQL!");
          onLogin(data);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.log("Backend not available, trying localStorage...");
      }
      
      // Fallback to localStorage
      const savedUser = JSON.parse(localStorage.getItem("roadsos_user"));
      if (!savedUser) {
        alert("No account found. Please sign up first.");
        setIsLoading(false);
        return;
      }
      if (savedUser.email === form.email && savedUser.password === form.password) {
        console.log("✅ Logged in via localStorage!");
        onLogin(savedUser);
      } else {
        alert("Invalid email or password.");
      }
      setIsLoading(false);
      return;
    }

    // ============================================
    // CHANGE PASSWORD
    // ============================================
    if (mode === "change") {
      const savedUser = JSON.parse(localStorage.getItem("roadsos_user"));

      if (!savedUser) {
        alert("No account found.");
        setIsLoading(false);
        return;
      }

      if (savedUser.email === form.email && savedUser.password === form.password) {
        const updatedUser = {
          ...savedUser,
          password: form.newPassword,
        };

        localStorage.setItem("roadsos_user", JSON.stringify(updatedUser));
        alert("Password changed successfully.");
        setMode("signin");
      } else {
        alert("Current password incorrect.");
      }
      setIsLoading(false);
      return;
    }
  };

  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-[#0B1020]
      text-white
      px-4
      "
    >
      {/* BACKGROUND */}
      <div
        className="
        fixed
        inset-0
        -z-10
        bg-[radial-gradient(circle_at_top_left,#7C3AED55,transparent_35%),radial-gradient(circle_at_bottom_right,#06B6D455,transparent_35%)]
        "
      />

      {/* CARD */}
      <div
        className="
        w-full
        max-w-md
        bg-[#111827]/70
        border
        border-white/10
        rounded-[2rem]
        p-10
        shadow-2xl
        backdrop-blur-2xl
        "
      >
        {/* HEADER */}
        <div className="text-center">
          <FaUserShield
            className="
            text-cyan-400
            text-6xl
            mx-auto
            "
          />
          <h1
            className="
            mt-6
            text-4xl
            font-black
            "
          >
            <span
              className="
              bg-gradient-to-r
              from-violet-400
              to-cyan-400
              bg-clip-text
              text-transparent
              "
            >
              RoadSoS
            </span>{" "}
            AI
          </h1>
          <p className="mt-3 text-gray-400">
            {mode === "signin"
              ? "Sign in to emergency dashboard"
              : mode === "signup"
              ? "Create emergency account"
              : "Change your password"}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* FULL NAME */}
          {mode === "signup" && (
            <div>
              <label className="block mb-2 font-bold">Full Name</label>
              <input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Ayush Kumar"
                className="
                  w-full
                  p-4
                  rounded-xl
                  bg-black/50
                  border
                  border-white/10
                  outline-none
                  "
              />
            </div>
          )}

          {/* PHONE */}
          {mode === "signup" && (
            <div>
              <label className="block mb-2 font-bold">
                Emergency Contact Number
              </label>
              <div className="relative">
                <FaPhone
                  className="
                    absolute
                    left-4
                    top-5
                    text-cyan-400
                    "
                />
                <input
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="
                    w-full
                    p-4
                    pl-12
                    rounded-xl
                    bg-black/50
                    border
                    border-white/10
                    outline-none
                    "
                />
              </div>
              <p className="mt-2 text-xs text-gray-400">
                This number will receive your live location during SOS.
              </p>
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label className="block mb-2 font-bold">Email</label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="user@example.com"
              className="
              w-full
              p-4
              rounded-xl
              bg-black/50
              border
              border-white/10
              outline-none
              "
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block mb-2 font-bold">
              {mode === "change" ? "Current Password" : "Password"}
            </label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="
              w-full
              p-4
              rounded-xl
              bg-black/50
              border
              border-white/10
              outline-none
              "
            />
          </div>

          {/* NEW PASSWORD */}
          {mode === "change" && (
            <div>
              <label className="block mb-2 font-bold">New Password</label>
              <input
                name="newPassword"
                type="password"
                required
                value={form.newPassword}
                onChange={handleChange}
                placeholder="New password"
                className="
                  w-full
                  p-4
                  rounded-xl
                  bg-black/50
                  border
                  border-white/10
                  outline-none
                  "
              />
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="
            w-full
            py-4
            bg-gradient-to-r
            from-violet-600
            to-cyan-500
            hover:from-violet-700
            hover:to-cyan-600
            rounded-xl
            font-bold
            text-lg
            flex
            items-center
            justify-center
            gap-2
            shadow-lg
            shadow-violet-500/40
            disabled:opacity-50
            disabled:cursor-not-allowed
            "
          >
            {isLoading ? (
              "Loading..."
            ) : mode === "signin" ? (
              <FaLock />
            ) : mode === "signup" ? (
              <FaUserPlus />
            ) : (
              <FaKey />
            )}
            {isLoading
              ? "Please wait..."
              : mode === "signin"
              ? "Sign In"
              : mode === "signup"
              ? "Sign Up"
              : "Change Password"}
          </button>
        </form>

        {/* LINKS */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="
            w-full
            text-cyan-400
            hover:text-cyan-300
            font-bold
            "
          >
            {mode === "signin"
              ? "New user? Create account"
              : "Already have account? Sign in"}
          </button>

          <button
            onClick={() => setMode("change")}
            className="
            w-full
            text-yellow-400
            hover:text-yellow-300
            font-bold
            "
          >
            Change Password
          </button>
        </div>

        {/* 📌 QUOTE AT THE BOTTOM */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400 italic">
            “{randomQuote}”
          </p>
          <p className="text-xs text-gray-500 mt-2">
            🚦 Stay vigilant. Stay safe.
          </p>
        </div>

      </div>
    </div>
  );
}