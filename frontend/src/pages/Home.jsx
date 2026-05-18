import React, { useEffect, useState } from "react";
import axios from "axios";
import About from "./About";
import Contact from "./Contact";
import Project from "./Project";
import Skills from "./Skills";

const Home = () => {
  const [banner, setBanner] = useState("");

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/banner");
        setBanner(res.data.data?.banner);
      } catch (err) {
        console.error("Error fetching banner", err);
      }
    };
    fetchBanner();
  }, []);

  return (
    <div className="w-full bg-white text-[#1a1a1a] selection:bg-yellow-100 overflow-x-hidden font-sans">

      {/* ───────────────── HERO ───────────────── */}
      {/* pt-28 on mobile clears the fixed navbar (top-8 + nav height ~56px) */}
      <section className="min-h-screen flex flex-col justify-center items-center px-5 sm:px-8 md:px-12 lg:px-16 pt-28 sm:pt-32 md:pt-20 pb-10 relative">

        {/* Top label */}
        <div className="w-full max-w-[1400px] absolute top-6 sm:top-8 md:top-10 left-1/2 -translate-x-1/2 px-5 sm:px-8 md:px-10">
          <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.4em] font-bold text-gray-400 uppercase">
            Portfolio 2026
          </p>
        </div>

        {/* Hero content */}
        <div className="w-full max-w-[1400px] flex flex-col md:flex-row items-center justify-between gap-10 sm:gap-12 md:gap-6 lg:gap-8">

          {/* LEFT: Name + Heading */}
          <div className="w-full md:w-3/5 text-left z-10">
            <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.2em] font-bold text-yellow-600 uppercase border-b-2 border-yellow-500 pb-1 inline-block mb-4 sm:mb-6">
              Nafeesathul Misriya
            </p>

            <h1 className="text-[13vw] sm:text-[11vw] md:text-[9vw] lg:text-[8vw] xl:text-[7vw] font-black leading-[0.85] tracking-tighter uppercase text-[#1a1a1a]">
              Software<br />
              <span className="text-yellow-500">Developer</span>
            </h1>

            <p className="mt-5 sm:mt-6 text-gray-500 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-sm md:max-w-md font-medium tracking-tight leading-relaxed">
              Specializing in the MERN Stack &amp; High-Performance Web Architecture.
              Based in India. Available for worldwide collaboration.
            </p>
          </div>

          {/* RIGHT: Portrait */}
          <div className="w-full md:w-2/5 flex justify-center md:justify-end relative">
            <div className="hidden md:block absolute left-[-20px] top-0 h-full w-[1px] bg-gray-200" />

            <div className="relative group">
              <div className="w-[72vw] h-[90vw] sm:w-[56vw] sm:h-[72vw] md:w-[28vw] md:h-[38vw] bg-gray-50 overflow-hidden rounded-sm shadow-[16px_16px_0px_0px_rgba(234,179,8,0.15)] border border-gray-100">
                {banner ? (
                  <img
                    src={`http://localhost:5000/uploads/${banner}`}
                    alt="Nafeesathul Misriya"
                    className="w-full h-full object-cover object-top grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-sm">
                    Loading visual...
                  </div>
                )}
              </div>

              {/* Status badge */}
              <div className="absolute -bottom-4 -right-2 sm:-right-4 bg-black text-white text-[8px] sm:text-[9px] md:text-[10px] px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 uppercase tracking-[0.2em] sm:tracking-[0.25em] shadow-xl">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-ping" />
                Open To Work
              </div>
            </div>
          </div>
        </div>

        {/* Scroll prompt */}
        <div className="absolute bottom-8 left-8 md:left-10 hidden md:flex flex-col items-start gap-4">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 [writing-mode:vertical-lr]">Scroll</p>
          <div className="w-[1px] h-16 bg-gradient-to-b from-yellow-500 to-transparent" />
        </div>
      </section>

      {/* ───────────────── SECTIONS ───────────────── */}
      <main className="relative z-20">

        <section className="bg-white border-t border-gray-100">
          <About />
        </section>

        <section className="bg-[#fafafa] border-t border-gray-100">
          <Skills />
        </section>

        <section className="bg-white border-t border-gray-100">
          <Project />
        </section>

        <section className="bg-white border-t border-gray-100">
          <Contact />
        </section>

      </main>
    </div>
  );
};

export default Home;