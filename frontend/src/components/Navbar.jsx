import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpeg";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed top-8 left-0 w-full flex flex-col items-center z-[100] px-6 font-sans">
      
      {/* MAIN NAV BAR */}
      <div className="flex items-center justify-between w-full max-w-[1400px] bg-white/80 backdrop-blur-xl px-4 py-3 md:px-8 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100">
        
        {/* LEFT: Branding / Available Status */}
        <div className="flex items-center gap-4">
          <Link to="/" className="relative group">
            <img
              src={logo}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm transition-transform group-hover:scale-110"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full animate-pulse"></span>
          </Link>
          
          <div className="hidden md:flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 leading-none">
              Nafeesathul Misriya
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-400 mt-1">
              Available for projects
            </span>
          </div>
        </div>

        {/* CENTER: Desktop Links */}
        <ul className="hidden md:flex items-center gap-10">
          {[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
            { name: "Skills", path: "/skills" },
            { name: "Projects", path: "/project" },
          ].map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-300 hover:text-yellow-600 ${
                  isActive(link.path) ? "text-yellow-600" : "text-zinc-500"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT: Action Button / Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="hidden md:block bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-500 shadow-lg"
          >
            Let's Talk —
          </Link>

          {/* Mobile Menu Button - Minimal Dark Style */}
          <button
            className="md:hidden w-12 h-12 bg-zinc-900 rounded-full flex flex-col items-center justify-center gap-1.5 shadow-xl active:scale-90 transition-all"
            onClick={() => setOpen(!open)}
          >
            <span className={`h-0.5 w-5 bg-white rounded-full transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`h-0.5 w-5 bg-white rounded-full transition-all duration-300 ${open ? "opacity-0" : ""}`}></span>
            <span className={`h-0.5 w-5 bg-white rounded-full transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN - Clean & Full Width */}
      <div
        className={`
        overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22, 1, 0.36, 1)] w-full max-w-[400px]
        ${open ? "max-h-[400px] opacity-100 mt-4" : "max-h-0 opacity-0"}
      `}
      >
        <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-zinc-100 p-8">
          <ul className="flex flex-col gap-6 text-left">
            {[
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
              { name: "Skills", path: "/skills" },
              { name: "Projects", path: "/project" },
              { name: "Contact", path: "/contact" },
            ].map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`text-2xl font-black uppercase tracking-tighter transition-all ${
                    isActive(link.path) ? "text-yellow-600 translate-x-2" : "text-zinc-900"
                  } block`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-10 pt-6 border-t border-zinc-100 flex justify-between items-center">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-400">© 2026 MISRIYA</span>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;