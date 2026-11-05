import React, { useState, useEffect } from "react";
import api from "../config/api";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [focused, setFocused] = useState("");
  const [status, setStatus] = useState({ submitting: false, success: false, error: "" });

  const [contactInfo, setContactInfo] = useState({
    email: "misriya8784@gmail.com",
    phone: "+91 8714945730",
    location: "Kerala, India",
  });

  useEffect(() => {
    let isMounted = true;
    const fetchContactInfo = async () => {
      try {
        const res = await api.get("/api/profile");
        const profile = res.data?.data;
        if (isMounted && profile) {
          setContactInfo({
            email: profile.email || "misriya8784@gmail.com",
            phone: profile.phone || "+91 8714945730",
            location: profile.location || "Kerala, India",
          });
        }
      } catch (err) {
        console.error("Error fetching contact profile:", err);
      }
    };
    fetchContactInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ submitting: false, success: false, error: "Please fill in all required fields (Name, Email, Message)." });
      return;
    }

    setStatus({ submitting: true, success: false, error: "" });

    try {
      const res = await api.post("/api/contact", {
        name: name.trim(),
        email: email.trim(),
        service: service.trim(),
        message: message.trim(),
      });

      if (res.data?.success) {
        setStatus({
          submitting: false,
          success: true,
          error: "",
        });
        // Reset form ONLY on success
        setName("");
        setEmail("");
        setService("");
        setMessage("");

        setTimeout(() => {
          setStatus((prev) => ({ ...prev, success: false }));
        }, 5000);
      } else {
        throw new Error(res.data?.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setStatus({
        submitting: false,
        success: false,
        error: err.response?.data?.message || err.message || "Failed to send message. Please try again.",
      });
    }
  };

  const underline = (field) => ({
    width: focused === field ? "100%" : "0%",
  });

  const inputClass =
    "w-full bg-transparent border-b border-zinc-300 text-black placeholder-zinc-400 text-sm font-medium py-3 outline-none";

  const labelClass =
    "block text-[10px] tracking-[0.4em] uppercase font-bold text-zinc-500 mb-3";

  return (
    <section className="w-full bg-white px-5 sm:px-8 md:px-12 lg:px-16 py-20 md:py-28 font-sans overflow-hidden relative">

      {/* TOP BORDER */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-500 via-yellow-300 to-transparent" />

      <div className="max-w-[1440px] mx-auto relative z-10">

        {/* HEADER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 md:mb-24">

          <div className="lg:col-span-7">

            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-16 bg-yellow-500" />

              <span className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 font-bold">
                Contact 04 // 04
              </span>
            </div>

            <h1 className="text-[13vw] sm:text-[11vw] md:text-[9vw] lg:text-[80px] font-black text-black leading-[0.85] uppercase tracking-tighter">
              LETS
              <br />

              <span className="text-yellow-500">
                WORK
              </span>

              <br />

              <span className="text-black">
                TOGETHER
              </span>
            </h1>

          </div>

          <div className="lg:col-span-5 flex items-end">

            <div className="border-l-2 border-yellow-500 pl-6">

              <p className="text-zinc-600 text-sm sm:text-base md:text-lg font-medium leading-relaxed italic">
                Build something impactful together whether its your brand,
                your website, or your next big idea.
              </p>

              <div className="mt-6 flex items-center gap-3">

                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-ping" />

                <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
                  Available for projects
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* FORM + SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* FORM */}
          <div className="lg:col-span-8">

            <form
              onSubmit={handleSubmit}
              className="space-y-10"
            >

              {/* Status messages */}
              {status.success && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-semibold tracking-wide rounded-sm flex items-center gap-2">
                  <span>✓</span>
                  <span>Thank you! Your message has been saved in MongoDB and sent successfully.</span>
                </div>
              )}

              {status.error && (
                <div className="p-4 bg-red-50 border border-red-300 text-red-800 text-xs sm:text-sm font-semibold tracking-wide rounded-sm flex items-center gap-2">
                  <span>⚠</span>
                  <span>{status.error}</span>
                </div>
              )}

              {/* NAME + EMAIL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

                {/* NAME */}
                <div className="relative">

                  <label className={labelClass}>
                    Name *
                  </label>

                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused("")}
                    className={inputClass}
                  />

                  <div
                    className="absolute bottom-0 left-0 h-[1px] bg-yellow-500 transition-all duration-500"
                    style={underline("name")}
                  />

                </div>

                {/* EMAIL */}
                <div className="relative">

                  <label className={labelClass}>
                    Email *
                  </label>

                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                    className={inputClass}
                  />

                  <div
                    className="absolute bottom-0 left-0 h-[1px] bg-yellow-500 transition-all duration-500"
                    style={underline("email")}
                  />

                </div>

              </div>

              {/* SERVICE */}
              <div className="relative">

                <label className={labelClass}>
                  Service Needed
                </label>

                <input
                  type="text"
                  placeholder="e.g. Web Development, UI Design"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  onFocus={() => setFocused("service")}
                  onBlur={() => setFocused("")}
                  className={inputClass}
                />

                <div
                  className="absolute bottom-0 left-0 h-[1px] bg-yellow-500 transition-all duration-500"
                  style={underline("service")}
                />

              </div>

              {/* MESSAGE */}
              <div className="relative">

                <label className={labelClass}>
                  What Can I Help You With *
                </label>

                <textarea
                  placeholder="Hello I would like to enquire about..."
                  rows={5}
                  value={message}
                  required
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused("")}
                  className={inputClass + " resize-none"}
                />

                <div
                  className="absolute bottom-0 left-0 h-[1px] bg-yellow-500 transition-all duration-500"
                  style={underline("message")}
                />

              </div>

              {/* BUTTON */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2">

                <button
                  type="submit"
                  disabled={status.submitting}
                  className={`px-12 py-4 font-black uppercase text-xs tracking-[0.25em] transition-all duration-500 ${
                    status.submitting
                      ? "bg-zinc-300 text-zinc-600 cursor-not-allowed"
                      : "bg-yellow-500 text-black hover:bg-black hover:text-white"
                  }`}
                >
                  {status.submitting
                    ? "Sending..."
                    : status.success
                    ? "Message Sent"
                    : "Send Message"}
                </button>

                <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
                  Response within 24h
                </span>

              </div>

            </form>

          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 flex flex-col gap-10 lg:border-l lg:border-zinc-200 lg:pl-12">

            {/* EMAIL */}
            <div>

              <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold mb-3">
                Email
              </p>

              <a
                href={`mailto:${contactInfo.email}`}
                className="text-base sm:text-lg font-black text-zinc-800 hover:text-yellow-500 transition-colors break-all"
              >
                {contactInfo.email}
              </a>

            </div>

            {/* PHONE */}
            <div>

              <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold mb-3">
                Call Today
              </p>

              <a
                href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                className="text-base sm:text-lg font-black text-zinc-800 hover:text-yellow-500 transition-colors"
              >
                {contactInfo.phone}
              </a>

            </div>

            {/* LOCATION */}
            <div>

              <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold mb-3">
                Based In
              </p>

              <p className="text-base sm:text-lg font-black text-zinc-800">
                {contactInfo.location}
              </p>

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-20 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">

          <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold">
            2026 Nafeesathul Misriya. All Rights Reserved
          </span>

          <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold">
            MERN Stack Developer. {contactInfo.location}
          </span>

        </div>

      </div>

    </section>
  );
};

export default Contact;
