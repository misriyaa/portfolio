import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import cloudinary from "./config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";


import {
  addSkill,
  getSkills,
  createProject,
  getProjects,
  deleteProject,
  uploadBanner,
  getBanner,
} from "./controller/controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// Multer Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "portfolio",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// Static Upload Folder
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Routes
app.post("/api/admin", addSkill);
app.get("/api/admin", getSkills);

app.post("/api/admin/projects", upload.single("image"), createProject);
app.get("/api/admin/projects", getProjects);
app.delete("/api/admin/projects/:id", deleteProject);

app.post("/api/admin/banner", upload.single("banner"), uploadBanner);
app.get("/api/admin/banner", getBanner);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});