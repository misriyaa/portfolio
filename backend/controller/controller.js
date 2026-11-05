import { Skill } from "../model/SkillsSchema.js";
import { Project } from "../model/projectSchema.js";
import { Profile } from "../model/profileSchema.js";
import { ContactMessage } from "../model/contactMessageSchema.js";
import cloudinary from "../config/cloudinary.js";

// Helper to ensure HTTPS URL
const ensureHttps = (url) => {
  if (!url) return "";
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return url;
};

/* ================= PROFILE & BANNER ================= */

export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { email, phone, location, socialLinks } = req.body;

    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
    }

    if (email !== undefined) profile.email = email.trim();
    if (phone !== undefined) profile.phone = phone.trim();
    if (location !== undefined) profile.location = location.trim();
    if (socialLinks) {
      profile.socialLinks = {
        github: socialLinks.github !== undefined ? socialLinks.github.trim() : profile.socialLinks.github,
        linkedin: socialLinks.linkedin !== undefined ? socialLinks.linkedin.trim() : profile.socialLinks.linkedin,
        instagram: socialLinks.instagram !== undefined ? socialLinks.instagram.trim() : profile.socialLinks.instagram,
      };
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Contact information updated successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    const secureBannerUrl = ensureHttps(req.file.path || req.file.secure_url);
    const bannerPublicId = req.file.filename || "";

    let profile = await Profile.findOne();

    if (profile) {
      // Clean up previous image from Cloudinary if it had a public ID
      if (profile.bannerPublicId && profile.bannerPublicId !== bannerPublicId) {
        try {
          await cloudinary.uploader.destroy(profile.bannerPublicId);
        } catch (destroyErr) {
          console.warn("Could not delete previous banner from Cloudinary:", destroyErr.message);
        }
      }

      profile.banner = secureBannerUrl;
      profile.bannerPublicId = bannerPublicId;
      await profile.save();
    } else {
      profile = await Profile.create({
        banner: secureBannerUrl,
        bannerPublicId,
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner uploaded and saved permanently",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBanner = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= SKILLS ================= */

export const addSkill = async (req, res) => {
  try {
    const { title, skills } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Skill category title is required",
      });
    }

    const cleanedSkills = Array.isArray(skills)
      ? skills.map((s) => s.trim()).filter(Boolean)
      : [];

    if (cleanedSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one valid skill is required",
      });
    }

    // Check if category already exists (case-insensitive) to prevent accidental duplicate entries
    const existingCategory = await Skill.findOne({
      title: { $regex: new RegExp(`^${title.trim()}$`, "i") },
    });

    if (existingCategory) {
      // Merge unique skills into existing category
      const mergedSet = new Set([...existingCategory.skills, ...cleanedSkills]);
      existingCategory.skills = Array.from(mergedSet);
      await existingCategory.save();

      return res.status(200).json({
        success: true,
        message: `Updated existing category '${existingCategory.title}' with new skills`,
        data: existingCategory,
      });
    }

    const newSkill = await Skill.create({
      title: title.trim(),
      skills: cleanedSkills,
    });

    res.status(201).json({
      success: true,
      message: "Skill category added successfully",
      data: newSkill,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, skills } = req.body;

    const cleanedSkills = Array.isArray(skills)
      ? skills.map((s) => s.trim()).filter(Boolean)
      : [];

    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill category not found",
      });
    }

    if (title && title.trim()) skill.title = title.trim();
    if (cleanedSkills.length > 0) skill.skills = cleanedSkills;

    await skill.save();

    res.status(200).json({
      success: true,
      message: "Skill category updated successfully",
      data: skill,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Skill.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Skill category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= PROJECTS ================= */

export const createProject = async (req, res) => {
  try {
    const { title, description, liveLink, githubLink } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Project image is required",
      });
    }

    const secureImageUrl = ensureHttps(req.file.path || req.file.secure_url);
    const imagePublicId = req.file.filename || "";

    const project = await Project.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      liveLink: liveLink ? liveLink.trim() : "",
      githubLink: githubLink ? githubLink.trim() : "",
      image: secureImageUrl,
      imagePublicId,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
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
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, liveLink, githubLink } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (title && title.trim()) project.title = title.trim();
    if (description !== undefined) project.description = description.trim();
    if (liveLink !== undefined) project.liveLink = liveLink.trim();
    if (githubLink !== undefined) project.githubLink = githubLink.trim();

    // If new image uploaded
    if (req.file) {
      if (project.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(project.imagePublicId);
        } catch (destroyErr) {
          console.warn("Could not destroy old project image:", destroyErr.message);
        }
      }
      project.image = ensureHttps(req.file.path || req.file.secure_url);
      project.imagePublicId = req.file.filename || "";
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(project.imagePublicId);
      } catch (destroyErr) {
        console.warn("Could not delete project image from Cloudinary:", destroyErr.message);
      }
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= VISITOR CONTACT ENQUIRIES ================= */

export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, service, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const contactMsg = await ContactMessage.create({
      name: name.trim(),
      email: email.trim(),
      service: service ? service.trim() : "",
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Thank you! Your message has been sent successfully. I will get back to you soon.",
      data: contactMsg,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ContactMessage.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
