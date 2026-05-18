import React, { useEffect, useState } from "react";
import axios from "axios";

const Project = () => {
  const [projects, setProjects] = useState([]);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/admin/projects`
        );
        setProjects(res.data.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="w-full bg-[#efefef] py-16 px-5 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* top */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-black leading-tight">
              Featured
            </h1>
            <h1 className="text-3xl md:text-5xl italic text-black/40">
              Projects
            </h1>
          </div>

          <div className="text-sm text-black/60 font-medium">
            {projects.length} Projects
          </div>
        </div>

        {/* cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {projects.map((project, index) => (
            <div
              key={project._id}
              className="relative group"
            >
              {/* huge number */}
              <h1 className="absolute -left-3 bottom-20 z-20 text-[180px] md:text-[220px] leading-none font-black text-black pointer-events-none">
                {index + 1}
              </h1>

              {/* image */}
              <div className="overflow-hidden rounded-[40px] bg-white relative h-[500px]">
                <img
                  src={`${BASE_URL}/uploads/${project.image}`}
                  alt={project.title}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              {/* content */}
              <div className="pt-6 relative z-30">
                <h2 className="text-2xl font-bold text-black mb-3">
                  {project.title}
                </h2>

                <p className="text-black/70 text-[15px] leading-7 mb-5">
                  {project.description}
                </p>

                <div className="flex gap-3 flex-wrap">
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 rounded-full bg-black text-white text-sm hover:bg-black/80 transition"
                    >
                      Live Preview
                    </a>
                  )}

                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 rounded-full border border-black text-black text-sm hover:bg-black hover:text-white transition"
                    >
                      Github
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* bottom huge text */}
        <div className="overflow-hidden mt-16">
          <h1 className="text-[80px] md:text-[180px] font-black leading-none tracking-[-8px] text-black uppercase">
            Projects
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Project;