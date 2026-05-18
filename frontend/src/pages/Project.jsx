import React, { useEffect, useState } from "react";
import axios from "axios";
import ScrollStack, {
  ScrollStackItem,
} from "../components/ScrollStack/ScrollStack";

const Project = ({ isHomePage = false }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKED_URL}/api/admin/projects`
        );
        setProjects(res.data.data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="bg-white font-sans">

      {/* HEADER */}
      {!isHomePage && (
        <section className="pt-20 pb-10 px-5 sm:px-8 md:px-12 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1.5px] w-12 bg-yellow-500" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold">
              Works 03 // 04
            </span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[13vw] sm:text-[10vw] md:text-7xl lg:text-8xl font-black text-zinc-900 leading-[0.88] uppercase tracking-tighter">
              FEATURED
            </h1>
            <h1 className="text-[13vw] sm:text-[10vw] md:text-7xl lg:text-8xl font-black text-zinc-900 leading-[0.88] uppercase tracking-tighter ml-6 md:ml-12"
              style={{ WebkitTextStroke: "1.5px #18181b", color: "transparent" }}
            >
              PROJECTS
            </h1>
          </div>
        </section>
      )}

      {/* PROJECT STACK */}
      <div className="px-4 sm:px-6 md:px-10 pb-24">
        <div className="max-w-[1440px] mx-auto">
          <ScrollStack>
            {projects.length === 0 ? (
              <div className="h-[60vh] flex items-center justify-center border border-zinc-100 rounded-sm">
                <p className="uppercase tracking-[0.3em] text-[10px] font-bold text-zinc-300">
                  Initializing Portfolio...
                </p>
              </div>
            ) : (
              projects.map((project, index) => (
                <ScrollStackItem key={project._id}>
                  <div className="relative w-full overflow-hidden rounded-sm shadow-2xl group"
                    style={{ height: "85vh", minHeight: "500px" }}
                  >
                    {/* IMAGE */}
                    {project.image ? (
                      <img
                        src={`${import.meta.env.VITE_BACKED_URL}/uploads/${project.image}`}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-zinc-900" />
                    )}

                    {/* STRONG OVERLAY - ensures text is always readable */}
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />

                    {/* TOP RIGHT: Index number */}
                    <div className="absolute top-6 right-6 sm:top-10 sm:right-10 z-10">
                      <span className="text-white/20 font-black text-[60px] sm:text-[80px] leading-none tracking-tighter select-none">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-10 md:p-14">

                      {/* TOP: Category */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="w-6 h-[1.5px] bg-yellow-500" />
                        <span className="text-yellow-400 text-[9px] sm:text-[10px] font-black tracking-[0.4em] uppercase">
                          {project.category || "Development"}
                        </span>
                      </div>

                      {/* BOTTOM: Title + Description + Buttons */}
                      <div>
                        <h2 className="text-[11vw] sm:text-[8vw] md:text-[6vw] lg:text-[70px] font-black uppercase leading-[0.85] tracking-tighter text-white mb-4 sm:mb-6 drop-shadow-2xl">
                          {project.title}
                        </h2>

                        {project.description && (
                          <p className="text-xs sm:text-sm md:text-base text-zinc-300 max-w-xs sm:max-w-md md:max-w-xl font-medium leading-relaxed mb-6 sm:mb-8">
                            {project.description}
                          </p>
                        )}

                        {/* BUTTONS */}
                        <div className="flex flex-wrap gap-3 sm:gap-4">
                          {project.liveLink && (
                            
                              href={project.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 sm:px-8 py-3 sm:py-4 bg-yellow-500 text-black text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all duration-300"
                            >
                              Live Demo
                              <span className="text-sm">→</span>
                            </a>
                          )}
                          {project.githubLink && (
                            
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 sm:px-8 py-3 sm:py-4 border border-white/30 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
                            >
                              GitHub Code
                            </a>
                          )}
                        </div>

                        {/* Bottom line */}
                        <div className="mt-8 sm:mt-10 flex items-center gap-4">
                          <div className="h-[1px] w-8 bg-white/20" />
                          <span className="text-white/30 text-[9px] uppercase tracking-[0.3em] font-bold">
                            Scroll to explore
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollStackItem>
              ))
            )}
          </ScrollStack>
        </div>
      </div>
    </div>
  );
};

export default Project;