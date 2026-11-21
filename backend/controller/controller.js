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
 * Generates signed upload parameters for secure, direct frontend-to-Cloudinary uploads.
 * The API Secret remains strictly on the server and is never exposed to the frontend.
 */
export const getCloudinarySignature = async (req, res) => {
  try {
    console.log("[Cloudinary Signature] Incoming signature request received");
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("[Cloudinary Signature] Error: Cloudinary credentials missing in environment variables");
      return res.status(500).json({
        success: false,
        message:
          "Cloudinary credentials not configured on backend server. Please verify CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables.",
      });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = req.body?.folder || req.query?.folder || "portfolio";
    const paramsToSign = { folder, timestamp };

    console.log(`[Cloudinary Signature] Generating signature for folder: '${folder}', timestamp: ${timestamp}, cloud: '${process.env.CLOUDINARY_CLOUD_NAME}'`);

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    console.log("[Cloudinary Signature] Signature successfully generated and dispatched to client");

    res.status(200).json({
      success: true,
      data: {
        signature,
        timestamp,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        folder,
      },
    });
  } catch (error) {
    console.error("[Cloudinary Signature] Error generating signature:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
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
    console.log("[Banner Update] Received banner save request:", req.body);
    const bannerUrl = req.body?.banner || req.body?.image;
    const bannerPublicId = req.body?.bannerPublicId || req.body?.imagePublicId;

    if (
      !bannerUrl ||
      typeof bannerUrl !== "string" ||
      !bannerUrl.trim() ||
      bannerUrl.startsWith("blob:") ||
      bannerUrl.startsWith("data:") ||
      (!bannerUrl.startsWith("http://") && !bannerUrl.startsWith("https://"))
    ) {
      console.warn("[Banner Update] Rejected invalid URL format:", bannerUrl);
      return res.status(400).json({
        success: false,
        message:
          "A valid permanent Cloudinary HTTPS image URL is required. Local filenames or temporary blob previews cannot be saved.",
      });
    }

    const secureUrl = ensureHttps(bannerUrl.trim());
    const newPublicId = bannerPublicId ? String(bannerPublicId).trim() : "";

    let profile = await Profile.findOne();
    const oldPublicId = profile?.bannerPublicId;

    if (profile) {
      profile.banner = secureUrl;
      profile.bannerPublicId = newPublicId;
      await profile.save();
    } else {
      profile = await Profile.create({
        banner: secureUrl,
        bannerPublicId: newPublicId,
      });
    }

    console.log("[Banner Update] Successfully saved Cloudinary URL to MongoDB:", profile.banner);

    // Clean up replaced image from Cloudinary ONLY after MongoDB update succeeds
    if (oldPublicId && newPublicId && oldPublicId !== newPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
        console.log("[Banner Update] Cleaned up replaced previous banner from Cloudinary:", oldPublicId);
      } catch (destroyErr) {
        console.warn("[Banner Update] Note: Could not destroy previous banner from Cloudinary:", destroyErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Banner saved permanently in MongoDB with Cloudinary URL",
      data: profile,
    });
  } catch (error) {
    console.error("[Banner Update] Error updating banner:", error.message);
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
    const { title, description, liveLink, githubLink, image, imagePublicId } = req.body;
    console.log("[Project Create] Incoming project submission:", { title, hasImage: !!image });

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    if (
      !image ||
      typeof image !== "string" ||
      !image.trim() ||
      image.startsWith("blob:") ||
      image.startsWith("data:") ||
      (!image.startsWith("http://") && !image.startsWith("https://"))
    ) {
      console.warn("[Project Create] Rejected invalid project image URL format:", image);
      return res.status(400).json({
        success: false,
        message: "A valid permanent Cloudinary HTTPS image URL is required. Local filenames or temporary blobs cannot be saved.",
      });
    }

    const secureUrl = ensureHttps(image.trim());

    const project = await Project.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      liveLink: liveLink ? liveLink.trim() : "",
      githubLink: githubLink ? githubLink.trim() : "",
      image: secureUrl,
      imagePublicId: imagePublicId ? imagePublicId.trim() : "",
    });

    console.log("[Project Create] Project saved permanently in MongoDB with Cloudinary URL:", project.image);

    res.status(201).json({
      success: true,
      message: "Project created successfully with Cloudinary image",
      data: project,
    });
  } catch (error) {
    console.error("[Project Create] Error creating project:", error.message);
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
    const { title, description, liveLink, githubLink, image, imagePublicId } = req.body;
    console.log(`[Project Update] Updating project ID: ${id}`);

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

    const oldImagePublicId = project.imagePublicId;

    // If a new Cloudinary image URL was provided
    if (image && typeof image === "string" && image.trim()) {
      if (
        image.startsWith("blob:") ||
        image.startsWith("data:") ||
        (!image.startsWith("http://") && !image.startsWith("https://"))
      ) {
        console.warn("[Project Update] Rejected invalid image URL:", image);
        return res.status(400).json({
          success: false,
          message: "A valid permanent Cloudinary HTTPS image URL is required. Local filenames or temporary blobs cannot be saved.",
        });
      }

      const newSecureUrl = ensureHttps(image.trim());
      const newPublicId = imagePublicId ? imagePublicId.trim() : "";

      project.image = newSecureUrl;
      project.imagePublicId = newPublicId;

      await project.save();
      console.log("[Project Update] Project updated with new Cloudinary image URL in MongoDB:", project.image);

      // Clean up previous image from Cloudinary ONLY after MongoDB update succeeds
      if (oldImagePublicId && newPublicId && oldImagePublicId !== newPublicId) {
        try {
          await cloudinary.uploader.destroy(oldImagePublicId);
          console.log("[Project Update] Cleaned up replaced project image from Cloudinary:", oldImagePublicId);
        } catch (destroyErr) {
          console.warn("[Project Update] Could not destroy old project image:", destroyErr.message);
        }
      }
    } else {
      await project.save();
      console.log("[Project Update] Project updated without changing image.");
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("[Project Update] Error updating project:", error.message);
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
