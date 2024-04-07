import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resetPassword,
  updateAccountDetails,
  updateOldPassword,
  updatePassword,
  updateProfilePicture,
} from "../controllers/user.controller.js";
import { isUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// Public Routes
router.route("/register").post(upload.single("profile_picture"), registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/reset-password").post(resetPassword);
router.route("/reset-password/:resetToken").get(updatePassword);

// Protected Routes
router.route("/update").post(isUser, updateAccountDetails);
router.route("/update-password").post(isUser, updateOldPassword);
router.route("/").get(isUser, getCurrentUser);
router
  .route("/profile-picture")
  .patch(isUser, upload.single("profile_picture"), updateProfilePicture);
router.route("/logout").post(isUser, logoutUser);

export default router;
