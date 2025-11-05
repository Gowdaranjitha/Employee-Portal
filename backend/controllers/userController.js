import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// Get own details
export const getMyDetails = async (req, res) => {
  res.json(req.user);
};

// Update user (self or admin)
export const updateUser = async (req, res) => {
  const { id } = req.params;
  if (req.user.role !== "admin" && req.user._id.toString() !== id)
    return res.status(403).json({ message: "Unauthorized" });

  const updates = req.body;
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const updated = await User.findByIdAndUpdate(id, updates, { new: true });
  res.json(updated);
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};