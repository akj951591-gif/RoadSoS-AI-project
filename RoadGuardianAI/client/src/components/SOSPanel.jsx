import { useEffect, useRef, useState } from "react";

export default function SOSPanel() {
  const [active, setActive] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const audioRef = useRef(null);

  const savedUser = JSON.parse(localStorage.getItem("roadsos_user"));

  useEffect(() => {
    let timer;

    if (active && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }

    if (active && countdown === 0) {
      triggerEmergency();
      setActive(false);
      setCountdown(10);
    }

    return () => clearTimeout(timer);
  }, [active, countdown]);

  const startSOS = () => {
    if (!savedUser?.phone) {
      alert("No emergency contact found. Please sign up again with a phone number.");
      return;
    }

    setActive(true);

    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const cancelSOS = () => {
    setActive(false);
    setCountdown(10);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const triggerEmergency = () => {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        const lat = location.coords.latitude;
        const lng = location.coords.longitude;

        const phone = savedUser.phone.replace(/\D/g, "");

        const message =
          `🚨 RoadSoS Emergency Alert 🚨%0A` +
          `${savedUser.name || "User"} needs immediate help.%0A%0A` +
          `📍 Live Location:%0A` +
          `https://maps.google.com/?q=${lat},${lng}%0A%0A` +
          `Please contact emergency services immediately.`;

        window.open(
          `https://wa.me/91${phone}?text=${message}`,
          "_blank"
        );
      },
      () => {
        alert("Location permission denied. Please allow location access.");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  return (
    <section className="min-h-[75vh] flex items-center justify-center">
      <audio
        ref={audioRef}
        src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
      />

      <div className="w-full max-w-2xl bg-[#111827]/70 border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl backdrop-blur-2xl text-center">
        <h1 className="text-5xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          Emergency SOS
        </h1>

        <p className="mt-4 text-gray-400">
          Sends your live location to your saved emergency contact.
        </p>

        <div className="mt-6 bg-black/40 border border-white/10 rounded-2xl p-4">
          <p className="text-gray-400">Emergency Contact</p>

          <h2 className="text-2xl font-bold text-cyan-400">
            {savedUser?.phone || "No number saved"}
          </h2>
        </div>

        {active ? (
          <div className="mt-10">
            <div className="text-8xl font-black text-red-400 animate-pulse">
              {countdown}
            </div>

            <p className="mt-4 text-gray-400">
              Sending SOS in {countdown} seconds...
            </p>

            <button
              onClick={cancelSOS}
              className="mt-8 px-8 py-4 bg-white text-black rounded-2xl text-xl font-bold hover:bg-gray-200"
            >
              Cancel SOS
            </button>
          </div>
        ) : (
          <button
            onClick={startSOS}
            className="mt-10 w-44 h-44 rounded-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-5xl font-black animate-pulse shadow-2xl shadow-red-600/40"
          >
            SOS
          </button>
        )}

        <p className="mt-8 text-sm text-gray-500">
          WhatsApp will open automatically with your location message.
        </p>
      </div>
    </section>
  );
}