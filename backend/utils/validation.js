const { body } = require("express-validator");

/**
 * Validation rules for user registration
 */
const registerValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage("Email must not exceed 255 characters"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),

  body("fullName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Full name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Full name must contain only letters and spaces"),
];

/**
 * Validation rules for user login
 */
const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Validation rules for creating a book
 */
const createBookValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Title must be between 1 and 255 characters"),

  body("author")
    .trim()
    .notEmpty()
    .withMessage("Author is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Author must be between 1 and 255 characters"),

  body("genre")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Genre must not exceed 100 characters"),

  body("publicationYear")
    .optional({ checkFalsy: true })
    .isInt({ min: 1000, max: 2025 })
    .withMessage("Publication year must be between 1000 and 2025"),

  body("readingStatus")
    .notEmpty()
    .withMessage("Reading status is required")
    .isIn(["want_to_read", "currently_reading", "finished"])
    .withMessage(
      "Reading status must be: want_to_read, currently_reading, or finished"
    ),

  body("rating")
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("notes")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Notes must not exceed 2000 characters"),
];

/**
 * Validation rules for updating a book (same as create)
 */
const updateBookValidation = createBookValidation;

module.exports = {
  registerValidation,
  loginValidation,
  createBookValidation,
  updateBookValidation,
};
