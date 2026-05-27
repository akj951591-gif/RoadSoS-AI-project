import { useEffect, useRef, useState } from "react";

import {
  FaPhoneAlt,
  FaWhatsapp,
  FaSms,
  FaCopy,
  FaPlus,
  FaTrash,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function SOSPanel() {
  const [active, setActive] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [location, setLocation] = useState(null);
  const [extraContacts, setExtraContacts] = useState([]);
  const [copied, setCopied] = useState(false);

  const audioRef = useRef(null);

  const savedUser = JSON.parse(localStorage.getItem("roadsos_user"));

  useEffect(() => {
    const savedExtraContacts =
      JSON.parse(localStorage.getItem("roadsos_extra_contacts")) || [];

    setExtraContacts(savedExtraContacts);

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

  const primaryContact = savedUser?.phone
    ? [
        {
          name: savedUser?.name
            ? `${savedUser.name}'s Emergency Contact`
            : "Primary Emergency Contact",
          phone: savedUser.phone,
        },
      ]
    : [];

  const allContacts = [...primaryContact, ...extraContacts];

  const cleanPhone = (phone) => {
    const cleaned = String(phone || "").replace(/\D/g, "");

    if (cleaned.startsWith("91") && cleaned.length === 12) {
      return cleaned;
    }

    if (cleaned.length === 10) {
      return `91${cleaned}`;
    }

    return cleaned;
  };

  const getEmergencyMessage = () => {
    const lat = location?.lat;
    const lng = location?.lng;

    const mapLink =
      lat && lng
        ? `https://maps.google.com/?q=${lat},${lng}`
        : "Location not available yet";

    return (
      `🚨 RoadSoS Emergency Alert 🚨\n\n` +
      `${savedUser?.name || "User"} needs immediate help.\n\n` +
      `📍 Live Location:\n${mapLink}\n\n` +
      `Please contact emergency services immediately.`
    );
  };

  const startSOS = () => {
    if (allContacts.length === 0) {
      alert("No emergency contact found. Please add at least one contact.");
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

        window.open(
          `https://wa.me/${cleanPhone(firstContact.phone)}?text=${encodeURIComponent(
            message
          )}`,
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

    localStorage.setItem(
      "roadsos_extra_contacts",
      JSON.stringify(updated)
    );
  };

  const removeContact = (index) => {
    const updated = extraContacts.filter((_, i) => i !== index);

    setExtraContacts(updated);

    localStorage.setItem(
      "roadsos_extra_contacts",
      JSON.stringify(updated)
    );
  };

  const copyMessage = async () => {
    await navigator.clipboard.writeText(getEmergencyMessage());
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <section className="min-h-[75vh] flex items-center justify-center py-10">
      <audio
        ref={audioRef}
        src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
      />

      <div className="w-full max-w-5xl bg-[#111827]/70 border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl backdrop-blur-2xl">
        <div className="text-center">
          <h1 className="text-5xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Emergency SOS
          </h1>

          <p className="mt-4 text-gray-400">
            Send live location by WhatsApp, SMS, or direct call to emergency contacts.
          </p>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-cyan-400 text-2xl" />
              <div>
                <p className="text-gray-400">Current Location</p>
                <h2 className="text-lg font-bold text-white">
                  {location
                    ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
                    : "Fetching location..."}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400">Total Emergency Contacts</p>
            <h2 className="text-3xl font-black text-cyan-400">
              {allContacts.length}
            </h2>
          </div>
        </div>

        {active ? (
          <div className="mt-10 text-center">
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
          <div className="text-center">
            <button
              onClick={startSOS}
              className="mt-10 w-44 h-44 rounded-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-5xl font-black animate-pulse shadow-2xl shadow-red-600/40"
            >
              SOS
            </button>
          </div>
        )}

        <div className="mt-10 bg-black/30 border border-white/10 rounded-3xl p-6">
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
                  <h3 className="text-xl font-bold">{contact.name}</h3>
                  <p className="text-gray-400">{contact.phone}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a href={`tel:${cleanPhone(contact.phone)}`}>
                    <button className="px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold flex items-center gap-2">
                      <FaPhoneAlt />
                      Call
                    </button>
                  </a>

                  <a
                    href={`sms:${cleanPhone(
                      contact.phone
                    )}?body=${encodeURIComponent(getEmergencyMessage())}`}
                  >
                    <button className="px-4 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black font-bold flex items-center gap-2">
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
                    <button className="px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 font-bold flex items-center gap-2">
                      <FaWhatsapp />
                      WhatsApp
                    </button>
                  </a>

                  {index > 0 && (
                    <button
                      onClick={() => removeContact(index - 1)}
                      className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold flex items-center gap-2"
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

        <div className="mt-8 bg-black/30 border border-white/10 rounded-3xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-3xl font-black text-cyan-400">
              Direct Emergency Message
            </h2>

            <button
              onClick={copyMessage}
              className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 font-bold flex items-center justify-center gap-2"
            >
              <FaCopy />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <textarea
            readOnly
            value={getEmergencyMessage()}
            className="mt-5 w-full h-48 rounded-2xl bg-black/50 border border-white/10 p-5 text-gray-300 outline-none resize-none"
          />
        </div>
      </div>
    </section>
  );
}