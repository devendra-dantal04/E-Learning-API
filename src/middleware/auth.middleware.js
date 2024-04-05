import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import sql from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

export const isUser = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const userQueryRes =
      await sql`SELECT id, name, email, profile_picture FROM users where email = ${decodedToken.email}`;

    if (userQueryRes.length <= 0) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = userQueryRes[0];
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const userQueryRes =
      await sql`SELECT id, name, email, profile_picture, is_admin FROM users where email = ${decodedToken.email}`;

    if (userQueryRes.length <= 0) {
      throw new ApiError(401, "Invalid Access Token");
    }

    if (!userQueryRes[0].is_admin) {
      throw new ApiError(401, "Unauthorized request");
    }
    req.user = userQueryRes[0];

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
