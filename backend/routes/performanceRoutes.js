import express from "express";
import {
  getAllPerformances,
  getMyPerformance,
  createPerformance,
  updatePerformance,
  deletePerformance,
} from "../controllers/performanceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllPerformances);
router.get("/me", protect, getMyPerformance);
router.post("/", protect, adminOnly, createPerformance);
router.put("/:id", protect, updatePerformance);
router.delete("/:id", protect, adminOnly, deletePerformance);

export default router;