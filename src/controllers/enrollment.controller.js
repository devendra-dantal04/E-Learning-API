import sql from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const enrollCourse = asyncHandler(async (req, res) => {
  // Extracting course id from the params
  const courseId = req.params.id;

  // Check for course with courseId is avaliable
  const courseQueryRes = await sql`SELECT * from courses WHERE id=${courseId}`;

  if (courseQueryRes.length <= 0) {
    throw new ApiError(400, "Course not found.");
  }

  // Check for if user already enrolled that course
  const userEnrollment =
    await sql`SELECT * FROM enrollments WHERE user_id=${req.user.id} AND course_id=${courseId}`;

  if (userEnrollment.length > 0) {
    throw new ApiError(400, "User already enrolled the course");
  }

  // if course present make the user enrollment in it
  const enrollmentQuery = sql`INSERT INTO enrollments(user_id, course_id) VALUES(${req.user.id}, ${courseId})`;

  const enrollmentRes = await enrollmentQuery;

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Successfully enrolled the course"));
});

export const getEnrolledCourses = asyncHandler(async (req, res) => {
  // SQL query to retrieve enrolled courses for a specific user
  const enrolledCoursesQuery = sql`
    SELECT c.*
    FROM courses c
    JOIN enrollments e ON c.id = e.course_id
    WHERE e.user_id = ${req.user.id}
  `;

  // Fetch enrolled courses
  const enrolledCourses = await enrolledCoursesQuery;

  //   Return enrolled courses
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        enrolledCourses,
      },
      "Enrolled courses fetched successfully."
    )
  );
});
