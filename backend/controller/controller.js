import { Skill } from "../model/SkillsSchema.js";
import { Project } from "../model/projectSchema.js";
import { Profile } from "../model/profileSchema.js";

/* ================= SKILLS ================= */

export const addSkill = async (req, res) => {
  try {
    const { title, skills } = req.body;

    if (!title || !skills || skills.length === 0) {
      return res.status(400).json({
        message: "Title and skills required",
      });
    }

    const newSkill = await Skill.create({ title, skills });

    res.status(201).json({
      message: "Skill added",
      data: newSkill,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= PROJECTS ================= */


export const createProject = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { title, description, liveLink, githubLink } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const project = await Project.create({
      title,
      description,
      liveLink,
      githubLink,
      image: req.file.filename,
    });

    res.status(201).json({
      success: true,
      data: project,
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Project deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= PROFILE (BANNER) ================= */

export const uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const banner = req.file.filename;

    let profile = await Profile.findOne();

    if (profile) {
      profile.banner = banner;
      await profile.save();
    } else {
      profile = await Profile.create({ banner });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBanner = async (req, res) => {
  try {
    const profile = await Profile.findOne();

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};