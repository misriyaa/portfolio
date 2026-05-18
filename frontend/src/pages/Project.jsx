import React, { useEffect, useState } from "react";
import axios from "axios";

const Project = () => {
  const [projects, setProjects] = useState([]);

  // Note: Kept your variable name, but double check if it should be VITE_BACKEND_URL in your .env
  const BASE_URL = import.meta.env.VITE_BACKED_URL;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/projects`);
        setProjects(res.data.data || []);
        console.log(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="bg-white py-24 px-6 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div>
            <p className="text-[10px] sm:text-xs tracking-[0.35em] font-bold text-yellow-500 uppercase mb-5">
              Selected Works
            </p>

            <h1 className="text-[13vw] sm:text-[10vw] md:text-[7vw] leading-[0.85] font-black tracking-tighter uppercase text-[#1a1a1a]">
              Featured <br />
              <span className="text-gray-300 italic font-light lowercase tracking-normal">
                projects
              </span>
            </h1>
          </div>

          <div className="max-w-sm">
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed font-medium">
              A curated collection of modern web experiences focused on
              performance, interaction, scalability, and premium UI engineering.
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <div key={project._id} className="group relative">
              {/* Card */}
              <div className="relative z-10">
                {/* Image */}
                <div className="overflow-hidden bg-gray-100 rounded-sm border border-gray-100">
                  <img
                    src={`${BASE_URL.replace(/\/$/, "")}/uploads/${project.image}`}
                    alt={project.title}
                    className="w-full h-[420px] object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700"
                    onError={(e) => {
                      // If the image path is broken entirely, this prevents a blank space
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/600x400/e2e8f0/1e293b?text=Image+Not+Found";
                    }}
                  />
                </div>

                {/* Content */}
                <div className="pt-8">
                  {/* Small line */}
                  <div className="w-10 h-[2px] bg-yellow-500 mb-5 group-hover:w-20 transition-all duration-500" />

                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#1a1a1a] uppercase leading-none mb-4">
                    {project.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-500 text-sm md:text-[15px] leading-7 max-w-md mb-8 font-medium">
                    {project.description}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-wrap items-center gap-4">
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1a1a1a] text-white text-[11px] uppercase tracking-[0.2em] px-6 py-4 hover:bg-yellow-500 hover:text-black transition-all duration-300 font-bold"
                      >
                        View Live
                      </a>
                    )}

                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-gray-300 text-[#1a1a1a] text-[11px] uppercase tracking-[0.2em] px-6 py-4 hover:border-black transition-all duration-300 font-bold"
                      >
                        Github
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom typography */}
        <div className="mt-24 overflow-hidden">
          <h1 className="text-[18vw] md:text-[14vw] leading-none font-black tracking-[-0.08em] uppercase text-[#f5f5f5] whitespace-nowrap">
            Creative Developer
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Project;
