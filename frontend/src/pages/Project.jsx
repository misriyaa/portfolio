import React, { useEffect, useState } from "react";
import axios from "axios";
import ScrollStack, {
  ScrollStackItem,
} from "../components/ScrollStack/ScrollStack";

const Project = ({ isHomePage = false }) => {
  const [projects, setProjects] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKED_URL}/api/admin/projects`);
        setProjects(res.data.data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div style={{ background: "#0a0a0a", fontFamily: "'Georgia', 'Times New Roman', serif", minHeight: "100vh" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');

        .proj-root {
          font-family: 'Cormorant Garamond', 'Georgia', serif;
          background: #0a0a0a;
          color: #e8e0d0;
        }

        /* ── HEADER ── */
        .proj-header {
          padding: 7rem 4rem 4rem;
          max-width: 1440px;
          margin: 0 auto;
          border-bottom: 1px solid #222;
        }
        .proj-header-eyebrow {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .proj-header-line {
          width: 2.5rem;
          height: 1px;
          background: #c9a84c;
        }
        .proj-header-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.35em;
          color: #c9a84c;
          text-transform: uppercase;
          font-weight: 300;
        }
        .proj-header-titles {
          display: flex;
          flex-direction: column;
        }
        .proj-header-title {
          font-size: clamp(4rem, 9vw, 9rem);
          font-weight: 300;
          font-style: italic;
          color: #e8e0d0;
          line-height: 0.88;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .proj-header-title.indent {
          padding-left: clamp(2rem, 6vw, 8rem);
          color: transparent;
          -webkit-text-stroke: 1px #444;
        }

        /* ── GRID ── */
        .proj-grid {
          max-width: 1440px;
          margin: 0 auto;
          padding: 4rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
        }
        @media (max-width: 768px) {
          .proj-grid { grid-template-columns: 1fr; padding: 1.5rem; }
          .proj-header { padding: 5rem 1.5rem 3rem; }
          .proj-card.featured { grid-column: span 1; }
        }
        .proj-card.featured {
          grid-column: span 2;
        }

        /* ── CARD ── */
        .proj-card {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          background: #111;
        }
        .proj-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .proj-card.featured .proj-card-inner { height: 75vh; min-height: 500px; }
        .proj-card:not(.featured) .proj-card-inner { height: 55vh; min-height: 380px; }

        .proj-card-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      filter 1.2s ease;
          filter: grayscale(30%) brightness(0.75);
        }
        .proj-card:hover .proj-card-img {
          transform: scale(1.06);
          filter: grayscale(0%) brightness(0.65);
        }

        .proj-card-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(5,5,5,0.97) 0%,
            rgba(5,5,5,0.5) 40%,
            rgba(5,5,5,0.1) 70%,
            transparent 100%
          );
          transition: opacity 0.6s ease;
        }
        .proj-card:hover .proj-card-vignette {
          opacity: 1;
        }

        /* top bar */
        .proj-card-topbar {
          position: absolute;
          top: 0; left: 0; right: 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 2rem 2.5rem;
          z-index: 10;
        }
        .proj-card-num {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          color: rgba(201,168,76,0.6);
          font-weight: 300;
        }
        .proj-card-cat {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          color: rgba(232,224,208,0.4);
          text-transform: uppercase;
          font-weight: 300;
        }

        /* bottom content */
        .proj-card-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 2rem 2.5rem 2.5rem;
          z-index: 10;
        }
        .proj-card.featured .proj-card-content { padding: 3rem 3.5rem 3.5rem; }

        .proj-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-style: italic;
          color: #e8e0d0;
          line-height: 0.9;
          letter-spacing: -0.02em;
          margin: 0 0 1rem 0;
          font-size: clamp(2.2rem, 4vw, 3.8rem);
        }
        .proj-card:not(.featured) .proj-card-title { font-size: clamp(1.8rem, 3vw, 2.5rem); }

        .proj-card-divider {
          width: 2rem;
          height: 1px;
          background: #c9a84c;
          margin-bottom: 1rem;
          transition: width 0.5s ease;
        }
        .proj-card:hover .proj-card-divider { width: 4rem; }

        .proj-card-desc {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.95rem;
          font-weight: 300;
          color: rgba(232,224,208,0.6);
          line-height: 1.7;
          margin: 0 0 1.5rem 0;
          max-width: 55ch;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .proj-card.featured .proj-card-desc { font-size: 1.1rem; -webkit-line-clamp: 3; }

        .proj-card-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.4s ease 0.05s, transform 0.4s ease 0.05s;
        }
        .proj-card:hover .proj-card-actions {
          opacity: 1;
          transform: translateY(0);
        }

        .proj-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.4rem;
          background: #c9a84c;
          color: #0a0a0a;
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 400;
          text-decoration: none;
          transition: background 0.3s ease, color 0.3s ease;
        }
        .proj-btn-primary:hover { background: #e8e0d0; }

        .proj-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.4rem;
          border: 1px solid rgba(232,224,208,0.2);
          color: rgba(232,224,208,0.6);
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 300;
          text-decoration: none;
          transition: border-color 0.3s ease, color 0.3s ease;
        }
        .proj-btn-ghost:hover {
          border-color: rgba(232,224,208,0.6);
          color: #e8e0d0;
        }

        /* ── EMPTY STATE ── */
        .proj-empty {
          grid-column: span 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          gap: 1rem;
        }
        .proj-empty-line { width: 1px; height: 4rem; background: #333; }
        .proj-empty-text {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.4em;
          color: #444;
          text-transform: uppercase;
        }

        /* ── FOOTER RULE ── */
        .proj-footer-rule {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 4rem 5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .proj-footer-rule-line { flex: 1; height: 1px; background: #1a1a1a; }
        .proj-footer-rule-text {
          font-family: 'DM Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.3em;
          color: #2a2a2a;
          text-transform: uppercase;
        }
      `}</style>

      <div className="proj-root">
        {/* HEADER */}
        {!isHomePage && (
          <section className="proj-header">
            <div className="proj-header-eyebrow">
              <div className="proj-header-line" />
              <span className="proj-header-label">Works 03 // 04</span>
            </div>
            <div className="proj-header-titles">
              <h1 className="proj-header-title">Featured</h1>
              <h1 className="proj-header-title indent">Projects</h1>
            </div>
          </section>
        )}

        {/* GRID */}
        <div className="proj-grid">
          {projects.length === 0 ? (
            <div className="proj-empty">
              <div className="proj-empty-line" />
              <span className="proj-empty-text">Initializing Portfolio</span>
              <div className="proj-empty-line" />
            </div>
          ) : (
            projects.map((project, idx) => (
              <div
                key={project._id}
                className={`proj-card${idx === 0 ? " featured" : ""}`}
                onMouseEnter={() => setHoveredId(project._id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="proj-card-inner">
                  {project.image && (
                    <img
                      src={`${import.meta.env.VITE_BACKED_URL}/uploads/${project.image}`}
                      alt={project.title}
                      className="proj-card-img"
                    />
                  )}

                  <div className="proj-card-vignette" />

                  {/* Top bar */}
                  <div className="proj-card-topbar">
                    <span className="proj-card-num">
                      {String(idx + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                    </span>
                    <span className="proj-card-cat">{project.category || "Development"}</span>
                  </div>

                  {/* Bottom content */}
                  <div className="proj-card-content">
                    <div className="proj-card-divider" />
                    <h2 className="proj-card-title">{project.title}</h2>

                    {project.description && (
                      <p className="proj-card-desc">{project.description}</p>
                    )}

                    <div className="proj-card-actions">
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="proj-btn-primary"
                        >
                          View Live <span>↗</span>
                        </a>
                      )}
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="proj-btn-ghost"
                        >
                          Source
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER RULE */}
        <div className="proj-footer-rule">
          <div className="proj-footer-rule-line" />
          <span className="proj-footer-rule-text">End of selected works</span>
          <div className="proj-footer-rule-line" />
        </div>
      </div>
    </div>
  );
};

export default Project;