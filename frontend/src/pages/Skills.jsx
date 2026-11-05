import React, { useState, useEffect } from "react";
import api from "../config/api";
import SkillsSection from "../components/SkillsSection";

const Skills = () => {
  const [skillData, setSkillData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSkills = async () => {
      try {
        const res = await api.get("/api/admin");
        const rawSkills = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        if (isMounted) {
          // Keep dynamic reverse logic to show newest or configured order safely
          setSkillData([...rawSkills].reverse());
        }
      } catch (error) {
        console.error("Error fetching skills on Skills page:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSkills();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-xs">
        Fetching Expertise...
      </div>
    );
  }

  return (
    <SkillsSection
      skills={skillData}
      preview={false}
    />
  );
};

export default Skills;
