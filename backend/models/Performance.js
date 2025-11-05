import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    skills: [String],
    projects: [String],
    achievements: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Performance", performanceSchema);