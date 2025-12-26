/**
 * Centralized error handling middleware
 * Handles all errors and returns consistent JSON responses
 */

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let code = err.code || "INTERNAL_ERROR";
  let details = err.details || [];

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400;
    code = "VALIDATION_ERROR";
  } else if (
    err.name === "UnauthorizedError" ||
    err.name === "JsonWebTokenError"
  ) {
    statusCode = 401;
    code = "UNAUTHORIZED";
    message = "Invalid or expired token";
  } else if (err.code === "23505") {
    // PostgreSQL unique violation
    statusCode = 409;
    code = "DUPLICATE_ENTRY";
    message = "Resource already exists";
  } else if (err.code === "23503") {
    // PostgreSQL foreign key violation
    statusCode = 400;
    code = "FOREIGN_KEY_VIOLATION";
    message = "Referenced resource does not exist";
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;
