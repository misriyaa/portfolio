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
        const res = await axios.get("http://localhost:5000/api/admin/projects");
        setProjects(res.data.data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="bg-white font-sans">
      {/* SECTION HEADER - Refined & Scaled Down */}
      {!isHomePage && (
        <section className="pt-24 pb-12 px-6 md:px-10 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1.5px] w-12 bg-yellow-500"></div>
            <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold">
              Works 03 // 04
            </span>
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-zinc-900 leading-[0.9] uppercase tracking-tighter">
              FEATURED
            </h1>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-zinc-900 leading-[0.9] uppercase tracking-tighter ml-6 md:ml-12">
              PROJECTS
            </h1>
          </div>
        </section>
      )}

      {/* PROJECT STACK */}
      <div className="px-4 md:px-10 pb-32">
        <div className="max-w-[1440px] mx-auto">
          <ScrollStack>
            {projects.length === 0 ? (
              <div className="h-[60vh] flex items-center justify-center border border-zinc-100">
                <p className="uppercase tracking-[0.3em] text-[10px] font-bold text-zinc-300">
                  Initializing Portfolio...
                </p>
              </div>
            ) : (
              projects.map((project) => (
                <ScrollStackItem key={project._id}>
                  <div className="relative h-[80vh] w-full overflow-hidden shadow-2xl group rounded-sm">
                    
                    {/* IMAGE */}
                    {project.image && (
                      <img
                        src={`http://localhost:5000/uploads/${project.image}`}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    )}

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    {/* CONTENT AREA */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-16">
                      
                      <span className="text-yellow-500 text-[10px] font-black tracking-[0.4em] uppercase mb-3">
                        {project.category || "Development"}
                      </span>

                      <h2 className="text-4xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter text-white mb-6">
                        {project.title}
                      </h2>

                      {project.description && (
                        <p className="text-sm md:text-base text-zinc-300 max-w-xl font-medium leading-relaxed mb-8 opacity-80">
                          {project.description}
                        </p>
                      )}

                      {/* BUTTONS */}
                      <div className="flex gap-4 flex-wrap">
                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2"
                          >
                            Live Demo <span>→</span>
                          </a>
                        )}

                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                          >
                            Github Code
                          </a>
                        )}
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