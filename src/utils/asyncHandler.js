import logger from "./logger.js";

const asyncHandler = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (error) {
    logger.error("An error occurred:", error);
    res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export { asyncHandler };

// Using Promise and Resolve
// const asyncHandler = (requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next))
//             .catch((err) => next(err));
//     }
// }
