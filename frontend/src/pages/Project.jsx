import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Project = ({ isHomePage = false }) => {
  const [projects, setProjects] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const trackRef = useRef(null);

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

  const scrollTo = (idx) => {
    const clamped = Math.max(0, Math.min(idx, projects.length - 1));
    setActiveIdx(clamped);
    if (trackRef.current) {
      const card = trackRef.current.children[clamped];
      if (card) card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  return (
    <div style={{ background: "#0a0a0a", fontFamily: "'Georgia','Times New Roman',serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');

        .pj { font-family:'Cormorant Garamond',serif; background:#0a0a0a; color:#e8e0d0; }

        /* HEADER */
        .pj-hdr { padding:7rem 5rem 3rem; max-width:1440px; margin:0 auto; }
        .pj-hdr-eye { display:flex; align-items:center; gap:1rem; margin-bottom:2rem; }
        .pj-hdr-dash { width:2.5rem; height:1px; background:#c9a84c; }
        .pj-hdr-lbl { font-family:'DM Mono',monospace; font-size:.6rem; letter-spacing:.35em; color:#c9a84c; text-transform:uppercase; font-weight:300; }
        .pj-hdr-row { display:flex; align-items:flex-end; justify-content:space-between; gap:2rem; }
        .pj-hdr-titles { display:flex; flex-direction:column; }
        .pj-hdr-t { font-size:clamp(3.5rem,8vw,8rem); font-weight:300; font-style:italic; color:#e8e0d0; line-height:.88; letter-spacing:-.02em; margin:0; }
        .pj-hdr-t.ghost { color:transparent; -webkit-text-stroke:1px #333; padding-left:clamp(1.5rem,4vw,5rem); }
        .pj-hdr-count { font-family:'DM Mono',monospace; font-size:.6rem; letter-spacing:.25em; color:#444; margin-bottom:.4rem; white-space:nowrap; }

        /* BODY */
        .pj-body { display:flex; max-width:1440px; margin:0 auto; padding:2rem 0 0; }

        /* SIDEBAR */
        .pj-sidebar {
          width:5rem; flex-shrink:0; display:flex; flex-direction:column;
          align-items:center; padding:1rem 0 3rem;
          border-right:1px solid #1a1a1a; gap:.25rem;
        }
        .pj-dot-wrap { display:flex; flex-direction:column; align-items:center; gap:.15rem; cursor:pointer; padding:.4rem .5rem; }
        .pj-dot-num { font-family:'DM Mono',monospace; font-size:.55rem; letter-spacing:.1em; color:#333; transition:color .3s; }
        .pj-dot-wrap.active .pj-dot-num { color:#c9a84c; }
        .pj-dot-bar { width:1px; height:1.5rem; background:#1e1e1e; transition:background .3s, height .3s; }
        .pj-dot-wrap.active .pj-dot-bar { background:#c9a84c; height:2.5rem; }

        /* STAGE */
        .pj-stage { flex:1; overflow:hidden; position:relative; }
        .pj-track {
          display:flex; overflow-x:auto; scroll-snap-type:x mandatory;
          scrollbar-width:none; gap:2px; height:78vh; min-height:480px;
        }
        .pj-track::-webkit-scrollbar { display:none; }

        /* CARD */
        .pj-card {
          flex:0 0 100%; scroll-snap-align:start; position:relative;
          overflow:hidden; cursor:pointer; background:#111;
        }
        @media(min-width:900px){ .pj-card { flex:0 0 72%; } }

        .pj-card-img {
          position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
          filter:grayscale(30%) brightness(.7);
          transition:transform 1.2s cubic-bezier(.25,.46,.45,.94), filter 1.2s ease;
        }
        .pj-card:hover .pj-card-img { transform:scale(1.05); filter:grayscale(0%) brightness(.6); }

        .pj-card-vig {
          position:absolute; inset:0;
          background:linear-gradient(to top, rgba(5,5,5,.97) 0%, rgba(5,5,5,.45) 45%, transparent 100%);
        }
        .pj-card-vig::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(to right, rgba(5,5,5,.8) 0%, transparent 30%);
        }

        .pj-card-top {
          position:absolute; top:2rem; right:2.5rem; z-index:10;
          font-family:'DM Mono',monospace; font-size:.6rem; letter-spacing:.3em;
          color:rgba(232,224,208,.3); text-transform:uppercase;
        }

        .pj-card-body {
          position:absolute; bottom:0; left:0; right:0; z-index:10;
          padding:0 3rem 3rem; display:flex; align-items:flex-end; gap:3rem;
        }
        .pj-card-left { flex:1; }
        .pj-card-right { flex-shrink:0; display:flex; flex-direction:column; align-items:flex-end; gap:.75rem; padding-bottom:.25rem; }

        .pj-card-bar { width:2rem; height:1px; background:#c9a84c; margin-bottom:.75rem; transition:width .5s; }
        .pj-card:hover .pj-card-bar { width:4rem; }

        .pj-card-title {
          font-family:'Cormorant Garamond',serif; font-weight:300; font-style:italic;
          color:#e8e0d0; line-height:.88; letter-spacing:-.02em; margin:0 0 1rem;
          font-size:clamp(2.2rem,4.5vw,4rem);
        }
        .pj-card-desc {
          font-family:'Cormorant Garamond',serif; font-size:1rem; font-weight:300;
          color:rgba(232,224,208,.55); line-height:1.7; margin:0; max-width:50ch;
          display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
        }

        .pj-btn-p {
          display:inline-flex; align-items:center; gap:.5rem;
          padding:.6rem 1.3rem; background:#c9a84c; color:#0a0a0a;
          font-family:'DM Mono',monospace; font-size:.58rem; letter-spacing:.2em; text-transform:uppercase;
          text-decoration:none; transition:background .3s; white-space:nowrap;
        }
        .pj-btn-p:hover { background:#e8e0d0; }
        .pj-btn-g {
          display:inline-flex; align-items:center; gap:.5rem;
          padding:.6rem 1.3rem; border:1px solid rgba(232,224,208,.2); color:rgba(232,224,208,.55);
          font-family:'DM Mono',monospace; font-size:.58rem; letter-spacing:.2em; text-transform:uppercase;
          text-decoration:none; transition:border-color .3s, color .3s; white-space:nowrap;
        }
        .pj-btn-g:hover { border-color:rgba(232,224,208,.6); color:#e8e0d0; }

        /* BOTTOM NAV */
        .pj-nav {
          max-width:1440px; margin:0 auto;
          display:flex; align-items:center; justify-content:space-between;
          padding:1.5rem 5rem 5rem; border-top:1px solid #151515;
        }
        .pj-nav-arrows { display:flex; gap:.5rem; }
        .pj-arrow {
          width:2.5rem; height:2.5rem; border:1px solid #222;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:border-color .3s; font-size:1rem; color:#444; background:none;
        }
        .pj-arrow:hover { border-color:#c9a84c; color:#c9a84c; }
        .pj-arrow:disabled { opacity:.2; cursor:not-allowed; }
        .pj-nav-progress { display:flex; gap:.4rem; align-items:center; }
        .pj-pip { width:1.8rem; height:1px; background:#1e1e1e; cursor:pointer; transition:background .3s, width .3s; }
        .pj-pip.active { background:#c9a84c; width:3rem; }
        .pj-nav-end { font-family:'DM Mono',monospace; font-size:.55rem; letter-spacing:.3em; color:#2a2a2a; text-transform:uppercase; }

        /* EMPTY */
        .pj-empty { height:70vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1rem; }
        .pj-empty-line { width:1px; height:4rem; background:#1a1a1a; }
        .pj-empty-txt { font-family:'DM Mono',monospace; font-size:.6rem; letter-spacing:.4em; color:#333; text-transform:uppercase; }

        @media(max-width:640px){
          .pj-hdr { padding:5rem 1.5rem 2rem; }
          .pj-body { flex-direction:column; }
          .pj-sidebar { flex-direction:row; width:100%; border-right:none; border-bottom:1px solid #1a1a1a; padding:.75rem 1.5rem; }
          .pj-dot-bar { width:1.5rem; height:1px; }
          .pj-dot-wrap.active .pj-dot-bar { width:2.5rem; height:1px; }
          .pj-card-body { flex-direction:column; gap:1rem; padding:0 1.5rem 2rem; }
          .pj-card-right { align-items:flex-start; flex-direction:row; flex-wrap:wrap; }
          .pj-nav { padding:1.5rem 1.5rem 3.5rem; }
        }
      `}</style>

      <div className="pj">
        {!isHomePage && (
          <section className="pj-hdr">
            <div className="pj-hdr-eye">
              <div className="pj-hdr-dash" />
              <span className="pj-hdr-lbl">Works 03 // 04</span>
            </div>
            <div className="pj-hdr-row">
              <div className="pj-hdr-titles">
                <h1 className="pj-hdr-t">Featured</h1>
                <h1 className="pj-hdr-t ghost">Projects</h1>
              </div>
              <span className="pj-hdr-count">
                {String(activeIdx + 1).padStart(2,"0")} — {String(Math.max(projects.length,1)).padStart(2,"0")}
              </span>
            </div>
          </section>
        )}

        {projects.length === 0 ? (
          <div className="pj-empty">
            <div className="pj-empty-line" />
            <span className="pj-empty-txt">Initializing Portfolio</span>
            <div className="pj-empty-line" />
          </div>
        ) : (
          <>
            <div className="pj-body">
              {/* Sidebar */}
              <div className="pj-sidebar">
                {projects.map((_, i) => (
                  <div key={i} className={`pj-dot-wrap${i === activeIdx ? " active" : ""}`} onClick={() => scrollTo(i)}>
                    <span className="pj-dot-num">{String(i + 1).padStart(2,"0")}</span>
                    {i < projects.length - 1 && <div className="pj-dot-bar" />}
                  </div>
                ))}
              </div>

              {/* Stage */}
              <div className="pj-stage">
                <div className="pj-track" ref={trackRef}>
                  {projects.map((project, idx) => (
                    <div key={project._id} className={`pj-card${idx === activeIdx ? " active" : ""}`} onClick={() => setActiveIdx(idx)}>
                      {project.image && (
                        <img src={`${import.meta.env.VITE_BACKED_URL}/uploads/${project.image}`} alt={project.title} className="pj-card-img" />
                      )}
                      <div className="pj-card-vig" />
                      <div className="pj-card-top">{project.category || "Development"}</div>
                      <div className="pj-card-body">
                        <div className="pj-card-left">
                          <div className="pj-card-bar" />
                          <h2 className="pj-card-title">{project.title}</h2>
                          {project.description && <p className="pj-card-desc">{project.description}</p>}
                        </div>
                        <div className="pj-card-right">
                          {project.liveLink && (
                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="pj-btn-p">View Live ↗</a>
                          )}
                          {project.githubLink && (
                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="pj-btn-g">Source</a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom nav */}
            <div className="pj-nav">
              <div className="pj-nav-arrows">
                <button className="pj-arrow" disabled={activeIdx === 0} onClick={() => scrollTo(activeIdx - 1)}>←</button>
                <button className="pj-arrow" disabled={activeIdx === projects.length - 1} onClick={() => scrollTo(activeIdx + 1)}>→</button>
              </div>
              <div className="pj-nav-progress">
                {projects.map((_, i) => (
                  <div key={i} className={`pj-pip${i === activeIdx ? " active" : ""}`} onClick={() => scrollTo(i)} />
                ))}
              </div>
              <span className="pj-nav-end">End of selected works</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Project;