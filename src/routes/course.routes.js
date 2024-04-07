import { Router } from "express";
import {
  createCourse,
  getCourses,
  removeCourse,
  updateCourse,
} from "../controllers/course.controller.js";
import { isAdmin, isUser } from "../middleware/auth.middleware.js";
import {
  enrollCourse,
  getEnrolledCourses,
} from "../controllers/enrollment.controller.js";

const router = Router();

router.route("/").get(isUser, getCourses);

// Secured Routes : Admin Only
router.route("/add").post(isAdmin, createCourse);
router.route("/:id").delete(isAdmin, removeCourse);
router.route("/:id").put(isAdmin, updateCourse);

// Enrollment routes
router.route("/:id/enroll").post(isUser, enrollCourse);
router.route("/enrolled-course").get(isUser, getEnrolledCourses);

export default router;
