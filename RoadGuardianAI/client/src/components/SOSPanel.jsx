import { useEffect, useRef, useState } from "react";

import {
  FaPhoneAlt,
  FaWhatsapp,
  FaSms,
  FaCopy,
  FaPlus,
  FaTrash,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaMicrophone,
  FaCarCrash,
} from "react-icons/fa";

export default function SOSPanel() {
  const [active, setActive] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [location, setLocation] = useState(null);
  const [extraContacts, setExtraContacts] = useState([]);
  const [copied, setCopied] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [crashDetection, setCrashDetection] = useState(false);
  const [impactValue, setImpactValue] = useState(0);

  const audioRef = useRef(null);
  const recognitionRef = useRef(null);

  const savedUser =
    JSON.parse(localStorage.getItem("roadsos_user")) || {};

  useEffect(() => {
    const savedExtra =
      JSON.parse(localStorage.getItem("roadsos_extra_contacts")) || [];

    setExtraContacts(savedExtra);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        console.log("Location permission denied");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Voice recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase();

      if (
        transcript.includes("help") ||
        transcript.includes("emergency") ||
        transcript.includes("save me") ||
        transcript.includes("sos")
      ) {
        startSOS();
      }
    };

    recognition.onerror = () => {
      setVoiceActive(false);
    };

    recognition.onend = () => {
      setVoiceActive(false);
    };

    recognitionRef.current = recognition;
  }, []);

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

  useEffect(() => {
    if (!crashDetection) return;

    const handleMotion = (event) => {
      const acc = event.accelerationIncludingGravity;

      if (!acc) return;

      const totalForce = Math.sqrt(
        (acc.x || 0) ** 2 +
          (acc.y || 0) ** 2 +
          (acc.z || 0) ** 2
      );

      setImpactValue(totalForce.toFixed(2));

      if (totalForce > 35 && !active) {
        alert("Possible crash detected. Starting SOS countdown.");
        startSOS();
      }
    };

    window.addEventListener("devicemotion", handleMotion);

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [crashDetection, active]);

  const primaryContact = savedUser?.phone
    ? [
        {
          name: "Primary Contact",
          phone: savedUser.phone,
        },
      ]
    : [];

  const allContacts = [...primaryContact, ...extraContacts];

  const cleanPhone = (phone) => {
    const cleaned = String(phone || "").replace(/\D/g, "");

    if (cleaned.startsWith("91")) {
      return cleaned;
    }

    return `91${cleaned}`;
  };

  const getEmergencyMessage = () => {
    const lat = location?.lat;
    const lng = location?.lng;

    return (
      `🚨 RoadSoS Emergency Alert 🚨\n\n` +
      `${savedUser?.name || "User"} may be in danger or involved in an accident.\n\n` +
      `📍 Live Location:\n` +
      `https://maps.google.com/?q=${lat},${lng}\n\n` +
      `Please contact emergency services immediately.`
    );
  };

  const startSOS = () => {
    if (allContacts.length === 0) {
      alert("No emergency contact found.");
      return;
    }

    if (!active) {
      setActive(true);

      if (audioRef.current) {
        audioRef.current.play();
      }
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
      (pos) => {
        const liveLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setLocation(liveLocation);

        const message =
          `🚨 RoadSoS Emergency Alert 🚨\n\n` +
          `${savedUser?.name || "User"} needs immediate help.\n\n` +
          `📍 Live Location:\n` +
          `https://maps.google.com/?q=${liveLocation.lat},${liveLocation.lng}\n\n` +
          `Please contact emergency services immediately.`;

        const firstContact = allContacts[0];

        window.location.href = `sms:${cleanPhone(
          firstContact.phone
        )}?body=${encodeURIComponent(message)}`;

        setTimeout(() => {
          window.open(
            `https://wa.me/${cleanPhone(
              firstContact.phone
            )}?text=${encodeURIComponent(message)}`,
            "_blank"
          );
        }, 2000);
      },
      () => {
        alert("Location permission denied.");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const addContact = () => {
    const name = prompt("Enter contact name:");
    const phone = prompt("Enter emergency phone number:");

    if (!name || !phone) return;

    if (phone.replace(/\D/g, "").length < 10) {
      alert("Enter valid phone number.");
      return;
    }

    const updated = [
      ...extraContacts,
      {
        name,
        phone,
      },
    ];

    setExtraContacts(updated);
    localStorage.setItem("roadsos_extra_contacts", JSON.stringify(updated));
  };

  const removeContact = (index) => {
    const updated = extraContacts.filter((_, i) => i !== index);

    setExtraContacts(updated);
    localStorage.setItem("roadsos_extra_contacts", JSON.stringify(updated));
  };

  const copyMessage = async () => {
    await navigator.clipboard.writeText(getEmergencyMessage());

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const startVoiceSOS = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    try {
      recognitionRef.current.start();
      setVoiceActive(true);
    } catch {
      setVoiceActive(true);
    }
  };

  const stopVoiceSOS = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setVoiceActive(false);
  };

  return (
    <section className="min-h-[75vh] py-10 flex items-center justify-center">
      <audio
        ref={audioRef}
        src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
      />

      <div className="w-full max-w-6xl bg-[#111827]/70 border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl backdrop-blur-2xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mb-6">
            <FaExclamationTriangle />
            Emergency Protection Active
          </div>

          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            Emergency SOS
          </h1>

          <p className="mt-4 text-gray-400 text-lg">
            Voice SOS, crash detection, SMS, WhatsApp and live GPS emergency alert.
          </p>
        </div>

        <div className="mt-8 bg-black/30 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-red-500 text-3xl" />

            <div>
              <p className="text-gray-400">Current Location</p>

              <h2 className="text-xl font-bold">
                {location
                  ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
                  : "Fetching live location..."}
              </h2>
            </div>
          </div>
        </div>

        {active ? (
          <div className="mt-12 text-center">
            <div className="text-9xl font-black text-red-500 animate-pulse">
              {countdown}
            </div>

            <p className="mt-4 text-gray-400 text-xl">
              Sending emergency alert...
            </p>

            <button
              onClick={cancelSOS}
              className="mt-8 px-10 py-4 bg-white text-black rounded-2xl text-xl font-black hover:bg-gray-200"
            >
              Cancel SOS
            </button>
          </div>
        ) : (
          <div className="text-center mt-12">
            <button
              onClick={startSOS}
              className="w-52 h-52 rounded-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-6xl font-black shadow-2xl shadow-red-600/40 animate-pulse"
            >
              SOS
            </button>
          </div>
        )}

        <div className="mt-10 grid md:grid-cols-2 gap-5">
          <div className="bg-black/30 border border-white/10 rounded-3xl p-6 text-center">
            {voiceActive ? (
              <button
                onClick={stopVoiceSOS}
                className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 font-black text-xl flex items-center gap-3 mx-auto"
              >
                <FaMicrophone />
                Stop Voice SOS
              </button>
            ) : (
              <button
                onClick={startVoiceSOS}
                className="px-8 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-700 font-black text-xl flex items-center gap-3 mx-auto"
              >
                <FaMicrophone />
                Activate Voice SOS
              </button>
            )}

            <p className="mt-4 text-gray-400">
              Say: <span className="text-cyan-400">help</span>,{" "}
              <span className="text-cyan-400">emergency</span>,{" "}
              <span className="text-cyan-400">save me</span>, or{" "}
              <span className="text-cyan-400">sos</span>
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-3xl p-6 text-center">
            <button
              onClick={() => setCrashDetection(!crashDetection)}
              className={`px-8 py-4 rounded-2xl font-black text-xl flex items-center gap-3 mx-auto ${
                crashDetection
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              <FaCarCrash />
              {crashDetection
                ? "Stop Crash Detection"
                : "Start Crash Detection"}
            </button>

            <p className="mt-4 text-gray-400">
              Impact Force:{" "}
              <span className="text-cyan-400 font-bold">
                {impactValue}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-14 bg-black/30 border border-white/10 rounded-3xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-3xl font-black text-cyan-400">
              Emergency Contacts
            </h2>

            <button
              onClick={addContact}
              className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 font-bold flex items-center justify-center gap-2"
            >
              <FaPlus />
              Add Contact
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {allContacts.map((contact, index) => (
              <div
                key={index}
                className="bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-2xl font-bold">{contact.name}</h3>
                  <p className="text-gray-400">{contact.phone}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a href={`tel:${cleanPhone(contact.phone)}`}>
                    <button className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold flex items-center gap-2">
                      <FaPhoneAlt />
                      Call
                    </button>
                  </a>

                  <a
                    href={`sms:${cleanPhone(
                      contact.phone
                    )}?body=${encodeURIComponent(getEmergencyMessage())}`}
                  >
                    <button className="px-5 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black font-bold flex items-center gap-2">
                      <FaSms />
                      SMS
                    </button>
                  </a>

                  <a
                    href={`https://wa.me/${cleanPhone(
                      contact.phone
                    )}?text=${encodeURIComponent(getEmergencyMessage())}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button className="px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 font-bold flex items-center gap-2">
                      <FaWhatsapp />
                      WhatsApp
                    </button>
                  </a>

                  {index > 0 && (
                    <button
                      onClick={() => removeContact(index - 1)}
                      className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold flex items-center gap-2"
                    >
                      <FaTrash />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}

            {allContacts.length === 0 && (
              <p className="text-center text-gray-400">
                No emergency contacts added.
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 bg-black/30 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-3xl font-black text-violet-400">
              Emergency Message
            </h2>

            <button
              onClick={copyMessage}
              className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 font-bold flex items-center gap-2"
            >
              <FaCopy />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <textarea
            readOnly
            value={getEmergencyMessage()}
            className="mt-5 w-full h-52 rounded-2xl bg-black/50 border border-white/10 p-5 text-gray-300 outline-none resize-none"
          />
        </div>
      </div>
    </section>
  );
}