const express = require("express");
const router = express.Router();

const {
  createBookController,
  getBooksController,
  getBookByIdController,
  updateBookController,
  deleteBookController,
  getStatisticsController,
} = require("../controllers/books.controller");

const {
  createBookValidation,
  updateBookValidation,
} = require("../utils/validation");
const authMiddleware = require("../middleware/auth");

// All book routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/books
 * @desc    Create a new book
 * @access  Private
 */
router.post("/", createBookValidation, createBookController);

/**
 * @route   GET /api/books
 * @desc    Get all books for authenticated user (with filters)
 * @access  Private
 */
router.get("/", getBooksController);

/**
 * @route   GET /api/books/statistics
 * @desc    Get statistics for user's book collection
 * @access  Private
 * @note    This must be before /:bookId route to avoid conflict
 */
router.get("/statistics", getStatisticsController);

/**
 * @route   GET /api/books/:bookId
 * @desc    Get a single book by ID
 * @access  Private
 */
router.get("/:bookId", getBookByIdController);

/**
 * @route   PUT /api/books/:bookId
 * @desc    Update a book
 * @access  Private
 */
router.put("/:bookId", updateBookValidation, updateBookController);

/**
 * @route   DELETE /api/books/:bookId
 * @desc    Delete a book
 * @access  Private
 */
router.delete("/:bookId", deleteBookController);

module.exports = router;
