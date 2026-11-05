import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    banner: {
      type: String,
      default: "",
    },
    bannerPublicId: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "misriya8784@gmail.com",
      trim: true,
    },
    phone: {
      type: String,
      default: "+91 8714945730",
      trim: true,
    },
    location: {
      type: String,
      default: "Kerala, India",
      trim: true,
    },
    socialLinks: {
      github: {
        type: String,
        default: "https://github.com/misriyaa",
        trim: true,
      },
      linkedin: {
        type: String,
        default: "https://www.linkedin.com/in/nafeesathul-misriya-p/",
        trim: true,
      },
      instagram: {
        type: String,
        default: "#",
        trim: true,
      },
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
