import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { API_BASE_URL } from "../config/api";
import { ChevronRight, ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";

const Home = () => {
  const [banner, setBanner] = useState("");
  const [profile, setProfile] = useState({
    email: "misriya8784@gmail.com",
    phone: "+91 8714945730",
    location: "Kerala, India",
  });
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAllHomeData = async () => {
      try {
        const [profileRes, skillsRes, projectsRes] = await Promise.allSettled([
          api.get("/api/profile"),
          api.get("/api/admin/skills"),
          api.get("/api/admin/projects"),
        ]);

        if (isMounted) {
          // Banner & Profile
          if (profileRes.status === "fulfilled" && profileRes.value.data?.data) {
            const data = profileRes.value.data.data;
            if (data.banner) setBanner(data.banner);
            setProfile({
              email: data.email || "misriya8784@gmail.com",
              phone: data.phone || "+91 8714945730",
              location: data.location || "Kerala, India",
            });
          }

          // Skills
          if (skillsRes.status === "fulfilled") {
            const rawSkills = Array.isArray(skillsRes.value.data?.data)
              ? skillsRes.value.data.data
              : Array.isArray(skillsRes.value.data)
              ? skillsRes.value.data
              : [];
            setSkills(rawSkills);
          }

          // Projects
          if (projectsRes.status === "fulfilled") {
            const rawProjects = Array.isArray(projectsRes.value.data?.data)
              ? projectsRes.value.data.data
              : Array.isArray(projectsRes.value.data)
              ? projectsRes.value.data
              : [];
            setProjects(rawProjects);
          }
        }
      } catch (err) {
        console.error("Error loading home previews:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllHomeData();

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
    <div className="w-full bg-white text-[#1a1a1a] selection:bg-yellow-100 font-sans">

      {/* ========================================================
          1. HERO / BANNER SECTION
      ======================================================== */}
      <section className="min-h-[92svh] flex flex-col justify-center items-center px-5 sm:px-8 md:px-12 lg:px-16 pt-28 md:pt-36 pb-16 relative border-b border-gray-100">
        
        {/* Top watermark label */}
        <div className="w-full max-w-[1400px] absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 px-5 sm:px-8 md:px-10">
          <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.4em] font-bold text-gray-400 uppercase">
            Portfolio 2026
          </p>
        </div>

        {/* Hero content */}
        <div className="w-full max-w-[1400px] flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">

          {/* LEFT: Name + Heading */}
          <div className="w-full md:w-3/5 text-left z-10">
            <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.2em] font-bold text-yellow-600 uppercase border-b-2 border-yellow-500 pb-1 inline-block mb-3 md:mb-5">
              Nafeesathul Misriya
            </p>

            <h1 className="text-[min(13vw,9svh)] md:text-[min(9vw,15svh)] font-black leading-[0.85] tracking-tighter uppercase text-[#1a1a1a]">
              Web<br />
              <span className="text-yellow-500">Developer</span>
            </h1>

            <p className="mt-4 md:mt-6 text-gray-500 text-xs sm:text-sm md:text-base lg:text-lg max-w-xs sm:max-w-sm md:max-w-md font-medium tracking-tight leading-relaxed">
              Specializing in the MERN Stack &amp; High-Performance Web Architecture.
              Based in India. Available for worldwide collaboration.
            </p>

            {/* Quick jump CTA buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/projects"
                className="bg-[#1a1a1a] text-white text-[11px] uppercase tracking-[0.2em] px-7 py-4 hover:bg-yellow-500 hover:text-black transition-all duration-300 font-bold shadow-sm"
              >
                View Selected Works
              </Link>
              <Link
                to="/contact"
                className="border border-gray-300 text-[#1a1a1a] text-[11px] uppercase tracking-[0.2em] px-7 py-4 hover:border-black hover:bg-gray-50 transition-all duration-300 font-bold"
              >
                Get In Touch
              </Link>
            </div>
          </div>

          {/* RIGHT: Portrait */}
          <div className="w-full md:w-2/5 flex justify-center md:justify-end relative">
            <div className="hidden md:block absolute left-[-20px] top-0 h-full w-[1px] bg-gray-200" />

            <div className="relative group">
              <div className="h-[34svh] md:h-[56svh] aspect-[4/5] bg-gray-50 overflow-hidden rounded-sm shadow-[16px_16px_0px_0px_rgba(234,179,8,0.15)] border border-gray-100">
                {banner ? (
                  <img
                    src={getImageSrc(banner)}
                    alt="Nafeesathul Misriya"
                    className="w-full h-full object-cover object-top grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-sm">
                    {loading ? "Loading visual..." : "Portrait"}
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


      {/* ========================================================
          2. ABOUT SECTION PREVIEW
      ======================================================== */}
      <section className="w-full py-20 md:py-28 px-5 sm:px-8 md:px-12 lg:px-16 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-16 bg-yellow-500" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-zinc-900 font-bold">
              About 01 // 04
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left: About Text preview */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-zinc-900 uppercase tracking-tighter leading-none">
                  ABOUT <span style={{ WebkitTextStroke: "1.5px #eab308", color: "transparent" }}>ME</span>
                </h2>
                <p className="text-yellow-600 text-xs font-bold tracking-[0.25em] uppercase mt-2">
                  Nafeesathul Misriya • MERN Stack Developer
                </p>
              </div>

              <p className="text-lg sm:text-xl font-serif italic text-zinc-900 border-l-2 border-yellow-500 pl-4 py-1">
                "I'm a digital designer and developer crafting user-centered experiences with performance and precision."
              </p>

              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                Specializing in end-to-end full stack web architecture, I bridge the gap between creative UI design 
                and high-performance backend systems. Focusing on interactive systems, clean API design, and scalable databases.
              </p>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 bg-zinc-900 text-white hover:bg-yellow-500 hover:text-black px-7 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-md group"
                >
                  <span>View More About Me</span>
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </div>
            </div>

            {/* Right: Portrait Preview Thumbnail */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative max-w-[280px] sm:max-w-[320px] w-full">
                <div className="absolute -right-3 -bottom-3 w-full h-full bg-yellow-500 rounded-sm -z-10" />
                <div className="aspect-[4/5] bg-gray-50 overflow-hidden rounded-sm border border-gray-100 shadow-lg">
                  {banner ? (
                    <img
                      src={getImageSrc(banner)}
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
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================
          3. SKILLS SECTION PREVIEW
      ======================================================== */}
      <section className="w-full py-20 md:py-28 px-5 sm:px-8 md:px-12 lg:px-16 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[2px] w-16 bg-yellow-500" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-zinc-900 font-bold">
                  Skills 02 // 04
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-zinc-900 uppercase tracking-tighter leading-none">
                WHAT I CAN <br />
                <span style={{ WebkitTextStroke: "1.5px #eab308", color: "transparent" }}>DO FOR YOU</span>
              </h2>
            </div>

            <div className="max-w-sm">
              <p className="text-zinc-500 text-sm font-medium leading-relaxed border-l-2 border-yellow-500 pl-4">
                Core technologies and architectures I utilize to engineer seamless digital products.
              </p>
            </div>
          </div>

          {/* Skills Grid Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {(skills.length > 0 ? skills.slice(0, 4) : [
              { title: "Frontend", skills: ["React.js", "JavaScript (ES6+)", "Tailwind CSS", "Redux"] },
              { title: "Backend", skills: ["Node.js", "Express.js", "REST APIs", "JWT Auth"] },
              { title: "Database", skills: ["MongoDB", "Mongoose", "SQL", "Atlas"] },
              { title: "Tools & Cloud", skills: ["Git & GitHub", "Cloudinary", "Postman", "Vercel"] },
            ]).map((category, index) => (
              <div
                key={category._id || index}
                className="p-6 bg-gray-50/70 border border-gray-100 rounded-sm hover:border-yellow-400 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-black text-yellow-600 font-mono">0{index + 1}</span>
                  <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 group-hover:text-yellow-600 transition-colors">
                    {category.title}
                  </h3>
                </div>

                <ul className="space-y-2.5">
                  {(category.skills || []).slice(0, 4).map((skill, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-2.5 text-zinc-700 text-xs sm:text-sm font-bold uppercase tracking-tight">
                      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                      <span>{skill}</span>
                    </li>
                  ))}
                  {(category.skills || []).length > 4 && (
                    <li className="text-[11px] text-zinc-400 font-medium italic pt-1">
                      +{(category.skills || []).length - 4} more skills...
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          {/* View All Skills Button */}
          <div className="flex justify-center sm:justify-start">
            <Link
              to="/skills"
              className="inline-flex items-center gap-3 bg-zinc-900 text-white hover:bg-yellow-500 hover:text-black px-7 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-md group"
            >
              <span>View All Skills &amp; Services</span>
              <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

        </div>
      </section>


      {/* ========================================================
          4. PROJECTS SECTION PREVIEW
      ======================================================== */}
      <section className="w-full py-20 md:py-28 px-5 sm:px-8 md:px-12 lg:px-16 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[2px] w-16 bg-yellow-500" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-yellow-600 font-bold">
                  Selected Works 03 // 04
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-zinc-900 uppercase tracking-tighter leading-none">
                FEATURED <br />
                <span className="text-gray-300 italic font-light lowercase tracking-normal">projects</span>
              </h2>
            </div>

            <div className="max-w-sm">
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Real-world web applications built with full database persistence, Cloudinary asset pipelines, and responsive UX.
              </p>
            </div>
          </div>

          {/* Projects Grid Preview (Top 3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {(projects.length > 0 ? projects.slice(0, 3) : []).map((project) => (
              <div
                key={project._id}
                className="group border border-gray-100 p-4 rounded-sm hover:border-yellow-300 hover:shadow-lg transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="overflow-hidden bg-gray-50 aspect-[16/9] flex items-center justify-center border border-gray-100 mb-5">
                    <img
                      src={getImageSrc(project.image)}
                      alt={project.title}
                      className="w-full h-full object-contain group-hover:scale-[1.03] transition-all duration-700"
                    />
                  </div>

                  <div className="w-8 h-[2px] bg-yellow-500 mb-3 group-hover:w-16 transition-all duration-500" />
                  <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-2 leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-zinc-500 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-6 font-medium">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1a1a1a] text-white text-[10px] uppercase tracking-[0.2em] px-4 py-2.5 hover:bg-yellow-500 hover:text-black font-bold transition-all"
                    >
                      Live Demo ↗
                    </a>
                  )}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-gray-300 text-zinc-800 text-[10px] uppercase tracking-[0.2em] px-4 py-2.5 hover:border-black font-bold transition-all"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* View All Projects Button */}
          <div className="flex justify-center sm:justify-start">
            <Link
              to="/projects"
              className="inline-flex items-center gap-3 bg-zinc-900 text-white hover:bg-yellow-500 hover:text-black px-7 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-md group"
            >
              <span>View All Projects</span>
              <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

        </div>
      </section>


      {/* ========================================================
          5. CONTACT SECTION PREVIEW
      ======================================================== */}
      <section className="w-full py-20 md:py-28 px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-[1400px] mx-auto">

          {/* Section Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-16 bg-yellow-500" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-zinc-900 font-bold">
              Contact 04 // 04
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

            {/* Left: Heading and message */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none">
                LETS <span className="text-yellow-500">WORK</span> TOGETHER
              </h2>

              <p className="text-zinc-600 text-sm sm:text-base md:text-lg leading-relaxed italic border-l-2 border-yellow-500 pl-4">
                Have a project in mind, an opportunity, or looking for a skilled MERN Stack developer?
                I am open to new collaborations and projects worldwide.
              </p>

              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-ping" />
                <span className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-bold">
                  Available for new projects
                </span>
              </div>

              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 bg-yellow-500 text-black hover:bg-black hover:text-white px-8 py-4 text-xs font-black uppercase tracking-[0.25em] transition-all duration-300 shadow-md group"
                >
                  <span>Contact Me / Send Message</span>
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </div>
            </div>

            {/* Right: Contact Information Highlights */}
            <div className="lg:col-span-5 bg-gray-50/70 p-8 rounded-sm border border-gray-100 space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white border border-gray-200 rounded-md text-yellow-600">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400">Direct Email</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-base font-black text-zinc-800 hover:text-yellow-600 transition-colors break-all"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white border border-gray-200 rounded-md text-yellow-600">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400">Call / Phone</p>
                  <a
                    href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                    className="text-base font-black text-zinc-800 hover:text-yellow-600 transition-colors"
                  >
                    {profile.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white border border-gray-200 rounded-md text-yellow-600">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400">Location</p>
                  <p className="text-base font-black text-zinc-800">
                    {profile.location}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
