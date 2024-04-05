import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateAccountDetails,
} from "../controllers/user.controller.js";
import { isUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// Public Routes
router.route("/register").post(upload.single("profile_picture"), registerUser);
router.route("/login").post(loginUser);

// Protected Routes
router.route("/update").post(isUser, updateAccountDetails);
router.route("/").get(isUser, getCurrentUser);
router.route("/logout").post(isUser, logoutUser);

export default router;
