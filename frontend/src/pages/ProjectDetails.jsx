import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api, { resolveImageUrl } from "../config/api";
import { ArrowLeft, ExternalLink, Sparkles, FolderGit2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProjectDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        let fetchedData = null;

        // 1. Try dedicated single-project endpoint
        try {
          const res = await api.get(`/api/admin/projects/${id}`);
          if (res.data?.data) {
            fetchedData = res.data.data;
          }
        } catch {
          // If direct endpoint failed, try public alias
          try {
            const aliasRes = await api.get(`/api/projects/${id}`);
            if (aliasRes.data?.data) {
              fetchedData = aliasRes.data.data;
            }
          } catch {
            // Fallback: fetch project list and match by ID (guarantees compatibility with older backends)
            const listRes = await api.get("/api/admin/projects");
            const list = Array.isArray(listRes.data?.data)
              ? listRes.data.data
              : Array.isArray(listRes.data)
              ? listRes.data
              : [];
            fetchedData = list.find((p) => String(p._id) === String(id));
          }
        }

        if (isMounted) {
          if (fetchedData) {
            setProject(fetchedData);
          } else {
            setError("Project not found or may have been deleted.");
          }
        }
      } catch (err) {
        console.error("Error fetching project details:", err);
        if (isMounted) {
          setError("Failed to load project details. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchProjectDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-6">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500">
          Loading Case Study...
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-6">
          <FolderGit2 size={28} />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-2">
          Project Not Found
        </h2>
        <p className="text-sm text-gray-500 max-w-md mb-8">
          {error || "The requested case study could not be located in the database."}
        </p>
        <button
          onClick={() => navigate("/projects")}
          className="inline-flex items-center gap-2 bg-[#0f172a] text-white hover:bg-yellow-500 hover:text-black px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] rounded-full transition-all shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </button>
      </div>
    );
  }

  const imageUrl = !imgError && project.image ? resolveImageUrl(project.image) : null;

  return (
    <article className="min-h-screen bg-[#fafafa] text-[#1a1a1a] selection:bg-yellow-200 py-12 md:py-20 px-5 sm:px-8 md:px-12 lg:px-16 font-sans">
      <div className="max-w-[1280px] mx-auto">
        
        {/* ================= TOP BREADCRUMB / BACK LINK ================= */}
        <div className="mb-8 md:mb-12">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-slate-600 hover:text-yellow-600 transition-colors group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* ================= EDITORIAL HEADER ================= */}
        <header className="mb-10 md:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-yellow-600">
              Case Study // Selected Work
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#0f172a] tracking-tight uppercase leading-[0.95] max-w-4xl">
            {project.title}
          </h1>
        </header>

        {/* ================= HERO IMAGE SHOWCASE ================= */}
        <div className="relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden bg-white border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] mb-12 md:mb-16">
          <div className="w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] bg-slate-900 flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={project.title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-semibold uppercase tracking-widest">
                Project Image Preview
              </div>
            )}
          </div>
        </div>

        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT: FULL DESCRIPTION */}
          <div className="lg:col-span-8 bg-white p-7 sm:p-10 md:p-12 rounded-[28px] border border-slate-200/80 shadow-sm space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-[2px] bg-yellow-500" />
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                  Case Overview
                </h2>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight uppercase">
                About The Project
              </h3>
            </div>

            <div className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal space-y-4">
              {project.description || "No full description provided for this project yet."}
            </div>
          </div>

          {/* RIGHT: ACTIONS & METADATA CARD */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Actions Card */}
            <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 mb-2">
                Project Links
              </h3>

              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-3 bg-yellow-500 hover:bg-[#0f172a] hover:text-white text-black font-extrabold text-xs uppercase tracking-[0.2em] py-4 px-6 rounded-2xl transition-all duration-300 shadow-md group"
                >
                  <span>Launch Live Demo</span>
                  <ExternalLink size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}

              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-3 bg-[#0f172a] hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-[0.2em] py-4 px-6 rounded-2xl transition-all duration-300 shadow-md group"
                >
                  <FaGithub size={16} />
                  <span>View Source Code</span>
                </a>
              )}

              {!project.liveLink && !project.githubLink && (
                <p className="text-xs text-slate-400 italic">
                  No public links associated with this case study yet.
                </p>
              )}
            </div>

            {/* Meta Info Pill Card */}
            <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={14} className="text-yellow-500" />
                <span>Production Portfolio Feature</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Permanently persisted in MongoDB Atlas with media optimization via Cloudinary.
              </p>
            </div>

          </div>

        </div>

        {/* ================= BOTTOM NAVIGATION CTA ================= */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-700 hover:text-yellow-600 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Return to All Projects</span>
          </Link>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#0f172a] hover:bg-yellow-500 hover:text-black text-white text-xs font-bold uppercase tracking-[0.2em] px-8 py-3.5 rounded-full transition-all shadow-sm"
          >
            <span>Start a Project Together</span>
          </Link>
        </div>

      </div>
    </article>
  );
};

export default ProjectDetails;
