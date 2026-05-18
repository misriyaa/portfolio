import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    banner: String,
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);