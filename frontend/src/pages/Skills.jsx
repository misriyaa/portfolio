import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const Skills = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [skillData, setSkillData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKED_URL}/api/admin`);
        // Keeping your dynamic reverse logic exactly as is
        setSkillData(res.data.reverse());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-xs">
        Fetching Expertise...
      </div>
    );
  }

  return (
    <section className="w-full bg-white px-4 md:px-10 py-20 md:py-32 overflow-hidden font-sans">
      <div className="max-w-[1440px] mx-auto">
        
        {/* SECTION HEADER - Matched with About/Home Margins and Style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 md:mb-32">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[2px] w-20 bg-yellow-500"></div>
              <span className="text-[11px] tracking-[0.5em] uppercase text-zinc-900 font-black">
                Skills 02 // 04
              </span>
            </div>
            
            <h1 className="text-[12vw] md:text-[100px] font-black text-zinc-900 leading-[0.8] uppercase tracking-tighter">
              WHAT I CAN <br />
              <span style={{ WebkitTextStroke: '2px #eab308', color: 'transparent' }}>DO FOR YOU</span>
            </h1>
          </div>

          <div className="max-w-sm">
            <p className="text-zinc-500 text-sm md:text-base font-medium leading-relaxed border-l-2 border-yellow-500 pl-6">
              As a full-stack developer, I build seamless digital experiences with 
              performance, design, and usability in mind.
            </p>
          </div>
        </div>

        {/* ACCORDION LIST */}
        <div className="border-t border-zinc-100">
          {skillData.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="border-b border-zinc-100 group">
                
                {/* ACCORDION TRIGGER */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full py-10 md:py-14 flex justify-between items-center text-left transition-all"
                >
                  <div className="flex items-center gap-6 md:gap-12">
                    <span className={`text-xs md:text-sm font-black tracking-widest ${isOpen ? "text-yellow-600" : "text-zinc-300"}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h2 className={`text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter transition-all duration-500 ${
                      isOpen ? "text-zinc-900 translate-x-4" : "text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-2"
                    }`}>
                      {item.title}
                    </h2>
                  </div>

                  <div className={`transition-all duration-500 ${isOpen ? "text-yellow-600 rotate-180" : "text-zinc-300 group-hover:text-zinc-900"}`}>
                    <ChevronDown size={40} strokeWidth={2.5} />
                  </div>
                </button>

                {/* ACCORDION CONTENT */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-16 px-6 md:px-24">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
                          {item.skills.map((skill, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 + 0.2 }}
                              className="flex items-center gap-4 text-zinc-600 text-base md:text-lg font-bold uppercase tracking-tight"
                            >
                              {/* Designer-style yellow dot instead of checkmark */}
                              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                              {skill}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;