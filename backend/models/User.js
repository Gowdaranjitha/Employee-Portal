import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },

    password: { type: String, required: true },

    // Employee details
    department: { type: String, default: "" },
    designation: { type: String, default: "" },
    salary: { type: Number, default: 0 },

    // Role-based access
    role: { type: String, enum: ["admin", "employee"], default: "employee" },

    dateOfJoining: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

//prevent duplicate email/phone combination
userSchema.index({ email: 1, phone: 1 }, { unique: true });

export default mongoose.model("User", userSchema);