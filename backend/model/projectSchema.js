import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Project image URL is required"],
      trim: true,
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    liveLink: {
      type: String,
      default: "",
      trim: true,
    },
    githubLink: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
