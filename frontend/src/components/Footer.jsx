import React, { useEffect, useState } from 'react';
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import api from "../config/api";

const Footer = () => {
  const [profile, setProfile] = useState({
    email: "misriya8784@gmail.com",
    phone: "+91 8714945730",
    location: "India",
    socialLinks: {
      github: "https://github.com/misriyaa",
      linkedin: "https://www.linkedin.com/in/nafeesathul-misriya-p/",
      instagram: "#",
    },
  });

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/profile");
        const data = res.data?.data;
        if (isMounted && data) {
          setProfile((prev) => ({
            email: data.email || prev.email,
            phone: data.phone || prev.phone,
            location: data.location || prev.location,
            socialLinks: {
              ...prev.socialLinks,
              ...(data.socialLinks || {}),
            },
          }));
        }
      } catch (err) {
        console.error("Error fetching footer profile:", err);
      }
    };
    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    // bg-[#fefce8] is Tailwind's default light yellow/cream background
    <footer className="w-full bg-yellow-500 text-zinc-900 px-6 md:px-12 py-24 font-sans overflow-hidden border-t border-yellow-200">
      <div className="max-w-[1440px] mx-auto">
        
        {/* --- SECTION 1: BIG HERO NAME (Background Texture) --- */}
        <div className="mb-24 md:mb-32">
          <h1 
            className="text-[15vw] md:text-[140px] font-black leading-[0.8] uppercase tracking-tighter pointer-events-none opacity-40"
            style={{ 
              WebkitTextStroke: '1px #000000', // soft yellow stroke (yellow-300)
              color: 'transparent' 
            }}
          >
            NAFEESATHUL<br />MISRIYA
          </h1>
        </div>

        {/* --- SECTION 2: CONTACT & SOCIAL INFO --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 items-end mb-20 pb-10 border-b border-yellow-200">
          
          {/* Email */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-[1.5px] w-8 bg-yellow-500"></div>
              <span className="text-[11px] tracking-[0.4em] uppercase text-zinc-900 font-black">
                Email
              </span>
            </div>
            <a 
              href={`mailto:${profile.email}`} 
              className="text-xl md:text-2xl font-black text-zinc-900 hover:text-yellow-100 transition-colors break-all"
            >
              {profile.email}
            </a>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-[1.5px] w-8 bg-yellow-500"></div>
              <span className="text-[11px] tracking-[0.4em] uppercase text-zinc-900 font-black">
                Call Today
              </span>
            </div>
            <a 
              href={`tel:${profile.phone.replace(/\s+/g, "")}`} 
              className="text-xl md:text-2xl font-black text-zinc-900 hover:text-yellow-100 transition-colors"
            >
              {profile.phone}
            </a>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-4 md:items-end">
            <div className="flex items-center gap-2">
              <div className="h-[1.5px] w-8 bg-yellow-500 hidden md:block"></div>
              <span className="text-[11px] tracking-[0.4em] uppercase text-zinc-900 font-black">
                Social
              </span>
            </div>
            <div className="flex items-center gap-4">
              {[
                { icon: <FaGithub size={20} />, link: profile.socialLinks?.github || "https://github.com/misriyaa" },
                { icon: <FaInstagram size={20} />, link: profile.socialLinks?.instagram || "#" },
                { icon: <FaLinkedin size={20} />, link: profile.socialLinks?.linkedin || "https://www.linkedin.com/in/nafeesathul-misriya-p/" }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.link} 
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 rounded-full border border-yellow-200 bg-white/60 flex items-center justify-center hover:bg-yellow-500 hover:border-yellow-500 hover:text-black transition-all duration-500 shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* --- SECTION 3: BOTTOM COPYRIGHT & BRANDING --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
          
          {/* Copyright & Timestamp */}
          <div className="text-center md:text-left">
            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold leading-relaxed mb-1">
              © Copyright 2026. All Rights Reserved.
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-medium">
              Nafeesathul Misriya P • Based in {profile.location}
            </p>
          </div>

          {/* SIGNATURE BADGE (Yellow Highlighted Version) */}
          <div className="flex items-center gap-3 bg-white/90 px-5 py-3 rounded-full border border-yellow-100 group hover:border-yellow-500/50 transition-colors shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-[11px] font-black text-black">
              NM
            </div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-black text-zinc-700 transition-colors group-hover:text-zinc-900">
              Designed & Built by Nafeesathul Misriya
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
