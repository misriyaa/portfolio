import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Skill } from "../model/SkillsSchema.js";
import { Project } from "../model/projectSchema.js";
import { Profile } from "../model/profileSchema.js";
import { ContactMessage } from "../model/contactMessageSchema.js";
import cloudinary from "../config/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to ensure HTTPS URL
const ensureHttps = (url) => {
  if (!url) return "";
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return url;
};

/**
 * Universal upload processor:
 * Guarantees that any uploaded file (whether via multer-storage-cloudinary, diskStorage,
 * or memoryStorage) is uploaded to Cloudinary, returning a permanent HTTPS secure_url.
 */
const uploadFileToCloudinary = async (file, folder = "portfolio") => {
  if (!file) {
    throw new Error("No file uploaded to process");
  }

  // Verify Cloudinary credentials are provided
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error(
      "Cloudinary credentials are not configured in your environment variables. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your host/Render environment settings."
    );
  }

  // 1. If multer-storage-cloudinary already uploaded the file to Cloudinary:
  if (file.path && (file.path.startsWith("http://") || file.path.startsWith("https://"))) {
    return {
      secureUrl: ensureHttps(file.path),
      publicId: file.filename || "",
    };
  }

  if (file.secure_url) {
    return {
      secureUrl: ensureHttps(file.secure_url),
      publicId: file.public_id || file.filename || "",
    };
  }

  if (file.url && (file.url.startsWith("http://") || file.url.startsWith("https://"))) {
    return {
      secureUrl: ensureHttps(file.url),
      publicId: file.public_id || file.filename || "",
    };
  }

  // 2. If multer saved the file locally to disk (diskStorage):
  if (file.path && fs.existsSync(file.path)) {
    const uploadRes = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: "image",
    });

    // Clean up local temp file after uploading to Cloudinary
    try {
      fs.unlinkSync(file.path);
    } catch (e) {
      // Ignore deletion error
    }

    return {
      secureUrl: ensureHttps(uploadRes.secure_url),
      publicId: uploadRes.public_id || "",
    };
  }

  // 3. If multer kept the file in memory buffer (memoryStorage):
  if (file.buffer) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image" },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            secureUrl: ensureHttps(result.secure_url),
            publicId: result.public_id || "",
          });
        }
      );
      stream.end(file.buffer);
    });
  }

  throw new Error("File upload failed: No valid Cloudinary URL, disk path, or memory buffer found");
};

/**
 * Checks if a legacy stored image string is a local filename.
 * If the physical file exists in backend/uploads, automatically migrates it to Cloudinary
 * and permanently updates the MongoDB document.
 */
const resolveStoredImage = async (imageString, docToUpdate = null, fieldName = "banner") => {
  if (!imageString || typeof imageString !== "string") return "";

  // Already a remote HTTP/HTTPS URL
  if (imageString.startsWith("http://") || imageString.startsWith("https://")) {
    return ensureHttps(imageString);
  }

  // Local filename: check if it physically exists in backend/uploads
  const cleanFilename = path.basename(imageString);
  const possiblePaths = [
    path.join(__dirname, "../uploads", cleanFilename),
    path.join(process.cwd(), "uploads", cleanFilename),
    path.join(process.cwd(), "backend/uploads", cleanFilename),
  ];

  for (const localPath of possiblePaths) {
    if (fs.existsSync(localPath)) {
      try {
        console.log(`Auto-migrating legacy file ${cleanFilename} to Cloudinary...`);
        const uploadRes = await cloudinary.uploader.upload(localPath, {
          folder: "portfolio",
          resource_type: "image",
        });

        const secureUrl = ensureHttps(uploadRes.secure_url);
        if (docToUpdate) {
          docToUpdate[fieldName] = secureUrl;
          if (fieldName === "banner") docToUpdate.bannerPublicId = uploadRes.public_id;
          if (fieldName === "image") docToUpdate.imagePublicId = uploadRes.public_id;
          await docToUpdate.save();
          console.log(`Successfully migrated ${cleanFilename} to ${secureUrl}`);
        }
        return secureUrl;
      } catch (migErr) {
        console.warn(`Failed to auto-migrate ${cleanFilename}:`, migErr.message);
      }
    }
  }

  // Physical file does not exist on disk
  return imageString;
};

/* ================= PROFILE & BANNER ================= */

