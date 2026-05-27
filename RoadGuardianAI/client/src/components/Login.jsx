import { useState } from "react";

import {
  FaLock,
  FaUserPlus,
  FaUserShield,
  FaKey,
  FaPhone,
} from "react-icons/fa";

export default function Login({ onLogin }) {
  const API_URL = "https://roadsos-ai-project.onrender.com";

  const [mode, setMode] = useState("signin");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // SIGN UP
    if (mode === "signup") {
      if (!form.phone || form.phone.replace(/\D/g, "").length < 10) {
        alert("Please enter at least one valid emergency contact number.");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
          }),
        });

        const data = await response.json();

        alert(data.message);

        if (data.success) {
          setMode("signin");
        }
      } catch {
        alert("Signup failed. Backend may be offline.");
      }

      return;
    }

    // SIGN IN
    if (mode === "signin") {
      try {
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem("roadsos_user", JSON.stringify(data.user));
          onLogin(data.user);
        } else {
          alert(data.message);
        }
      } catch {
        alert("Login failed. Backend may be offline.");
      }

      return;
    }

    // CHANGE PASSWORD
    if (mode === "change") {
      try {
        const response = await fetch(`${API_URL}/change-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            old_password: form.password,
            new_password: form.newPassword,
          }),
        });

        const data = await response.json();

        alert(data.message);

        if (data.success) {
          setMode("signin");
        }
      } catch {
        alert("Password change failed. Backend may be offline.");
      }
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
      <div
        className="
        fixed
        inset-0
        -z-10
        bg-[radial-gradient(circle_at_top_left,#7C3AED55,transparent_35%),radial-gradient(circle_at_bottom_right,#06B6D455,transparent_35%)]
        "
      />

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

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {mode === "signup" && (
            <div>
              <label
                className="
                block
                mb-2
                font-bold
                "
              >
                Full Name
              </label>

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

          {mode === "signup" && (
            <div>
              <label
                className="
                block
                mb-2
                font-bold
                "
              >
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

              <p
                className="
                mt-2
                text-xs
                text-gray-400
                "
              >
                This number will receive your live location during SOS.
              </p>
            </div>
          )}

          <div>
            <label
              className="
              block
              mb-2
              font-bold
              "
            >
              Email
            </label>

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

          <div>
            <label
              className="
              block
              mb-2
              font-bold
              "
            >
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

          {mode === "change" && (
            <div>
              <label
                className="
                block
                mb-2
                font-bold
                "
              >
                New Password
              </label>

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

          <button
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
            "
          >
            {mode === "signin" ? (
              <FaLock />
            ) : mode === "signup" ? (
              <FaUserPlus />
            ) : (
              <FaKey />
            )}

            {mode === "signin"
              ? "Sign In"
              : mode === "signup"
              ? "Sign Up"
              : "Change Password"}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <button
            onClick={() =>
              setMode(
                mode === "signin"
                  ? "signup"
                  : "signin"
              )
            }
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
      </div>
    </div>
  );
}