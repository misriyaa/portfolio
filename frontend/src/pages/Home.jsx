import React, { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../config/api";

const Home = () => {
  const [banner, setBanner] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchBanner = async () => {
      try {
        const res = await api.get("/api/admin/banner");
        const bannerUrl = res.data?.data?.banner || res.data?.banner || "";
        if (isMounted) {
          setBanner(bannerUrl);
        }
      } catch (err) {
        console.error("Error fetching banner:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBanner();

    return () => {
      isMounted = false;
    };
  }, []);

  const getImageSrc = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `${API_BASE_URL}/uploads/${imagePath}`;
  };

  return (
    <div className="w-full h-[100svh] bg-white text-[#1a1a1a] selection:bg-yellow-100 overflow-hidden font-sans">

      {/* ───────────────── HERO (fits one screen) ───────────────── */}
      <section className="h-full flex flex-col justify-center items-center px-5 sm:px-8 md:px-12 lg:px-16 pt-24 md:pt-28 pb-8 relative">

        {/* Top label */}
        <div className="w-full max-w-[1400px] absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 px-5 sm:px-8 md:px-10">
          <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.4em] font-bold text-gray-400 uppercase">
            Portfolio 2026
          </p>
        </div>

        {/* Hero content */}
        <div className="w-full max-w-[1400px] flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6 lg:gap-8">

          {/* LEFT: Name + Heading */}
          <div className="w-full md:w-3/5 text-left z-10">
            <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.2em] font-bold text-yellow-600 uppercase border-b-2 border-yellow-500 pb-1 inline-block mb-3 md:mb-5">
              Nafeesathul Misriya
            </p>

            <h1 className="text-[min(13vw,9svh)] md:text-[min(9vw,15svh)] font-black leading-[0.85] tracking-tighter uppercase text-[#1a1a1a]">
              Web<br />
              <span className="text-yellow-500">Developer</span>
            </h1>

            <p className="mt-3 md:mt-5 text-gray-500 text-xs sm:text-sm md:text-base lg:text-lg max-w-xs sm:max-w-sm md:max-w-md font-medium tracking-tight leading-relaxed">
              Specializing in the MERN Stack &amp; High-Performance Web Architecture.
              Based in India. Available for worldwide collaboration.
            </p>
          </div>

          {/* RIGHT: Portrait */}
          <div className="w-full md:w-2/5 flex justify-center md:justify-end relative">
            <div className="hidden md:block absolute left-[-20px] top-0 h-full w-[1px] bg-gray-200" />

            <div className="relative group">
              {/* height drives the size, width follows the aspect ratio */}
              <div className="h-[34svh] md:h-[58svh] aspect-[4/5] bg-gray-50 overflow-hidden rounded-sm shadow-[16px_16px_0px_0px_rgba(234,179,8,0.15)] border border-gray-100">
                {banner ? (
                  <img
                    src={getImageSrc(banner)}
                    alt="Nafeesathul Misriya"
                    className="w-full h-full object-cover object-top grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-sm">
                    {loading ? "Loading visual..." : "Visual coming soon"}
                  </div>
                )}
              </div>

              {/* Status badge */}
              <div className="absolute -bottom-3 -right-2 sm:-right-4 bg-black text-white text-[8px] sm:text-[9px] md:text-[10px] px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 uppercase tracking-[0.2em] sm:tracking-[0.25em] shadow-xl">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-ping" />
                Open To Work
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
