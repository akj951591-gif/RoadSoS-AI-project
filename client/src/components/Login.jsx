import { useState } from "react";

import {
  FaLock,
  FaUserPlus,
  FaUserShield,
  FaKey,
  FaPhone,
} from "react-icons/fa";

export default function Login({ onLogin }) {

  const [mode, setMode] =
    useState("signin");

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

  const handleSubmit = (e) => {

    e.preventDefault();

    // SIGN UP

    if (mode === "signup") {

      if (
        !form.phone ||
        form.phone.replace(/\D/g, "").length < 10
      ) {

        alert(
          "Please enter at least one valid emergency contact number."
        );

        return;
      }

      localStorage.setItem(
        "roadsos_user",

        JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        })
      );

      alert(
        "Account created successfully."
      );

      setMode("signin");

      return;
    }

    // SIGN IN

    if (mode === "signin") {

      const savedUser =
        JSON.parse(
          localStorage.getItem(
            "roadsos_user"
          )
        );

      if (!savedUser) {

        alert(
          "No account found. Please sign up first."
        );

        return;
      }

      if (
        savedUser.email === form.email &&
        savedUser.password === form.password
      ) {

        onLogin(savedUser);

      } else {

        alert(
          "Invalid email or password."
        );
      }

      return;
    }

    // CHANGE PASSWORD

    if (mode === "change") {

      const savedUser =
        JSON.parse(
          localStorage.getItem(
            "roadsos_user"
          )
        );

      if (!savedUser) {

        alert(
          "No account found."
        );

        return;
      }

      if (
        savedUser.email === form.email &&
        savedUser.password === form.password
      ) {

        const updatedUser = {
          ...savedUser,
          password: form.newPassword,
        };

        localStorage.setItem(
          "roadsos_user",
          JSON.stringify(updatedUser)
        );

        alert(
          "Password changed successfully."
        );

        setMode("signin");

      } else {

        alert(
          "Current password incorrect."
        );
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

            </span>

            {" "}AI

          </h1>

          <p className="mt-3 text-gray-400">

            {
              mode === "signin"

              ? "Sign in to emergency dashboard"

              : mode === "signup"

              ? "Create emergency account"

              : "Change your password"
            }

          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* FULL NAME */}

          {
            mode === "signup" && (

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
            )
          }

          {/* PHONE */}

          {
            mode === "signup" && (

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

                  This number will receive
                  your live location during SOS.

                </p>

              </div>
            )
          }

          {/* EMAIL */}

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

          {/* PASSWORD */}

          <div>

            <label
              className="
              block
              mb-2
              font-bold
              "
            >

              {
                mode === "change"

                ? "Current Password"

                : "Password"
              }

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

          {
            mode === "change" && (

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
            )
          }

          {/* BUTTON */}

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

            {
              mode === "signin"

              ? <FaLock />

              : mode === "signup"

              ? <FaUserPlus />

              : <FaKey />
            }

            {
              mode === "signin"

              ? "Sign In"

              : mode === "signup"

              ? "Sign Up"

              : "Change Password"
            }

          </button>

        </form>

        {/* LINKS */}

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

            {
              mode === "signin"

              ? "New user? Create account"

              : "Already have account? Sign in"
            }

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