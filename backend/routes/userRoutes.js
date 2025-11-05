import express from "express";
import {
  getAllUsers,
  getMyDetails,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllUsers);
router.get("/me", protect, getMyDetails);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;