export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    } else if (profile.banner && !profile.banner.startsWith("http")) {
      await resolveStoredImage(profile.banner, profile, "banner");
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

    // Process upload to guarantee a permanent Cloudinary HTTPS URL
    const { secureUrl, publicId } = await uploadFileToCloudinary(req.file, "portfolio");

    let profile = await Profile.findOne();

    if (profile) {
      // Clean up previous image from Cloudinary if it had a public ID
      if (profile.bannerPublicId && profile.bannerPublicId !== publicId) {
        try {
          await cloudinary.uploader.destroy(profile.bannerPublicId);
        } catch (destroyErr) {
          console.warn("Could not delete previous banner from Cloudinary:", destroyErr.message);
        }
      }

      profile.banner = secureUrl;
      profile.bannerPublicId = publicId;
      await profile.save();
    } else {
      profile = await Profile.create({
        banner: secureUrl,
        bannerPublicId: publicId,
      });
    }

    console.log("Banner saved to MongoDB with Cloudinary URL:", profile.banner);

    res.status(200).json({
      success: true,
      message: "Banner uploaded to Cloudinary and saved permanently in MongoDB",
      data: profile,
    });
  } catch (error) {
    console.error("Upload banner error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBanner = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    } else if (profile.banner && !profile.banner.startsWith("http")) {
      await resolveStoredImage(profile.banner, profile, "banner");
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

    if (!title || !String(title).trim()) {
      return res.status(400).json({
        success: false,
        message: "Skill category title is required",
      });
    }

    let cleanedSkills = [];
    if (Array.isArray(skills)) {
      cleanedSkills = skills.map((s) => String(s).trim()).filter(Boolean);
    } else if (typeof skills === "string") {
      cleanedSkills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    if (cleanedSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one valid skill is required",
      });
    }

    const trimmedTitle = String(title).trim();
    // Escape regex characters to prevent pattern compile errors
    const escapedTitle = trimmedTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Check if category already exists (case-insensitive) to prevent accidental duplicate entries
    const existingCategory = await Skill.findOne({
      title: { $regex: new RegExp(`^${escapedTitle}$`, "i") },
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
      title: trimmedTitle,
      skills: cleanedSkills,
    });

    res.status(201).json({
      success: true,
      message: "Skill category added successfully",
      data: newSkill,
    });
  } catch (error) {
    console.error("Error in addSkill:", error);
    if (error.code === 11000) {
      try {
        const cat = await Skill.findOne({ title: req.body?.title?.trim() });
        if (cat) {
          const reqSkills = Array.isArray(req.body.skills)
            ? req.body.skills.map((s) => String(s).trim()).filter(Boolean)
            : [];
          const merged = new Set([...cat.skills, ...reqSkills]);
          cat.skills = Array.from(merged);
          await cat.save();
          return res.status(200).json({
            success: true,
            message: `Updated existing category '${cat.title}' with new skills`,
            data: cat,
          });
        }
      } catch (innerErr) {
        console.warn("Could not merge duplicate skill category:", innerErr.message);
      }
    }
    res.status(500).json({ success: false, message: error.message || "Failed to save skill" });
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
    console.error("Error in getSkills:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, skills } = req.body;

    let cleanedSkills = [];
    if (Array.isArray(skills)) {
      cleanedSkills = skills.map((s) => String(s).trim()).filter(Boolean);
    } else if (typeof skills === "string") {
      cleanedSkills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill category not found",
      });
    }

    if (title && String(title).trim()) skill.title = String(title).trim();
    if (cleanedSkills.length > 0) skill.skills = cleanedSkills;

    await skill.save();

    res.status(200).json({
      success: true,
      message: "Skill category updated successfully",
      data: skill,
    });
  } catch (error) {
    console.error("Error in updateSkill:", error);
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

    // Process upload to guarantee a permanent Cloudinary HTTPS URL
    const { secureUrl, publicId } = await uploadFileToCloudinary(req.file, "portfolio");

    const project = await Project.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      liveLink: liveLink ? liveLink.trim() : "",
      githubLink: githubLink ? githubLink.trim() : "",
      image: secureUrl,
      imagePublicId: publicId,
    });

    console.log("Project created with Cloudinary image URL:", project.image);

    res.status(201).json({
      success: true,
      message: "Project created successfully with Cloudinary image",
      data: project,
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    // Auto-migrate any local project images if they physically exist
    for (const proj of projects) {
      if (proj.image && !proj.image.startsWith("http")) {
        await resolveStoredImage(proj.image, proj, "image");
      }
    }

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.image && !project.image.startsWith("http")) {
      await resolveStoredImage(project.image, project, "image");
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Error in getProjectById:", error);
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

    // If a new image was uploaded
    if (req.file) {
      const { secureUrl, publicId } = await uploadFileToCloudinary(req.file, "portfolio");

      if (project.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(project.imagePublicId);
        } catch (destroyErr) {
          console.warn("Could not destroy old project image:", destroyErr.message);
        }
      }

      project.image = secureUrl;
      project.imagePublicId = publicId;
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
