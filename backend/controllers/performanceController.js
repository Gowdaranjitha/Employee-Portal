import Performance from "../models/Performance.js";

// Get all performances (admin only)
export const getAllPerformances = async (req, res) => {
  const performances = await Performance.find().populate("user", "name email");
  res.json(performances);
};

// Get performance by logged-in user
export const getMyPerformance = async (req, res) => {
  const performance = await Performance.findOne({ user: req.user._id });
  res.json(performance);
};

// Create performance (admin only)
export const createPerformance = async (req, res) => {
  const newPerformance = await Performance.create(req.body);
  res.status(201).json(newPerformance);
};

// Update performance (self or admin)
export const updatePerformance = async (req, res) => {
  const performance = await Performance.findById(req.params.id);
  if (!performance)
    return res.status(404).json({ message: "Not found" });

  if (
    req.user.role !== "admin" &&
    performance.user.toString() !== req.user._id.toString()
  )
    return res.status(403).json({ message: "Unauthorized" });

  const updated = await Performance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

// Delete performance (admin only)
export const deletePerformance = async (req, res) => {
  await Performance.findByIdAndDelete(req.params.id);
  res.json({ message: "Performance deleted" });
};