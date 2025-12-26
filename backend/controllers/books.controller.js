const { validationResult } = require("express-validator");
const {
  createBook,
  getBooksByUserId,
  getBookById,
  updateBook,
  deleteBook,
  getStatistics,
} = require("../models/book.model");

/**
 * Create a new book
 * POST /api/books
 */
const createBookController = async (req, res, next) => {
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

    const userId = req.user.userId;
    const bookData = req.body;

    // Create book in database
    const book = await createBook(userId, bookData);

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all books for the authenticated user
 * GET /api/books
 */
const getBooksController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const filters = {
      status: req.query.status,
      search: req.query.search,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      page: req.query.page,
      limit: req.query.limit,
    };

    // Get books with pagination
    const result = await getBooksByUserId(userId, filters);

    // Get statistics
    const statistics = await getStatistics(userId);

    res.status(200).json({
      success: true,
      data: {
        books: result.books,
        pagination: result.pagination,
        statistics: {
          totalBooks: statistics.totalBooks,
          wantToRead: statistics.byStatus.wantToRead,
          currentlyReading: statistics.byStatus.currentlyReading,
          finished: statistics.byStatus.finished,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single book by ID
 * GET /api/books/:bookId
 */
const getBookByIdController = async (req, res, next) => {
  try {
    const bookId = parseInt(req.params.bookId);
    const userId = req.user.userId;

    if (isNaN(bookId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ID",
          message: "Book ID must be a valid number",
        },
      });
    }

    // Get book from database
    const book = await getBookById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: {
          code: "BOOK_NOT_FOUND",
          message: "Book not found",
        },
      });
    }

    // Check ownership
    if (book.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to access this book",
        },
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a book
 * PUT /api/books/:bookId
 */
const updateBookController = async (req, res, next) => {
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

    const bookId = parseInt(req.params.bookId);
    const userId = req.user.userId;

    if (isNaN(bookId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ID",
          message: "Book ID must be a valid number",
        },
      });
    }

    // Check if book exists and user owns it
    const existingBook = await getBookById(bookId);

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        error: {
          code: "BOOK_NOT_FOUND",
          message: "Book not found",
        },
      });
    }

    if (existingBook.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to update this book",
        },
      });
    }

    // Update book
    const updatedBook = await updateBook(bookId, req.body);

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a book
 * DELETE /api/books/:bookId
 */
const deleteBookController = async (req, res, next) => {
  try {
    const bookId = parseInt(req.params.bookId);
    const userId = req.user.userId;

    if (isNaN(bookId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ID",
          message: "Book ID must be a valid number",
        },
      });
    }

    // Check if book exists and user owns it
    const book = await getBookById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: {
          code: "BOOK_NOT_FOUND",
          message: "Book not found",
        },
      });
    }

    if (book.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to delete this book",
        },
      });
    }

    // Delete book
    await deleteBook(bookId);

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get statistics for user's book collection
 * GET /api/books/statistics
 */
const getStatisticsController = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const statistics = await getStatistics(userId);

    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBookController,
  getBooksController,
  getBookByIdController,
  updateBookController,
  deleteBookController,
  getStatisticsController,
};
