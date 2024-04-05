import sql from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessAndRefereshTokens } from "../utils/services/user.services.js";
import { uploadOnCloudinary } from "../utils/services/cloudinary.services.js";

// Utility Function

// Function to check if an email is already registered
const isEmailUnique = async (email) => {
  const result =
    await sql`SELECT COUNT(*) AS user_count FROM users WHERE email = ${email}`;

  return result[0].user_count == 0;
};

// Function to check password strength
const isPasswordStrong = (password) => {
  return password.length >= 8; // Example: Password must be at least 8 characters long
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  console.log(name, email, password);

  const profile_picture = req?.file?.path;

  // Checking if all fields are received
  if (!name || !email || !password || !profile_picture) {
    throw new ApiError(400, "All fields are required.");
  }

  // Check if email is unique
  const emailUnique = await isEmailUnique(email);

  if (!emailUnique) {
    throw new ApiError(401, "Email already exists.");
  }

  // Check password strength
  if (!isPasswordStrong(password)) {
    throw new ApiError(400, "Password must be at least 8 characters long.");
  }

  // Upload the profile picture to Cloudinary
  const profilePictureUrl = await uploadOnCloudinary(profile_picture);

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the new user into the database
  await sql`
            INSERT INTO users (name, email, password, profile_picture) 
            VALUES (${name}, ${email}, ${hashedPassword}, ${profilePictureUrl})
        `;

  // Check whether user is actually created
  const userQueryRes =
    await sql`SELECT id, name, email, profile_picture FROM users WHERE email=${email}`;

  if (userQueryRes[0].length <= 0) {
    throw new ApiError(400, "Unable to register the user");
  }

  const user = userQueryRes[0];

  res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully."));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Checking if all fields are received
  if (!email || !password) {
    throw new ApiError(400, "All fields are required.");
  }

  try {
    // fetch user from the database
    const userQueryRes = await sql`SELECT * FROM users WHERE email=${email}`;

    if (userQueryRes.length <= 0) {
      throw new ApiError(401, "Invalid Credentials.");
    }

    // If user exists match the password
    const user = userQueryRes[0];

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) {
      throw new ApiError(401, "Invalid Credentials.");
    }

    // Generate Access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    const loggedInUserRes =
      await sql`SELECT id, name, email, profile_picture, refresh_token, is_admin FROM users where email=${email}`;

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUserRes[0],
            accessToken,
            refreshToken,
          },
          "User logged In Successfully"
        )
      );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error; // Re-throw the ApiError if it's already an ApiError
    } else {
      console.error("Error registering user:", error);
      throw new ApiError(500, "Internal Server Error");
    }
  }
});

export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    // Update user's account details in the database
    const updatedUser = await sql`
          UPDATE users
          SET name = ${name}, email = ${email}
          WHERE id = ${req.user.id}
          RETURNING id, name, email, profile_picture, is_admin
      `;

    // Return the updated user details
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedUser[0],
          "Account details updated successfully"
        )
      );
  } catch (error) {
    console.error("Error updating account details:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  // SQL query to get the details of the current user
  const userQueryRes =
    await sql`SELECT id, name, email, profile_picture FROM users WHERE id=${req.user.id}`;

  if (userQueryRes.length <= 0) {
    throw new ApiError(400, "user not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userQueryRes[0], "User fetched successfully"));
});

export const logoutUser = asyncHandler(async (req, res) => {
  // Update user's record in the database to remove the refreshToken
  await sql`
          UPDATE users
          SET refresh_token = NULL
          WHERE id = ${req.user.id}
          RETURNING *
      `;

  // Clear the access and refresh tokens cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});
