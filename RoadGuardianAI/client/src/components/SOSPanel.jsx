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
  const [countdown, setCountdown] = useState(5);
  const [location, setLocation] = useState(null);
  const [extraContacts, setExtraContacts] = useState([]);
  const [sendLinks, setSendLinks] = useState([]);
  const [copied, setCopied] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [crashDetection, setCrashDetection] = useState(false);
  const [impactValue, setImpactValue] = useState(0);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const audioRef = useRef(null);
  const recognitionRef = useRef(null);

  const savedUser = JSON.parse(localStorage.getItem("roadsos_user")) || {};
  const medicalProfile =
    JSON.parse(localStorage.getItem("roadsos_medical_profile")) || {};

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
      () => console.log("Location permission denied"),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);

  const cleanPhone = (phone) => {
    let cleaned = String(phone || "").replace(/\D/g, "");

    if (cleaned.length === 10) {
      cleaned = `91${cleaned}`;
    }

    return cleaned;
  };

  const primaryContact = savedUser?.phone
    ? [
        {
          name: savedUser?.name || "Primary Contact",
          phone: savedUser.phone,
        },
      ]
    : [];

  const allContacts = [...primaryContact, ...extraContacts];

  const getEmergencyMessage = (customLocation = location) => {
    const locationText = customLocation
      ? `https://maps.google.com/?q=${customLocation.lat},${customLocation.lng}`
      : "Location permission not available";

    return (
      `🚨 RoadSoS Emergency Alert 🚨\n\n` +
      `👤 Name: ${savedUser?.name || "User"}\n` +
      `📍 Live Location:\n${locationText}\n\n` +
      `🩺 Medical Information\n` +
      `Age: ${medicalProfile?.age || "Not set"}\n` +
      `Blood Group: ${medicalProfile?.bloodGroup || "Not set"}\n` +
      `Weight: ${medicalProfile?.weight || "Not set"}\n` +
      `Height: ${medicalProfile?.height || "Not set"}\n` +
      `Allergies: ${medicalProfile?.allergies || "None"}\n` +
      `Current Medication: ${medicalProfile?.medication || "None"}\n` +
      `Chronic Disease: ${medicalProfile?.chronicDisease || "None"}\n` +
      `Past Surgery: ${medicalProfile?.pastSurgery || "None"}\n` +
      `Organ Donor: ${medicalProfile?.organDonor || "No"}\n` +
      `Emergency Notes: ${medicalProfile?.emergencyNotes || "No notes"}\n\n` +
      `🚑 Immediate medical assistance required.`
    );
  };

  const addContact = () => {
    if (!contactName.trim() || !contactPhone.trim()) {
      alert("Enter contact name and phone number.");
      return;
    }

    const cleanedPhone = cleanPhone(contactPhone);

    if (cleanedPhone.length < 10) {
      alert("Enter valid phone number.");
      return;
    }

    const exists = allContacts.some(
      (c) => cleanPhone(c.phone) === cleanedPhone
    );

    if (exists) {
      alert("This number is already added.");
      return;
    }

    const updated = [
      ...extraContacts,
      {
        name: contactName.trim(),
        phone: cleanedPhone,
      },
    ];

    setExtraContacts(updated);
    localStorage.setItem("roadsos_extra_contacts", JSON.stringify(updated));

    setContactName("");
    setContactPhone("");
  };

  const removeContact = (index) => {
    const updated = extraContacts.filter((_, i) => i !== index);
    setExtraContacts(updated);
    localStorage.setItem("roadsos_extra_contacts", JSON.stringify(updated));
  };

  const startAlarm = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const startSOS = () => {
    if (allContacts.length === 0) {
      alert("Please add at least one emergency contact.");
      return;
    }

    setSendLinks([]);
    setCountdown(5);
    setActive(true);
    startAlarm();
  };

  const cancelSOS = () => {
    setActive(false);
    setCountdown(5);
    stopAlarm();
  };

  const openEmergencyLinks = (liveLocation) => {
    const message = getEmergencyMessage(liveLocation);

    const links = allContacts.map((contact) => {
      const phone = cleanPhone(contact.phone);

      return {
        name: contact.name,
        phone,
        call: `tel:${phone}`,
        sms: `sms:${phone}?body=${encodeURIComponent(message)}`,
        whatsapp: `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      };
    });

    setSendLinks(links);

    links.forEach((item, index) => {
      setTimeout(() => {
        window.location.href = item.sms;
      }, index * 2500);

      setTimeout(() => {
        window.open(item.whatsapp, "_blank");
      }, index * 2500 + 1000);
    });

    stopAlarm();
  };

  const triggerEmergency = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const liveLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setLocation(liveLocation);
        openEmergencyLinks(liveLocation);
      },
      () => {
        alert("Location permission denied. Sending message without location.");
        openEmergencyLinks(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    let timer;

    if (active && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    if (active && countdown === 0) {
      triggerEmergency();
      setActive(false);
      setCountdown(5);
    }

    return () => clearTimeout(timer);
  }, [active, countdown]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setVoiceActive(true);
      console.log("Voice SOS started");
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript.toLowerCase();
      }

      console.log("Heard:", transcript);

      if (
        transcript.includes("help") ||
        transcript.includes("emergency") ||
        transcript.includes("save me") ||
        transcript.includes("sos")
      ) {
        recognition.stop();
        setVoiceActive(false);
        startSOS();
      }
    };

    recognition.onerror = (event) => {
      console.log("Voice error:", event.error);
      setVoiceActive(false);

      if (event.error === "not-allowed") {
        alert("Allow microphone permission for Voice SOS.");
      }
    };

    recognition.onend = () => {
      setVoiceActive(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [allContacts.length]);

  const startVoiceSOS = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition works only in Chrome/Edge.");
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.log("Voice already active");
    }
  };

  const stopVoiceSOS = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setVoiceActive(false);
  };

  useEffect(() => {
    if (!crashDetection) return;

    const handleMotion = (event) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const totalForce = Math.sqrt(
        (acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2
      );

      setImpactValue(totalForce.toFixed(2));

      if (totalForce > 35 && !active) {
        startSOS();
      }
    };

    window.addEventListener("devicemotion", handleMotion);

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [crashDetection, active, allContacts.length]);

  const copyMessage = async () => {
    await navigator.clipboard.writeText(getEmergencyMessage());
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <section className="min-h-[75vh] py-10 flex items-center justify-center text-white">
      <audio
        ref={audioRef}
        loop
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
      />

      <div className="w-full max-w-6xl bg-[#111827]/80 border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mb-6">
            <FaExclamationTriangle />
            Emergency Protection Active
          </div>

          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            Emergency SOS
          </h1>

          <p className="mt-4 text-gray-400 text-lg">
            Sends emergency SMS and WhatsApp message with live location and
            medical profile.
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
              Emergency alert will open automatically...
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

        {sendLinks.length > 0 && (
          <div className="mt-10 bg-red-500/10 border border-red-500/30 rounded-3xl p-6">
            <h2 className="text-2xl font-black text-red-400 mb-4">
              Emergency Alert Links
            </h2>

            <p className="text-gray-400 mb-5">
              Browser cannot send SMS/WhatsApp directly. Tap buttons if not
              opened automatically.
            </p>

            <div className="space-y-4">
              {sendLinks.map((item, index) => (
                <div
                  key={index}
                  className="bg-black/40 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-xl">{item.name}</h3>
                    <p className="text-gray-400">{item.phone}</p>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <a href={item.call}>
                      <button className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold flex items-center gap-2">
                        <FaPhoneAlt />
                        Call
                      </button>
                    </a>

                    <a href={item.sms}>
                      <button className="px-5 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black font-bold flex items-center gap-2">
                        <FaSms />
                        SMS
                      </button>
                    </a>

                    <a href={item.whatsapp} target="_blank" rel="noreferrer">
                      <button className="px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 font-bold flex items-center gap-2">
                        <FaWhatsapp />
                        WhatsApp
                      </button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
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
              <span className="text-cyan-400 font-bold">{impactValue}</span>
            </p>
          </div>
        </div>

        <div className="mt-14 bg-black/30 border border-white/10 rounded-3xl p-6">
          <h2 className="text-3xl font-black text-cyan-400">
            Emergency Contacts
          </h2>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Contact name"
              className="px-5 py-4 rounded-xl bg-black/50 border border-white/10 text-white outline-none"
            />

            <input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Emergency phone number"
              className="px-5 py-4 rounded-xl bg-black/50 border border-white/10 text-white outline-none"
            />

            <button
              onClick={addContact}
              className="px-5 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 font-bold flex items-center justify-center gap-2"
            >
              <FaPlus />
              Add Contact
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {allContacts.map((contact, index) => {
              const phone = cleanPhone(contact.phone);
              const message = getEmergencyMessage();

              return (
                <div
                  key={index}
                  className="bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-2xl font-bold">{contact.name}</h3>
                    <p className="text-gray-400">{phone}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a href={`tel:${phone}`}>
                      <button className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold flex items-center gap-2">
                        <FaPhoneAlt />
                        Call
                      </button>
                    </a>

                    <a href={`sms:${phone}?body=${encodeURIComponent(message)}`}>
                      <button className="px-5 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black font-bold flex items-center gap-2">
                        <FaSms />
                        SMS
                      </button>
                    </a>

                    <a
                      href={`https://wa.me/${phone}?text=${encodeURIComponent(
                        message
                      )}`}
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
              );
            })}

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
            className="mt-5 w-full h-72 rounded-2xl bg-black/50 border border-white/10 p-5 text-gray-300 outline-none resize-none"
          />
        </div>
      </div>
    </section>
  );
}
