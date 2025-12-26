const { verifyToken } = require("../utils/jwt");

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 * Attaches user data to req.user if valid
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: {
          code: "NO_TOKEN",
          message: "Authorization token is required",
        },
      });
    }

    // Check if header starts with 'Bearer '
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_TOKEN_FORMAT",
          message: 'Authorization header must start with "Bearer "',
        },
      });
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: "NO_TOKEN",
          message: "Authorization token is required",
        },
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user data to request object
    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: error.code || "UNAUTHORIZED",
        message: error.message || "Invalid or expired token",
      },
    });
  }
};

module.exports = authMiddleware;
