import React, { useState } from "react";
import { Link } from "react-router-dom";
import { resolveImageUrl } from "../config/api";

const ProjectCard = ({ project, index = 0 }) => {
  const [imgError, setImgError] = useState(false);

  // Format index as 01, 02, 03...
  const caseNumber = String(index + 1).padStart(2, "0");

  const imageUrl = !imgError && project?.image
    ? resolveImageUrl(project.image)
    : null;

  return (
    <Link
      to={`/projects/${project?._id}`}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 rounded-[32px] sm:rounded-[36px]"
      aria-label={`View case study for ${project?.title || "project"}`}
    >
      <div className="bg-white rounded-[32px] sm:rounded-[36px] p-4 sm:p-5 border border-slate-100/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgb(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full overflow-hidden">
        
        {/* ================= TOP: IMAGE CONTAINER WITH OVERLAPPING TAB ================= */}
        <div className="relative w-full aspect-[4/3] rounded-[22px] sm:rounded-[24px] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          
          {/* Main Project Image */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={project?.title || "Project preview"}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6">
              <span className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-300">
                {project?.title ? project.title.slice(0, 3) : "PRJ"}
              </span>
            </div>
          )}

          {/* Frosted Editorial Pill Badge (Top-Left) */}
          <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10 pointer-events-none">
            <span className="inline-flex items-center px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-white bg-black/30 backdrop-blur-md border border-white/20 shadow-sm">
              Case Study
            </span>
          </div>

          {/* Overlapping Curved Tab Detail (Bottom-Right) */}
          <div className="absolute bottom-0 right-0 z-10 flex items-end pointer-events-none">
            
            {/* Smooth Concave Fillet Curve (Left of the Tab) */}
            <div className="w-6 h-6 sm:w-7 sm:h-7 overflow-hidden -mr-[1px]">
              <svg
                className="w-full h-full fill-white"
                viewBox="0 0 24 24"
                preserveAspectRatio="none"
              >
                <path d="M24 24H0C13.2548 24 24 13.2548 24 0V24Z" />
              </svg>
            </div>

            {/* The Signature White Tab with Number */}
            <div className="bg-white pt-2.5 sm:pt-3 pb-0 pl-3.5 sm:pl-4 pr-3.5 sm:pr-4 rounded-tl-[18px] sm:rounded-tl-[20px] flex items-baseline gap-1.5 select-none">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-400 lowercase tracking-normal">
                case
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight leading-none">
                {caseNumber}
              </span>
            </div>

          </div>
        </div>

        {/* ================= BOTTOM: PROJECT TITLE ONLY ================= */}
        <div className="pt-6 sm:pt-7 pb-2 px-2 sm:px-3 flex-1 flex flex-col justify-start">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight leading-[1.15] uppercase group-hover:text-yellow-600 transition-colors duration-300">
            {project?.title || "Untitled Project"}
          </h3>
        </div>

      </div>
    </Link>
  );
};

export default ProjectCard;

