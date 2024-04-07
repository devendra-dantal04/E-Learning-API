import sql from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessAndRefereshTokens } from "../utils/services/user.services.js";
import { uploadOnCloudinary } from "../utils/services/cloudinary.services.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/services/email.services.js";
import emailTemplates from "../utils/emailTemplate.js";

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

  // console.log(name, email, password);

  const profile_picture = req?.file?.path;

  // Checking if all fields are received
  if (!name || !email || !password || !profile_picture) {
    throw new ApiError(400, "All fields are required.");
  }

  const isEmailValid = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

  if (!isEmailValid) {
    throw new ApiError(401, "Enter Valid Email Address.");
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

  // Prepare email options
  const option = {
    to: user.email,
    subject: "Successfully Onboarded",
    text: emailTemplates?.register(user.name),
  };

  // Send email
  await sendEmail(option);

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

  const isEmailValid = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

  if (!isEmailValid) {
    throw new ApiError(401, "Enter valid email address.");
  }

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
    throw new ApiError(500, error?.message || "Internal Server Error");
  }
});

export const updateProfilePicture = asyncHandler(async (req, res) => {
  const profile_picture = req?.file?.path;

  if (!profile_picture) {
    throw new ApiError(400, "Profile Picture Required");
  }

  const userQuery = sql`SELECT id, name, email, profile_picture FROM users WHERE id=${req.user.id}`;

  const userQueryRes = await userQuery;

  if (userQueryRes.length <= 0) {
    throw new ApiError(400, "Invalid user");
  }

  // Upload the profile picture to Cloudinary
  const profilePictureUrl = await uploadOnCloudinary(profile_picture);

  if (!profilePictureUrl) {
    throw new ApiError(400, "unable to upload the profile picture");
  }

  const updateQuery =
    await sql`UPDATE users SET profile_picture=${profilePictureUrl} WHERE id=${req.user.id}`;

  const updatedUser = await userQuery;

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser[0], "Profile Picture updated"));
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

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  console.log(incomingRefreshToken);

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unathorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    console.log(decodedToken);

    const userQueryRes =
      await sql`SELECT id, name, email, profile_picture, refresh_token FROM users WHERE id=${decodedToken.id}`;

    if (userQueryRes.length <= 0) {
      throw new ApiError(401, "invalid user");
    }

    const user = userQueryRes[0];

    if (incomingRefreshToken !== user?.refresh_token) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "access Token Refreshed Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  // Extracting email from the request body
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email address required.");
  }

  // Check if user exists
  const userQueryRes =
    await sql`SELECT id, name, email FROM users WHERE email=${email}`;

  if (userQueryRes.length <= 0) {
    throw new ApiError(404, "User not found for provided email address.");
  }

  const user = userQueryRes[0];

  // Generating reset password token
  const resetToken = crypto.randomBytes(20).toString("hex");

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Update or insert the reset password token into the database
  const updateQuery = sql`UPDATE users SET reset_password_token=${resetPasswordToken} WHERE email=${user.email}`;
  await updateQuery;

  // Construct reset URL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/reset-password/${resetToken}`;

  // Prepare email options
  const option = {
    to: user.email,
    subject: "Reset Password",
    text: emailTemplates.resetPassword(user, resetUrl),
  };

  // Send email
  await sendEmail(option);

  // Respond with success message
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email sent for reset password"));
});

export const updatePassword = asyncHandler(async (req, res) => {
  try {
    const resetToken = req.params.resetToken;
    const { newPassword } = req.body;

    if (!resetToken) {
      throw new ApiError(401, "Reset token required");
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Check if user exists
    const userQueryRes =
      await sql`SELECT id, name, email FROM users WHERE reset_password_token=${resetPasswordToken}`;

    if (userQueryRes.length <= 0) {
      throw new ApiError(404, "Invalid Reset Token");
    }

    const user = userQueryRes[0];

    // Check password strength
    if (!isPasswordStrong(newPassword)) {
      throw new ApiError(400, "Password must be at least 8 characters long.");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in database
    const updateUserRes = await sql`
              UPDATE users
              SET password=${hashedPassword}, reset_password_token=NULL
              WHERE email=${user.email}
              RETURNING id, name, email, profile_picture
      `;

    // Prepare email options
    const option = {
      to: updateUserRes[0].email,
      subject: "Password Successfully reseted",
      text: emailTemplates.updatePassword(),
    };

    // Send email
    await sendEmail(option);

    // Respond with success message
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "password reseted successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Internal server error.");
  }
});

export const updateOldPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "All fields are required.");
  }

  const userQuery =
    await sql`SELECT id, name, email, password FROM users WHERE email=${req.user.email}`;

  if (userQuery.length <= 0) {
    throw new ApiError(400, "invalid user");
  }

  const user = userQuery[0];

  // Check old password is valid
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credentials");
  }

  // Check password strength
  if (!isPasswordStrong(newPassword)) {
    throw new ApiError(400, "Password must be at least 8 characters long.");
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the password in database
  const updateUserRes = await sql`
            UPDATE users
            SET password=${hashedPassword}
            WHERE email=${user.email}
            RETURNING id, name, email, profile_picture
        `;

  // Prepare email options
  const option = {
    to: updateUserRes[0].email,
    subject: "Password Successfully reseted",
    text: emailTemplates.updatePassword(),
  };

  // Send email
  await sendEmail(option);

  return res
    .status(200)
    .json(
      new ApiResponse(200, updateUserRes[0], "Password updated successfully")
    );
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
