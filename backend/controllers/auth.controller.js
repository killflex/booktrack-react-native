const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const {
  createUser,
  findUserByEmail,
  findUserById,
} = require("../models/user.model");
const { generateToken } = require("../utils/jwt");

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input data",
          details: errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
          })),
        },
      });
    }

    const { email, password, fullName } = req.body;

    // Hash password with bcrypt (10 salt rounds)
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user in database
    const user = await createUser(email, passwordHash, fullName);

    // Generate JWT token
    const token = generateToken(user.user_id);

    // Return success response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        userId: user.user_id,
        email: user.email,
        fullName: user.full_name,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input data",
          details: errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
          })),
        },
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      });
    }

    // Compare password with hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      });
    }

    // Generate JWT token
    const token = generateToken(user.user_id);

    // Return success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        userId: user.user_id,
        email: user.email,
        fullName: user.full_name,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify JWT token and return user data
 * GET /api/auth/verify
 */
const verify = async (req, res, next) => {
  try {
    // User ID is attached by auth middleware
    const userId = req.user.userId;

    // Find user by ID
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found",
        },
      });
    }

    // Return user data
    res.status(200).json({
      success: true,
      data: {
        userId: user.user_id,
        email: user.email,
        fullName: user.full_name,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  verify,
};
