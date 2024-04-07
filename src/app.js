import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import courseRouter from "./routes/course.routes.js";
import logger from "./utils/logger.js";

// Logging middleware
app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.path}`);
  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);

export { app };
