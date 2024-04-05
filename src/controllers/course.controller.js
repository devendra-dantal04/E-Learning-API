import sql from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCourse = asyncHandler(async (req, res) => {
  try {
    const { title, description, category, level, instructor, price, duration } =
      req.body;

    if (
      [title, description, category, level, instructor, price, duration].some(
        (field) => field == undefined || field == ""
      )
    ) {
      throw new ApiError(400, "All fields are required.");
    }

    const courseQueryRes = await sql`
        INSERT INTO courses (title, description, category, level, instructor, price, duration)
        VALUES (${title}, ${description}, ${category}, LOWER(${level}), ${instructor}, ${price}, ${duration})
        RETURNING *;
      `;

    if (courseQueryRes.length <= 0) {
      throw new ApiError(400, "Something went wrong while creating course");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(201, courseQueryRes[0], "Course Added Successfully.")
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong.");
  }
});

export const getCourses = asyncHandler(async (req, res) => {
  try {
    // Extract filters and pagination options from request query parameters
    const {
      popularity,
      level,
      duration,
      category,
      page = 1,
      limit = 10,
    } = req.query;

    // The SQL query constructed dynamically based on the provided filters
    let query = sql`SELECT * FROM courses`;

    // Initialize filters as a sql object
    let filters = sql``;

    if (popularity) {
      filters = sql`${filters} WHERE popularity = ${popularity}`;
    } else {
      filters = sql`${filters} WHERE 1=1`;
    }

    if (level) {
      filters = sql`${filters} AND level = ${level}`;
    }

    if (duration) {
      filters = sql`${filters} AND duration = ${duration}`;
    }

    if (category) {
      filters = sql`${filters} AND category = ${category}`;
    }

    // Count total number of records
    const totalQuery = sql`SELECT COUNT(*) FROM courses ${filters}`; // Append filters to the totalQuery
    const totalResult = await totalQuery;

    // Apply pagination
    const offset = (page - 1) * limit;
    query = sql`${query} ${filters} LIMIT ${limit} OFFSET ${offset}`; // Append filters to the main query
    const courses = await query;

    // Calculate total pages
    const totalPages = Math.ceil(totalResult[0].count / limit);

    // Pagination Object
    const pagination = {
      totalRecords: totalResult[0].count,
      totalPages: totalPages,
      currentPage: page,
      pageSize: limit,
    };

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          courses,
          pagination,
        },
        "Courses fetched successfully."
      )
    );
  } catch (error) {
    throw new ApiError(500, "Something went wrong.");
  }
});

export const removeCourse = asyncHandler(async (req, res) => {
  try {
    const courseId = req.params.id;

    // Deleting the record from courses tables
    const deleteCourseQuery = sql`DELETE FROM courses WHERE id=${courseId}`;
    await deleteCourseQuery;

    // Deleting all the courses enrolled records
    const enrolledDeleteQuery = sql`DELETE FROM enrollments WHERE course_id=${courseId}`;
    await enrolledDeleteQuery;

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Successfully Deleted the Course."));
  } catch (error) {
    throw new ApiError(500, "Something went wrong.");
  }
});

export const updateCourse = asyncHandler(async (req, res) => {
  try {
    const courseId = req.params.id;

    // extrating the updated data from the request body
    const { title, description, category, level, instructor, price, duration } =
      req.body;

    // Check if all required fields are provided
    if (
      [title, description, category, level, instructor, price, duration].some(
        (field) => field == undefined || field == ""
      )
    ) {
      throw new ApiError(400, "All fields are required.");
    }

    // Construct the SQL query to update the course
    const updateQuery = sql`
    UPDATE courses 
    SET 
      title = ${title}, 
      description = ${description}, 
      category = ${category}, 
      level = ${level}, 
      instructor = ${instructor}, 
      price = ${price}, 
      duration = ${duration} 
    WHERE id = ${courseId}
    RETURNING *;`;

    // Execute the update query
    const updatedCourse = await updateQuery;

    // Check if the course was updated successfully
    if (updatedCourse.length === 0) {
      throw new ApiError(404, "Course not found."); // If no rows were affected, course with given id not found
    }

    // Send success response with updated course data
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedCourse[0], "Course updated successfully.")
      );
  } catch (error) {}
});
