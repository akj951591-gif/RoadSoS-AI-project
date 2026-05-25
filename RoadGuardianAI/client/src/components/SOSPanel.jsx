import { useEffect, useRef, useState } from "react";

export default function SOSPanel() {
  const [active, setActive] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const audioRef = useRef(null);

  useEffect(() => {
    let timer;

    if (active && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }

    if (active && countdown === 0) {
      triggerEmergency();
      setActive(false);
      setCountdown(10);
    }

    return () => clearTimeout(timer);
  }, [active, countdown]);

  const startSOS = () => {
    setActive(true);
    audioRef.current?.play();
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
    navigator.geolocation.getCurrentPosition((location) => {
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;

      const message =
        `🚨 RoadSoS Emergency Alert 🚨%0A` +
        `I need immediate help.%0A%0A` +
        `📍 Location:%0Ahttps://maps.google.com/?q=${lat},${lng}`;

      window.open(`https://wa.me/?text=${message}`, "_blank");
    });
  };

  return (
    <section className="min-h-[75vh] flex items-center justify-center">
      <audio
        ref={audioRef}
        src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
      />

      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl backdrop-blur-2xl text-center">
        <h1 className="text-5xl font-black text-red-500">Emergency SOS</h1>
        <p className="mt-4 text-gray-400">
          Sends live location through WhatsApp after countdown.
        </p>

        {active ? (
          <div className="mt-10">
            <div className="text-8xl font-black text-red-500 animate-pulse">
              {countdown}
            </div>

            <button
              onClick={cancelSOS}
              className="mt-8 px-8 py-4 bg-white text-black rounded-2xl text-xl font-bold"
            >
              Cancel SOS
            </button>
          </div>
        ) : (
          <button
            onClick={startSOS}
            className="mt-10 w-44 h-44 rounded-full bg-red-600 hover:bg-red-700 text-5xl font-black animate-pulse shadow-2xl shadow-red-600/40"
          >
            SOS
          </button>
        )}
      </div>
    </section>
  );
}