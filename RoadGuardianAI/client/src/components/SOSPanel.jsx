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
  FaEdit,
  FaCheckCircle,
} from "react-icons/fa";

export default function SOSPanel() {
  const [active, setActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [location, setLocation] = useState(null);

  const [primaryContact, setPrimaryContact] =
    useState(null);

  const [primaryName, setPrimaryName] =
    useState("");

  const [primaryPhone, setPrimaryPhone] =
    useState("");

  const [isEditingPrimary, setIsEditingPrimary] =
    useState(false);

  const [extraContacts, setExtraContacts] =
    useState([]);

  const [sendLinks, setSendLinks] = useState([]);
  const [copied, setCopied] = useState(false);
  const [voiceActive, setVoiceActive] =
    useState(false);

  const [crashDetection, setCrashDetection] =
    useState(false);

  const [impactValue, setImpactValue] =
    useState(0);

  const [contactName, setContactName] =
    useState("");

  const [contactPhone, setContactPhone] =
    useState("");

  const audioRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceEnabledRef = useRef(false);
  const contactsRef = useRef([]);

  const savedUser =
    JSON.parse(
      localStorage.getItem("roadsos_user") ||
        "{}"
    );

  const medicalProfile =
    JSON.parse(
      localStorage.getItem(
        "roadsos_medical_profile"
      ) || "{}"
    );

  const cleanPhone = (phone) => {
    let cleaned = String(
      phone || ""
    ).replace(/\D/g, "");

    if (cleaned.length === 10) {
      cleaned = `91${cleaned}`;
    }

    return cleaned;
  };

  const getTenDigitPhone = (phone) => {
    const cleaned = String(
      phone || ""
    ).replace(/\D/g, "");

    if (
      cleaned.length === 12 &&
      cleaned.startsWith("91")
    ) {
      return cleaned.slice(2);
    }

    return cleaned.slice(-10);
  };

  const allContacts = [
    ...(primaryContact
      ? [
          {
            ...primaryContact,
            type: "primary",
          },
        ]
      : []),

    ...extraContacts.map(
      (contact, index) => ({
        ...contact,
        type: "extra",
        extraIndex: index,
      })
    ),
  ];

  useEffect(() => {
    contactsRef.current =
      allContacts;
  }, [
    primaryContact,
    extraContacts,
  ]);

  useEffect(() => {
    const storedPrimary =
      JSON.parse(
        localStorage.getItem(
          "roadsos_primary_contact"
        ) || "null"
      );

    if (storedPrimary?.phone) {
      setPrimaryContact(
        storedPrimary
      );

      setPrimaryName(
        storedPrimary.name || ""
      );

      setPrimaryPhone(
        getTenDigitPhone(
          storedPrimary.phone
        )
      );
    } else {
      setIsEditingPrimary(true);
    }

    const storedExtra =
      JSON.parse(
        localStorage.getItem(
          "roadsos_extra_contacts"
        ) || "[]"
      );

    setExtraContacts(
      Array.isArray(storedExtra)
        ? storedExtra
        : []
    );

    if (!navigator.geolocation) {
      console.log(
        "Geolocation is not supported."
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat:
            position.coords.latitude,
          lng:
            position.coords.longitude,
        });
      },

      () => {
        console.log(
          "Location permission denied."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);

  const savePrimaryContact = () => {
    if (!primaryName.trim()) {
      alert(
        "Please enter the primary contact name."
      );

      return;
    }

    const tenDigitPhone =
      primaryPhone.replace(
        /\D/g,
        ""
      );

    if (
      tenDigitPhone.length !== 10
    ) {
      alert(
        "Please enter a valid 10-digit Indian phone number."
      );

      return;
    }

    const cleanedPhone =
      cleanPhone(tenDigitPhone);

    const duplicate =
      extraContacts.some(
        (contact) =>
          cleanPhone(
            contact.phone
          ) === cleanedPhone
      );

    if (duplicate) {
      alert(
        "This number is already present in additional contacts."
      );

      return;
    }

    const updatedPrimary = {
      name:
        primaryName.trim(),
      phone: cleanedPhone,
    };

    localStorage.setItem(
      "roadsos_primary_contact",
      JSON.stringify(
        updatedPrimary
      )
    );

    setPrimaryContact(
      updatedPrimary
    );

    setPrimaryName(
      updatedPrimary.name
    );

    setPrimaryPhone(
      getTenDigitPhone(
        updatedPrimary.phone
      )
    );

    setIsEditingPrimary(
      false
    );

    alert(
      "Primary emergency contact saved successfully."
    );
  };

  const startEditingPrimary = () => {
    if (primaryContact) {
      setPrimaryName(
        primaryContact.name || ""
      );

      setPrimaryPhone(
        getTenDigitPhone(
          primaryContact.phone
        )
      );
    }

    setIsEditingPrimary(
      true
    );
  };

  const cancelPrimaryEditing = () => {
    if (!primaryContact) {
      setPrimaryName("");
      setPrimaryPhone("");

      return;
    }

    setPrimaryName(
      primaryContact.name || ""
    );

    setPrimaryPhone(
      getTenDigitPhone(
        primaryContact.phone
      )
    );

    setIsEditingPrimary(
      false
    );
  };

  const removePrimaryContact = () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove the primary emergency contact?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      "roadsos_primary_contact"
    );

    setPrimaryContact(null);
    setPrimaryName("");
    setPrimaryPhone("");
    setIsEditingPrimary(true);
    setSendLinks([]);

    alert(
      "Primary emergency contact removed successfully."
    );
  };

  const getEmergencyMessage = (
    customLocation = location
  ) => {
    const locationText =
      customLocation
        ? `https://maps.google.com/?q=${customLocation.lat},${customLocation.lng}`
        : "Location permission not available";

    return (
      `🚨 RoadSoS Emergency Alert 🚨\n\n` +
      `👤 Name: ${
        savedUser?.name || "User"
      }\n` +
      `📍 Live Location:\n${locationText}\n\n` +
      `🩺 Medical Information\n` +
      `Age: ${
        medicalProfile?.age ||
        "Not set"
      }\n` +
      `Blood Group: ${
        medicalProfile?.bloodGroup ||
        "Not set"
      }\n` +
      `Weight: ${
        medicalProfile?.weight ||
        "Not set"
      }\n` +
      `Height: ${
        medicalProfile?.height ||
        "Not set"
      }\n` +
      `Allergies: ${
        medicalProfile?.allergies ||
        "None"
      }\n` +
      `Current Medication: ${
        medicalProfile?.medication ||
        "None"
      }\n` +
      `Chronic Disease: ${
        medicalProfile?.chronicDisease ||
        "None"
      }\n` +
      `Past Surgery: ${
        medicalProfile?.pastSurgery ||
        "None"
      }\n` +
      `Organ Donor: ${
        medicalProfile?.organDonor ||
        "No"
      }\n` +
      `Emergency Notes: ${
        medicalProfile?.emergencyNotes ||
        "No notes"
      }\n\n` +
      `🚑 Immediate medical assistance required.`
    );
  };

  const startAlarm = () => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.currentTime =
      0;

    audioRef.current
      .play()
      .catch(() => {});
  };

  const stopAlarm = () => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime =
      0;
  };

  const startSOS = () => {
    const contacts =
      contactsRef.current;

    if (
      !contacts ||
      contacts.length === 0
    ) {
      alert(
        "Please add a primary emergency contact first."
      );

      setIsEditingPrimary(
        true
      );

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

  const openEmergencyLinks = (
    liveLocation
  ) => {
    const message =
      getEmergencyMessage(
        liveLocation
      );

    const links =
      contactsRef.current
        .map((contact) => {
          const phone =
            cleanPhone(
              contact.phone
            );

          return {
            name:
              contact.name,
            phone,
            call:
              `tel:${phone}`,
            sms:
              `sms:${phone}?body=${encodeURIComponent(
                message
              )}`,
            whatsapp:
              `https://wa.me/${phone}?text=${encodeURIComponent(
                message
              )}`,
          };
        })
        .filter(
          (contact) =>
            contact.phone.length >=
            10
        );

    setSendLinks(links);

    links.forEach(
      (item, index) => {
        setTimeout(() => {
          window.location.href =
            item.sms;
        }, index * 2500);

        setTimeout(() => {
          window.open(
            item.whatsapp,
            "_blank",
            "noopener,noreferrer"
          );
        }, index * 2500 + 1000);
      }
    );

    stopAlarm();
  };

  const triggerEmergency = () => {
    if (!navigator.geolocation) {
      openEmergencyLinks(
        null
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const liveLocation = {
          lat:
            position.coords.latitude,
          lng:
            position.coords.longitude,
        };

        setLocation(
          liveLocation
        );

        openEmergencyLinks(
          liveLocation
        );
      },

      () => {
        alert(
          "Location permission denied. Sending the message without location."
        );

        openEmergencyLinks(
          null
        );
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

    if (
      active &&
      countdown > 0
    ) {
      timer = setTimeout(
        () => {
          setCountdown(
            (previous) =>
              previous - 1
          );
        },
        1000
      );
    }

    if (
      active &&
      countdown === 0
    ) {
      triggerEmergency();

      setActive(false);
      setCountdown(5);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [active, countdown]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log(
        "Speech recognition is not supported."
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous =
      true;

    recognition.interimResults =
      true;

    recognition.lang =
      "en-US";

    recognition.onstart =
      () => {
        setVoiceActive(
          true
        );

        console.log(
          "Voice SOS listening..."
        );
      };

    recognition.onresult =
      (event) => {
        let transcript = "";

        for (
          let index =
            event.resultIndex;
          index <
          event.results.length;
          index++
        ) {
          transcript +=
            event.results[
              index
            ][0].transcript.toLowerCase();
        }

        console.log(
          "Heard:",
          transcript
        );

        const emergencyWords = [
          "help",
          "emergency",
          "save me",
          "sos",
          "accident",
          "bachao",
          "madad",
        ];

        const detected =
          emergencyWords.some(
            (word) =>
              transcript.includes(
                word
              )
          );

        if (!detected) {
          return;
        }

        if (
          contactsRef.current
            .length === 0
        ) {
          alert(
            "Please add a primary emergency contact before using Voice SOS."
          );

          voiceEnabledRef.current =
            false;

          try {
            recognition.stop();
          } catch {}

          setVoiceActive(
            false
          );

          setIsEditingPrimary(
            true
          );

          return;
        }

        voiceEnabledRef.current =
          false;

        try {
          recognition.stop();
        } catch {}

        setVoiceActive(false);
        setSendLinks([]);
        setCountdown(5);
        setActive(true);

        setTimeout(() => {
          startAlarm();
        }, 100);
      };

    recognition.onerror =
      (event) => {
        console.log(
          "Voice error:",
          event.error
        );

        if (
          event.error ===
          "not-allowed"
        ) {
          alert(
            "Microphone permission denied. Please allow microphone permission."
          );

          voiceEnabledRef.current =
            false;

          setVoiceActive(
            false
          );
        }
      };

    recognition.onend =
      () => {
        if (
          voiceEnabledRef.current
        ) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch {}
          }, 500);
        } else {
          setVoiceActive(
            false
          );
        }
      };

    recognitionRef.current =
      recognition;

    return () => {
      voiceEnabledRef.current =
        false;

      try {
        recognition.stop();
      } catch {}
    };
  }, []);

  const startVoiceSOS = () => {
    if (
      !recognitionRef.current
    ) {
      alert(
        "Voice SOS works only in supported browsers such as Chrome or Edge."
      );

      return;
    }

    if (
      contactsRef.current
        .length === 0
    ) {
      alert(
        "Please add a primary emergency contact first."
      );

      setIsEditingPrimary(
        true
      );

      return;
    }

    voiceEnabledRef.current =
      true;

    try {
      recognitionRef.current.start();

      setVoiceActive(true);
    } catch {
      console.log(
        "Voice recognition is already running."
      );
    }
  };

  const stopVoiceSOS = () => {
    voiceEnabledRef.current =
      false;

    if (
      recognitionRef.current
    ) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    setVoiceActive(false);
  };

  useEffect(() => {
    if (!crashDetection) {
      return undefined;
    }

    const handleMotion = (
      event
    ) => {
      const acceleration =
        event.accelerationIncludingGravity;

      if (!acceleration) {
        return;
      }

      const totalForce =
        Math.sqrt(
          (acceleration.x ||
            0) **
            2 +
            (acceleration.y ||
              0) **
              2 +
            (acceleration.z ||
              0) **
              2
        );

      setImpactValue(
        totalForce.toFixed(
          2
        )
      );

      if (
        totalForce > 35 &&
        !active
      ) {
        startSOS();
      }
    };

    window.addEventListener(
      "devicemotion",
      handleMotion
    );

    return () => {
      window.removeEventListener(
        "devicemotion",
        handleMotion
      );
    };
  }, [
    crashDetection,
    active,
  ]);

  const addContact = () => {
    if (
      !contactName.trim() ||
      !contactPhone.trim()
    ) {
      alert(
        "Enter the contact name and phone number."
      );

      return;
    }

    const cleanedPhone =
      cleanPhone(
        contactPhone
      );

    if (
      cleanedPhone.length < 12
    ) {
      alert(
        "Enter a valid 10-digit Indian phone number."
      );

      return;
    }

    const exists =
      allContacts.some(
        (contact) =>
          cleanPhone(
            contact.phone
          ) === cleanedPhone
      );

    if (exists) {
      alert(
        "This number is already added."
      );

      return;
    }

    const updated = [
      ...extraContacts,
      {
        name:
          contactName.trim(),
        phone: cleanedPhone,
      },
    ];

    setExtraContacts(
      updated
    );

    localStorage.setItem(
      "roadsos_extra_contacts",
      JSON.stringify(updated)
    );

    setContactName("");
    setContactPhone("");
  };

  const removeContact = (
    extraIndex
  ) => {
    const updated =
      extraContacts.filter(
        (_, index) =>
          index !== extraIndex
      );

    setExtraContacts(
      updated
    );

    localStorage.setItem(
      "roadsos_extra_contacts",
      JSON.stringify(updated)
    );
  };

  const copyMessage =
    async () => {
      try {
        await navigator.clipboard.writeText(
          getEmergencyMessage()
        );

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch {
        alert(
          "Unable to copy the emergency message."
        );
      }
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
            Voice SOS, crash detection, SMS,
            WhatsApp, location and medical
            profile sharing.
          </p>
        </div>

        {/* CURRENT LOCATION */}

        <div className="mt-8 bg-black/30 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-red-500 text-3xl" />

            <div>
              <p className="text-gray-400">
                Current Location
              </p>

              <h2 className="text-xl font-bold">
                {location
                  ? `${location.lat.toFixed(
                      5
                    )}, ${location.lng.toFixed(
                      5
                    )}`
                  : "Fetching live location..."}
              </h2>
            </div>
          </div>
        </div>

        {/* PRIMARY EMERGENCY CONTACT */}

        <div className="mt-8 bg-gradient-to-r from-red-500/10 to-orange-500/5 border border-red-500/30 rounded-3xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <FaPhoneAlt className="text-red-400 text-xl" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-red-400">
                    Primary Emergency Contact
                  </h2>

                  <p className="mt-1 text-gray-400">
                    The SOS alert and live
                    location will be sent to
                    this person first.
                  </p>
                </div>
              </div>
            </div>

            {primaryContact &&
              !isEditingPrimary && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-bold">
                  <FaCheckCircle />

                  Contact saved
                </span>
              )}
          </div>

          {!primaryContact ||
          isEditingPrimary ? (
            <div className="mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-bold text-gray-200">
                    Contact Name
                  </label>

                  <input
                    type="text"
                    value={
                      primaryName
                    }
                    onChange={(
                      event
                    ) =>
                      setPrimaryName(
                        event.target
                          .value
                      )
                    }
                    placeholder="Parent, guardian or trusted person"
                    className="w-full px-5 py-4 rounded-xl bg-black/50 border border-white/10 text-white outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-bold text-gray-200">
                    Phone Number
                  </label>

                  <div className="flex">
                    <div className="flex items-center justify-center px-5 rounded-l-xl bg-black/70 border border-r-0 border-white/10 font-bold">
                      +91
                    </div>

                    <input
                      type="tel"
                      value={
                        primaryPhone
                      }
                      maxLength="10"
                      onChange={(
                        event
                      ) =>
                        setPrimaryPhone(
                          event.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                      placeholder="Enter 10-digit number"
                      className="w-full px-5 py-4 rounded-r-xl bg-black/50 border border-white/10 text-white outline-none focus:border-red-400"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={
                    savePrimaryContact
                  }
                  className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 font-black"
                >
                  {primaryContact
                    ? "Update Primary Contact"
                    : "Save Primary Contact"}
                </button>

                {primaryContact && (
                  <button
                    type="button"
                    onClick={
                      cancelPrimaryEditing
                    }
                    className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-6 bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-400">
                  Primary contact
                </p>

                <h3 className="mt-1 text-2xl font-black">
                  {
                    primaryContact.name
                  }
                </h3>

                <p className="mt-1 text-lg text-gray-300">
                  +
                  {cleanPhone(
                    primaryContact.phone
                  )}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${cleanPhone(
                    primaryContact.phone
                  )}`}
                >
                  <button className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold flex items-center gap-2">
                    <FaPhoneAlt />

                    Call
                  </button>
                </a>

                <button
                  type="button"
                  onClick={
                    startEditingPrimary
                  }
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold flex items-center gap-2"
                >
                  <FaEdit />

                  Change
                </button>

                <button
                  type="button"
                  onClick={removePrimaryContact}
                  className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white font-bold flex items-center gap-2 transition"
                >
                  <FaTrash />

                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SOS BUTTON */}

        {active ? (
          <div className="mt-12 text-center">
            <div className="text-9xl font-black text-red-500 animate-pulse">
              {countdown}
            </div>

            <p className="mt-4 text-gray-400 text-xl">
              Emergency alert will open
              automatically...
            </p>

            <button
              type="button"
              onClick={cancelSOS}
              className="mt-8 px-10 py-4 bg-white text-black rounded-2xl text-xl font-black hover:bg-gray-200"
            >
              Cancel SOS
            </button>
          </div>
        ) : (
          <div className="text-center mt-12">
            <button
              type="button"
              onClick={startSOS}
              className="w-52 h-52 rounded-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-6xl font-black shadow-2xl shadow-red-600/40 animate-pulse"
            >
              SOS
            </button>
          </div>
        )}

        {/* VOICE AND CRASH DETECTION */}

        <div className="mt-10 grid md:grid-cols-2 gap-5">
          <div className="bg-black/30 border border-white/10 rounded-3xl p-6 text-center">
            {voiceActive ? (
              <button
                type="button"
                onClick={
                  stopVoiceSOS
                }
                className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 font-black text-xl flex items-center gap-3 mx-auto"
              >
                <FaMicrophone />

                Listening... Stop Voice SOS
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  startVoiceSOS
                }
                className="px-8 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-700 font-black text-xl flex items-center gap-3 mx-auto"
              >
                <FaMicrophone />

                Activate Voice SOS
              </button>
            )}

            <p className="mt-4 text-gray-400">
              Say{" "}
              <span className="text-cyan-400">
                help
              </span>
              ,{" "}
              <span className="text-cyan-400">
                sos
              </span>
              ,{" "}
              <span className="text-cyan-400">
                emergency
              </span>
              ,{" "}
              <span className="text-cyan-400">
                bachao
              </span>{" "}
              or{" "}
              <span className="text-cyan-400">
                madad
              </span>
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-3xl p-6 text-center">
            <button
              type="button"
              onClick={() =>
                setCrashDetection(
                  (previous) =>
                    !previous
                )
              }
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

        {/* ALERT LINKS */}

        {sendLinks.length >
          0 && (
          <div className="mt-10 bg-red-500/10 border border-red-500/30 rounded-3xl p-6">
            <h2 className="text-2xl font-black text-red-400 mb-4">
              Emergency Alert Links
            </h2>

            <div className="space-y-4">
              {sendLinks.map(
                (item, index) => (
                  <div
                    key={`${item.phone}-${index}`}
                    className="bg-black/40 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-bold text-xl">
                        {item.name}
                      </h3>

                      <p className="text-gray-400">
                        +
                        {
                          item.phone
                        }
                      </p>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      <a
                        href={
                          item.call
                        }
                      >
                        <button className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold flex items-center gap-2">
                          <FaPhoneAlt />

                          Call
                        </button>
                      </a>

                      <a
                        href={
                          item.sms
                        }
                      >
                        <button className="px-5 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black font-bold flex items-center gap-2">
                          <FaSms />

                          SMS
                        </button>
                      </a>

                      <a
                        href={
                          item.whatsapp
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        <button className="px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 font-bold flex items-center gap-2">
                          <FaWhatsapp />

                          WhatsApp
                        </button>
                      </a>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* ADDITIONAL CONTACTS */}

        <div className="mt-14 bg-black/30 border border-white/10 rounded-3xl p-6">
          <h2 className="text-3xl font-black text-cyan-400">
            Additional Emergency Contacts
          </h2>

          <p className="mt-2 text-gray-400">
            You can add more family members or
            trusted people.
          </p>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <input
              type="text"
              value={contactName}
              onChange={(event) =>
                setContactName(
                  event.target.value
                )
              }
              placeholder="Contact name"
              className="px-5 py-4 rounded-xl bg-black/50 border border-white/10 text-white outline-none focus:border-cyan-400"
            />

            <input
              type="tel"
              value={
                contactPhone
              }
              maxLength="10"
              onChange={(event) =>
                setContactPhone(
                  event.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
              placeholder="10-digit phone number"
              className="px-5 py-4 rounded-xl bg-black/50 border border-white/10 text-white outline-none focus:border-cyan-400"
            />

            <button
              type="button"
              onClick={addContact}
              className="px-5 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 font-bold flex items-center justify-center gap-2"
            >
              <FaPlus />

              Add Contact
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {allContacts.map(
              (contact, index) => {
                const phone =
                  cleanPhone(
                    contact.phone
                  );

                const message =
                  getEmergencyMessage();

                return (
                  <div
                    key={`${contact.type}-${phone}-${index}`}
                    className="bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-2xl font-bold">
                          {
                            contact.name
                          }
                        </h3>

                        {contact.type ===
                          "primary" && (
                          <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
                            Primary
                          </span>
                        )}
                      </div>

                      <p className="text-gray-400">
                        +{phone}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`tel:${phone}`}
                      >
                        <button className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold flex items-center gap-2">
                          <FaPhoneAlt />

                          Call
                        </button>
                      </a>

                      <a
                        href={`sms:${phone}?body=${encodeURIComponent(
                          message
                        )}`}
                      >
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

                      {contact.type ===
                        "primary" ? (
                        <button
                          type="button"
                          onClick={
                            startEditingPrimary
                          }
                          className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold flex items-center gap-2"
                        >
                          <FaEdit />

                          Change
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            removeContact(
                              contact.extraIndex
                            )
                          }
                          className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold flex items-center gap-2"
                        >
                          <FaTrash />

                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              }
            )}

            {allContacts.length ===
              0 && (
              <p className="text-center text-gray-400">
                No emergency contacts added.
              </p>
            )}
          </div>
        </div>

        {/* EMERGENCY MESSAGE */}

        <div className="mt-10 bg-black/30 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-3xl font-black text-violet-400">
              Emergency Message
            </h2>

            <button
              type="button"
              onClick={copyMessage}
              className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 font-bold flex items-center gap-2"
            >
              <FaCopy />

              {copied
                ? "Copied"
                : "Copy"}
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