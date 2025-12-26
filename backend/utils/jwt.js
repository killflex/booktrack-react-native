const jwt = require("jsonwebtoken");

/**
 * Generate JWT token for user
 * @param {number} userId - User ID
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const payload = {
    userId,
    iat: Math.floor(Date.now() / 1000),
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || "24h",
  });

  return token;
};

/**
 * Verify JWT token and extract payload
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const err = new Error("Token has expired");
      err.statusCode = 401;
      err.code = "TOKEN_EXPIRED";
      throw err;
    } else if (error.name === "JsonWebTokenError") {
      const err = new Error("Invalid token");
      err.statusCode = 401;
      err.code = "INVALID_TOKEN";
      throw err;
    }
    throw error;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
