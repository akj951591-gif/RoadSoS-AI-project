import { useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";

import {
  FaGoogle,
  FaShieldAlt,
  FaAmbulance,
  FaMapMarkedAlt,
  FaHeartbeat,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";

import {
  auth,
  googleProvider,
} from "../firebase";

export default function Login() {
  const [mode, setMode] =
    useState("signin");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]:
        event.target.value,
    }));

    setError("");
  };

  const saveRoadSoSUser = (user) => {
    const previousUser = JSON.parse(
      localStorage.getItem(
        "roadsos_user"
      ) || "{}"
    );

    const updatedUser = {
      ...previousUser,
      uid: user.uid,
      name:
        user.displayName ||
        form.name ||
        previousUser.name ||
        "User",
      email:
        user.email ||
        form.email ||
        previousUser.email ||
        "",
      photoURL:
        user.photoURL || "",
    };

    delete updatedUser.password;

    localStorage.setItem(
      "roadsos_user",
      JSON.stringify(updatedUser)
    );
  };

  const getErrorMessage = (firebaseError) => {
    switch (firebaseError.code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";

      case "auth/email-already-in-use":
        return "An account already exists with this email.";

      case "auth/weak-password":
        return "Password must contain at least 6 characters.";

      case "auth/invalid-credential":
        return "Incorrect email or password.";

      case "auth/user-not-found":
        return "No account was found with this email.";

      case "auth/wrong-password":
        return "Incorrect email or password.";

      case "auth/popup-closed-by-user":
        return "Google sign-in was cancelled.";

      case "auth/popup-blocked":
        return "The browser blocked the Google sign-in popup.";

      case "auth/network-request-failed":
        return "Network error. Check your internet connection.";

      default:
        return (
          firebaseError.message ||
          "Authentication failed. Please try again."
        );
    }
  };

  const handleEmailAuth = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!form.name.trim()) {
          throw new Error(
            "Please enter your full name."
          );
        }

        const result =
          await createUserWithEmailAndPassword(
            auth,
            form.email.trim(),
            form.password
          );

        await updateProfile(
          result.user,
          {
            displayName:
              form.name.trim(),
          }
        );

        await result.user.reload();

        saveRoadSoSUser({
          ...result.user,
          displayName:
            form.name.trim(),
        });
      } else {
        const result =
          await signInWithEmailAndPassword(
            auth,
            form.email.trim(),
            form.password
          );

        saveRoadSoSUser(
          result.user
        );
      }
    } catch (firebaseError) {
      setError(
        firebaseError.code
          ? getErrorMessage(
              firebaseError
            )
          : firebaseError.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn =
    async () => {
      setError("");
      setLoading(true);

      try {
        const result =
          await signInWithPopup(
            auth,
            googleProvider
          );

        saveRoadSoSUser(
          result.user
        );
      } catch (firebaseError) {
        setError(
          getErrorMessage(
            firebaseError
          )
        );
      } finally {
        setLoading(false);
      }
    };

  const handleForgotPassword =
    async () => {
      if (!form.email.trim()) {
        setError(
          "Enter your email address first."
        );

        return;
      }

      setError("");
      setLoading(true);

      try {
        await sendPasswordResetEmail(
          auth,
          form.email.trim()
        );

        alert(
          "Password reset email sent. Check your inbox."
        );
      } catch (firebaseError) {
        setError(
          getErrorMessage(
            firebaseError
          )
        );
      } finally {
        setLoading(false);
      }
    };

  const isSignUp =
    mode === "signup";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] px-4 py-8 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(124,58,237,0.25),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(6,182,212,0.22),transparent_32%)]" />

      <div className="absolute left-[-100px] top-[20%] h-72 w-72 rounded-full bg-violet-600/20 blur-[100px]" />

      <div className="absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-cyan-500/20 blur-[110px]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:grid-cols-[1fr_1.05fr]">
          <div className="relative hidden border-r border-white/10 bg-gradient-to-br from-violet-600/20 via-blue-600/10 to-cyan-500/10 p-12 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                <FaShieldAlt />
                Smart Emergency Protection
              </div>

              <h1 className="mt-8 text-5xl font-black leading-tight">
                Safety when every
                <span className="block bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  second matters.
                </span>
              </h1>

              <p className="mt-5 max-w-md text-lg leading-relaxed text-gray-300">
                Access SOS alerts, nearby emergency services, AI triage and real-time safety monitoring.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-3">
              <Feature
                icon={FaAmbulance}
                title="Instant SOS"
              />

              <Feature
                icon={FaMapMarkedAlt}
                title="Live Location"
              />

              <Feature
                icon={FaHeartbeat}
                title="AI Triage"
              />
            </div>
          </div>

          <div className="flex items-center justify-center p-5 sm:p-8 md:p-12">
            <div className="w-full max-w-md">
              <div className="mb-7 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-violet-600/30 to-cyan-500/30">
                  <FaShieldAlt className="text-3xl text-cyan-300" />
                </div>

                <h1 className="mt-5 text-4xl font-black">
                  <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    RoadSoS
                  </span>{" "}
                  AI
                </h1>

                <h2 className="mt-5 text-2xl font-bold">
                  {isSignUp
                    ? "Create your account"
                    : "Welcome back"}
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  {isSignUp
                    ? "Create an account to access your emergency dashboard."
                    : "Sign in to continue to your emergency dashboard."}
                </p>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-[#0d1425]/85 p-6 shadow-2xl">
                <button
                  type="button"
                  onClick={
                    handleGoogleSignIn
                  }
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white font-bold text-gray-900 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaGoogle className="text-lg" />

                  Continue with Google
                </button>

                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />

                  <span className="text-sm text-gray-500">
                    or
                  </span>

                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {error && (
                  <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <form
                  onSubmit={
                    handleEmailAuth
                  }
                  className="space-y-5"
                >
                  {isSignUp && (
                    <div>
                      <label className="mb-2 block font-semibold text-gray-200">
                        Full Name
                      </label>

                      <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                        <input
                          type="text"
                          name="name"
                          value={
                            form.name
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Your full name"
                          required
                          className="h-12 w-full rounded-xl border border-white/10 bg-black/40 pl-11 pr-4 text-white outline-none transition focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block font-semibold text-gray-200">
                      Email Address
                    </label>

                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                      <input
                        type="email"
                        name="email"
                        value={
                          form.email
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="user@example.com"
                        required
                        className="h-12 w-full rounded-xl border border-white/10 bg-black/40 pl-11 pr-4 text-white outline-none transition focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="font-semibold text-gray-200">
                        Password
                      </label>

                      {!isSignUp && (
                        <button
                          type="button"
                          onClick={
                            handleForgotPassword
                          }
                          className="text-sm font-semibold text-cyan-400 hover:text-cyan-300"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                      <input
                        type="password"
                        name="password"
                        value={
                          form.password
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Minimum 6 characters"
                        minLength="6"
                        required
                        className="h-12 w-full rounded-xl border border-white/10 bg-black/40 pl-11 pr-4 text-white outline-none transition focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 via-blue-500 to-cyan-500 font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Please wait..."
                      : isSignUp
                        ? "Create Account"
                        : "Sign In"}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                  {isSignUp
                    ? "Already have an account?"
                    : "Don’t have an account?"}

                  <button
                    type="button"
                    onClick={() => {
                      setMode(
                        isSignUp
                          ? "signin"
                          : "signup"
                      );

                      setError("");
                    }}
                    className="ml-2 font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    {isSignUp
                      ? "Sign in"
                      : "Sign up"}
                  </button>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
                <FaShieldAlt className="text-cyan-500" />

                Secure authentication powered by Firebase
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
      <Icon className="mx-auto text-2xl text-cyan-300" />

      <p className="mt-3 text-sm font-semibold text-gray-200">
        {title}
      </p>
    </div>
  );
}