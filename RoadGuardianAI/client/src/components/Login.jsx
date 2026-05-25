import { useState } from "react";

import {
  FaLock,
  FaUserPlus,
  FaUserShield,
  FaKey,
} from "react-icons/fa";

export default function Login({ onLogin }) {

  const [mode, setMode] =
    useState("signin");

  const [form, setForm] = useState({
    name: "",
    email: "",
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

      localStorage.setItem(
        "roadsos_user",
        JSON.stringify({
          name: form.name,
          email: form.email,
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
      bg-[#030303]
      text-white
      px-4
      "
    >

      <div
        className="
        w-full
        max-w-md
        bg-white/5
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
            text-red-500
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

            RoadSoS
            <span className="text-red-500">
              {" "}AI
            </span>

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

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

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
              Password
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

          <button
            className="
            w-full
            py-4
            bg-red-600
            hover:bg-red-700
            rounded-xl
            font-bold
            text-lg
            flex
            items-center
            justify-center
            gap-2
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

        <div className="mt-6 space-y-3">

          <button
            onClick={() => setMode(
              mode === "signin"
                ? "signup"
                : "signin"
            )}
            className="
            w-full
            text-red-400
            hover:text-red-300
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