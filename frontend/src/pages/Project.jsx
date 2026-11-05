import React, { useEffect, useState } from "react";
import api from "../config/api";
import ProjectCard from "../components/ProjectCard";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      try {
        const res = await api.get("/api/admin/projects");
        const projectList = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        if (isMounted) {
          setProjects(projectList);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-[#fafafa] py-24 px-6 md:px-12 lg:px-16 overflow-hidden min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 md:mb-20">
          <div>
            <p className="text-[10px] sm:text-xs tracking-[0.35em] font-bold text-yellow-600 uppercase mb-4">
              Selected Works // Archives
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
              A curated collection of web applications and editorial digital products.
              Click on any case study to explore full architectural details and live links.
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400">
              Loading Projects...
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200 p-12 max-w-lg mx-auto">
            <p className="text-gray-500 font-medium text-sm mb-2">
              No projects saved yet.
            </p>
            <p className="text-gray-400 text-xs">
              Upload your projects via the Admin Dashboard to have them permanently appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {projects.map((project, index) => (
              <ProjectCard
                key={project._id || index}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Bottom typography */}
        <div className="mt-28 overflow-hidden select-none">
          <h2 className="text-[18vw] md:text-[14vw] leading-none font-black tracking-[-0.08em] uppercase text-slate-200/50 whitespace-nowrap">
            Creative Works
          </h2>
        </div>
      </div>
    </section>
  );
};

export default Project;
