import jwt from "jsonwebtoken";
import { ApiError } from "../ApiError.js";
import sql from "../../config/db.js";

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const generateRefreshToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const generateAccessAndRefereshTokens = async (user) => {
  try {
    // Generate access token
    const accessToken = generateAccessToken(user);

    // Generate refresh token (you need to implement this method in your user model)
    const refreshToken = generateRefreshToken(user.id);

    // Update refresh token in the database
    await sql`
        UPDATE users
        SET refresh_token = ${refreshToken}
        WHERE id = ${user.id}
      `;

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};
