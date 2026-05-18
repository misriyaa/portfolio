import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      required: true,
    },
    liveLink: {
      type: String,
      default: "",
    },
    githubLink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);