import React, { useEffect, useState } from "react";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import axios from "axios";
import ScrollVelocity from "../components/scrolltext/ScrollVelocity";

const About = () => {
  const [banner, setBanner] = useState("");

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/banner");
        setBanner(res.data?.data?.banner || "");
      } catch (error) {
        console.error(error);
      }
    };
    fetchBanner();
  }, []);

  return (
    <section className="w-full bg-white overflow-hidden">

      {/* MOBILE SCROLL TEXT */}
      <div className="block md:hidden pt-10 pb-4">
        <ScrollVelocity
          texts={["MERN STACK", "DEVELOPER"]}
          velocity={25}
          className="text-zinc-900 font-bold"
          numCopies={3}
        />
      </div>

      {/* MAIN GRID */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-10 sm:py-14 md:py-16 lg:py-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 lg:gap-16 items-center">

        {/* LEFT: IMAGE */}
        <div className="md:col-span-5 flex justify-center md:justify-start relative">
          <div className="absolute -right-2 sm:-right-3 -bottom-2 sm:-bottom-3 w-full h-full bg-yellow-500 rounded-sm -z-10" />
          <div className="w-full max-w-[280px] sm:max-w-[360px] md:max-w-full aspect-[4/5] bg-white overflow-hidden rounded-sm shadow-xl border border-gray-100">
            {banner ? (
              <img
                src={`http://localhost:5000/uploads/${banner}`}
                alt="Nafeesathul Misriya"
                className="w-full h-full object-cover grayscale-[10%]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                Portrait
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: CONTENT */}
        <div className="md:col-span-7 text-left">

          {/* Label */}
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="h-[2px] w-10 sm:w-16 bg-yellow-500" />
            <span className="text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.35em] sm:tracking-[0.4em] uppercase text-zinc-900 font-bold">
              About 01 // 04
            </span>
          </div>

          {/* Heading */}
          <div className="relative mb-6 sm:mb-8">
            <h1 className="text-[17vw] sm:text-[13vw] md:text-[10vw] lg:text-[100px] font-black text-zinc-900 leading-[0.82] uppercase tracking-tighter">
              ABOUT
            </h1>
            <h1
              className="text-[17vw] sm:text-[13vw] md:text-[10vw] lg:text-[100px] font-black leading-[0.82] uppercase tracking-tighter ml-4 sm:ml-6"
              style={{ WebkitTextStroke: "1.5px #eab308", color: "transparent" }}
            >
              ME
            </h1>
          </div>

          {/* Name */}
          <h2 className="text-yellow-600 text-[10px] sm:text-xs font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-6 sm:mb-8">
            Nafeesathul Misriya
          </h2>

          {/* Bio */}
          <div className="space-y-4 sm:space-y-5 text-zinc-500 max-w-full sm:max-w-[540px] md:max-w-[600px] leading-relaxed">
            <p className="text-lg sm:text-xl md:text-2xl italic font-serif text-zinc-900">
              "I'm a digital designer and developer crafting user-centered experiences."
            </p>
            <p className="text-sm md:text-base">
              Focusing on interactive systems, I bring ideas to life through design and responsive layouts.
            </p>
          </div>

          {/* Socials */}
          <div className="mt-8 sm:mt-10 md:mt-12 flex flex-wrap items-center gap-6 sm:gap-8">
            <div className="flex gap-5 sm:gap-6 text-zinc-900">
              <a href="#" className="transition-colors hover:text-yellow-500" aria-label="GitHub">
                <FaGithub size={20} />
              </a>
              <a href="#" className="transition-colors hover:text-yellow-500" aria-label="LinkedIn">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="transition-colors hover:text-yellow-500" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* DESKTOP SCROLL TEXT */}
      <div className="hidden md:block mt-16 lg:mt-24 pb-4">
        <ScrollVelocity
          texts={["MERN STACK", "DEVELOPER"]}
          velocity={35}
          className="text-yellow-500 font-bold"
          numCopies={4}
        />
      </div>

    </section>
  );
};

export default About;