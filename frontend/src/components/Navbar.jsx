import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Skills", path: "/skills" },
  { name: "Projects", path: "/project" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // lock page scroll while the full-screen menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const origin = "calc(100% - 2.75rem) 2.75rem";

  return (
    <>
      {/* ================= FLOATING PIECES ================= */}
      <div className="fixed top-6 md:top-8 left-0 w-full z-[100] px-4 md:px-6 font-sans pointer-events-none">
        <div className="max-w-[1400px] mx-auto flex md:grid md:grid-cols-[1fr_auto_1fr] items-start justify-between gap-3">
          {/* LEFT: Name tag */}
          <Link
            to="/"
            className="pointer-events-auto group flex items-center gap-3 bg-white/80 backdrop-blur-xl pl-3 pr-5 h-12 md:h-14 rounded-2xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] justify-self-start"
          >
            <span className="w-1.5 h-7 md:h-8 bg-yellow-500 rounded-full transition-all duration-500 group-hover:h-4" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 leading-none">
                Nafeesathul Misriya
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-400 mt-1">
                Available for projects
              </span>
            </div>
          </Link>

          {/* CENTER: Desktop link pill */}
          <ul className="pointer-events-auto hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-xl p-2 rounded-full border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            {links.slice(0, 4).map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`relative block px-6 py-3 text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-300 hover:text-yellow-600 ${
                    isActive(link.path) ? "text-yellow-600" : "text-zinc-500"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute left-1/2 -translate-x-1/2 bottom-1 h-[3px] rounded-full bg-yellow-500 transition-all duration-500 ${
                      isActive(link.path) ? "w-6 opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* RIGHT: CTA (desktop) / Toggle (mobile) */}
          <div className="pointer-events-auto justify-self-end flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden md:flex group items-center gap-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] pl-8 pr-2 h-14 rounded-2xl hover:bg-yellow-500 hover:text-black transition-all duration-500 shadow-lg"
            >
              Let's Talk
              <span className="w-10 h-10 rounded-xl bg-white text-zinc-900 flex items-center justify-center text-base transition-transform duration-500 group-hover:rotate-45">
                →
              </span>
            </Link>

            {/* Mobile toggle: squared button with two offset lines */}
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen(!open)}
              className="md:hidden relative w-12 h-12 bg-zinc-900 rounded-2xl shadow-xl active:scale-90 transition-all"
            >
              <span
                className={`absolute left-3 h-0.5 bg-white rounded-full transition-all duration-500 ${
                  open ? "w-6 top-1/2 -translate-y-1/2 rotate-45" : "w-6 top-[17px]"
                }`}
              />
              <span
                className={`absolute right-3 h-0.5 bg-white rounded-full transition-all duration-500 ${
                  open ? "w-6 top-1/2 -translate-y-1/2 -rotate-45" : "w-3 top-[27px]"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE FULL-SCREEN REVEAL ================= */}
      <div
        className="md:hidden fixed inset-0 z-[90] bg-white font-sans transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{
          clipPath: open
            ? `circle(150% at ${origin})`
            : `circle(0% at ${origin})`,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div className="h-full flex flex-col justify-between px-8 pt-32 pb-10">
          <ul className="flex flex-col gap-5">
            {links.map((link, i) => (
              <li
                key={link.name}
                className="overflow-hidden"
              >
                <Link
                  to={link.path}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: open ? `${250 + i * 70}ms` : "0ms" }}
                  className={`flex items-baseline gap-4 transition-all duration-700 ${
                    open ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                >
                  <span className="text-[10px] font-black tracking-[0.3em] text-zinc-400">
                    0{i + 1}
                  </span>
                  <span
                    className={`text-4xl font-black uppercase tracking-tighter transition-all ${
                      isActive(link.path)
                        ? "text-yellow-600 translate-x-2"
                        : "text-zinc-900"
                    }`}
                  >
                    {link.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="pt-6 border-t border-zinc-100 flex justify-between items-center">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-400">
              © 2026 MISRIYA
            </span>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;