import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";

import {
  addSkill,
  getSkills,
  createProject,
  getProjects,
  deleteProject,
  uploadBanner,
  getBanner,
} from "./controller/controller.js";

const app = express();

app.use(cors());
app.use(express.json());

/* ===== MongoDB ===== */
mongoose
  .connect("mongodb://127.0.0.1:27017/portfolio")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

/* ===== Multer ===== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ===== Static folder ===== */
app.use("/uploads", express.static("uploads"));

/* ===== ROUTES ===== */

// Skills
app.post("/api/admin", addSkill);
app.get("/api/admin", getSkills);

// Projects
app.post("/api/admin/projects", upload.single("image"), createProject);
app.get("/api/admin/projects", getProjects);
app.delete("/api/admin/projects/:id", deleteProject);

// Banner (Profile)
app.post("/api/admin/banner", upload.single("banner"), uploadBanner);
app.get("/api/admin/banner", getBanner);

/* ===== Server ===== */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});