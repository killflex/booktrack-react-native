const express = require("express");
const router = express.Router();

const { register, login, verify } = require("../controllers/auth.controller");
const { registerValidation, loginValidation } = require("../utils/validation");
const authMiddleware = require("../middleware/auth");

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", registerValidation, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", loginValidation, login);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify JWT token and get user data
 * @access  Private (requires valid JWT)
 */
router.get("/verify", authMiddleware, verify);

module.exports = router;
