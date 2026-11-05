import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables immediately before anything else
dotenv.config();
dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./config/cloudinary.js";

import {
  addSkill,
  getSkills,
  updateSkill,
  deleteSkill,
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  uploadBanner,
  getBanner,
  getProfile,
  updateProfile,
  submitContactMessage,
  getContactMessages,
  deleteContactMessage,
} from "./controller/controller.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer Storage configured with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "portfolio",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max limit
});

// Static uploads folder for backward compatibility
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health Check API
app.get("/api/health", (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: isConnected ? "ok" : "degraded",
    database: isConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

/* ================= ROUTES ================= */

// Public & Owner Profile Routes (Banner + Owner Contact Information)
app.get("/api/profile", getProfile);
app.put("/api/admin/profile", updateProfile);

// Banner Routes
app.get("/api/admin/banner", getBanner);
app.post("/api/admin/banner", upload.single("banner"), uploadBanner);

// Skills Routes
app.get("/api/admin", getSkills);
app.get("/api/admin/skills", getSkills);
app.post("/api/admin", addSkill);
app.post("/api/admin/skills", addSkill);
app.put("/api/admin/skills/:id", updateSkill);
app.delete("/api/admin/skills/:id", deleteSkill);

// Projects Routes
app.get("/api/admin/projects", getProjects);
app.post("/api/admin/projects", upload.single("image"), createProject);
app.put("/api/admin/projects/:id", upload.single("image"), updateProject);
app.delete("/api/admin/projects/:id", deleteProject);

// Visitor Contact Message Routes
app.post("/api/contact", submitContactMessage);
app.get("/api/admin/messages", getContactMessages);
app.delete("/api/admin/messages/:id", deleteContactMessage);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error occurred",
  });
});

// Database Connection & Server Startup
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL environment variable is missing!");
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running and accepting requests on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Critical: Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
};

startServer();
