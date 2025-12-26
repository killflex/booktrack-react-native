const { pool } = require("../config/db");

/**
 * Create a new book
 * @param {number} userId - User ID
 * @param {object} bookData - Book information
 * @returns {object} Created book object
 */
const createBook = async (userId, bookData) => {
  const {
    title,
    author,
    genre,
    publicationYear,
    readingStatus,
    rating,
    notes,
  } = bookData;

  const query = `
    INSERT INTO books (
      user_id, title, author, genre, publication_year, 
      reading_status, rating, notes, created_at, updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING 
      book_id, user_id, title, author, genre, publication_year,
      reading_status, rating, notes, created_at, updated_at
  `;

  const values = [
    userId,
    title,
    author,
    genre || null,
    publicationYear || null,
    readingStatus,
    rating || null,
    notes || null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Get all books for a user with optional filters
 * @param {number} userId - User ID
 * @param {object} filters - Filter options (status, search, sortBy, sortOrder, page, limit)
 * @returns {object} Books array and pagination info
 */
const getBooksByUserId = async (userId, filters = {}) => {
  const {
    status,
    search,
    sortBy = "created_at",
    sortOrder = "DESC",
    page = 1,
    limit = 20,
  } = filters;

  // Validate and sanitize inputs
  const validSortColumns = [
    "title",
    "author",
    "created_at",
    "publication_year",
    "rating",
  ];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "created_at";
  const sortDirection = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";
  const itemsPerPage = Math.min(Math.max(1, parseInt(limit) || 20), 100);
  const offset = (Math.max(1, parseInt(page) || 1) - 1) * itemsPerPage;

  // Build WHERE clause
  let whereConditions = ["user_id = $1"];
  let queryParams = [userId];
  let paramCounter = 2;

  if (status) {
    whereConditions.push(`reading_status = $${paramCounter}`);
    queryParams.push(status);
    paramCounter++;
  }

  if (search) {
    whereConditions.push(
      `(title ILIKE $${paramCounter} OR author ILIKE $${paramCounter})`
    );
    queryParams.push(`%${search}%`);
    paramCounter++;
  }

  const whereClause = whereConditions.join(" AND ");

  // Query for books
  const booksQuery = `
    SELECT 
      book_id, user_id, title, author, genre, publication_year,
      reading_status, rating, notes, created_at, updated_at
    FROM books
    WHERE ${whereClause}
    ORDER BY ${sortColumn} ${sortDirection}
    LIMIT $${paramCounter} OFFSET $${paramCounter + 1}
  `;

  queryParams.push(itemsPerPage, offset);

  // Query for total count
  const countQuery = `
    SELECT COUNT(*) as total
    FROM books
    WHERE ${whereClause}
  `;

  const [booksResult, countResult] = await Promise.all([
    pool.query(booksQuery, queryParams),
    pool.query(countQuery, queryParams.slice(0, paramCounter - 1)),
  ]);

  const totalBooks = parseInt(countResult.rows[0].total);
  const totalPages = Math.ceil(totalBooks / itemsPerPage);

  return {
    books: booksResult.rows,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalBooks,
      booksPerPage: itemsPerPage,
    },
  };
};

/**
 * Get a single book by ID
 * @param {number} bookId - Book ID
 * @returns {object|null} Book object or null
 */
const getBookById = async (bookId) => {
  const query = `
    SELECT 
      book_id, user_id, title, author, genre, publication_year,
      reading_status, rating, notes, created_at, updated_at
    FROM books
    WHERE book_id = $1
  `;

  const result = await pool.query(query, [bookId]);
  return result.rows[0] || null;
};

/**
 * Update a book
 * @param {number} bookId - Book ID
 * @param {object} bookData - Updated book information
 * @returns {object} Updated book object
 */
const updateBook = async (bookId, bookData) => {
  const {
    title,
    author,
    genre,
    publicationYear,
    readingStatus,
    rating,
    notes,
  } = bookData;

  const query = `
    UPDATE books
    SET 
      title = $1,
      author = $2,
      genre = $3,
      publication_year = $4,
      reading_status = $5,
      rating = $6,
      notes = $7,
      updated_at = CURRENT_TIMESTAMP
    WHERE book_id = $8
    RETURNING 
      book_id, user_id, title, author, genre, publication_year,
      reading_status, rating, notes, created_at, updated_at
  `;

  const values = [
    title,
    author,
    genre || null,
    publicationYear || null,
    readingStatus,
    rating || null,
    notes || null,
    bookId,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Delete a book
 * @param {number} bookId - Book ID
 * @returns {boolean} Success status
 */
const deleteBook = async (bookId) => {
  const query = `
    DELETE FROM books
    WHERE book_id = $1
  `;

  const result = await pool.query(query, [bookId]);
  return result.rowCount > 0;
};

/**
 * Get statistics for a user's book collection
 * @param {number} userId - User ID
 * @returns {object} Statistics object
 */
const getStatistics = async (userId) => {
  // Get counts by status
  const statusQuery = `
    SELECT 
      COUNT(*) as total_books,
      COUNT(*) FILTER (WHERE reading_status = 'want_to_read') as want_to_read,
      COUNT(*) FILTER (WHERE reading_status = 'currently_reading') as currently_reading,
      COUNT(*) FILTER (WHERE reading_status = 'finished') as finished
    FROM books
    WHERE user_id = $1
  `;

  // Get counts by genre
  const genreQuery = `
    SELECT genre, COUNT(*) as count
    FROM books
    WHERE user_id = $1 AND genre IS NOT NULL
    GROUP BY genre
    ORDER BY count DESC
    LIMIT 10
  `;

  // Get average rating
  const ratingQuery = `
    SELECT 
      AVG(rating)::DECIMAL(3,1) as average_rating,
      COUNT(*) FILTER (WHERE rating IS NOT NULL) as rated_books
    FROM books
    WHERE user_id = $1
  `;

  // Get recently added books
  const recentQuery = `
    SELECT book_id, title, author, created_at
    FROM books
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 5
  `;

  const [statusResult, genreResult, ratingResult, recentResult] =
    await Promise.all([
      pool.query(statusQuery, [userId]),
      pool.query(genreQuery, [userId]),
      pool.query(ratingQuery, [userId]),
      pool.query(recentQuery, [userId]),
    ]);

  const statusData = statusResult.rows[0];
  const genreData = {};
  genreResult.rows.forEach((row) => {
    genreData[row.genre] = parseInt(row.count);
  });

  return {
    totalBooks: parseInt(statusData.total_books),
    byStatus: {
      wantToRead: parseInt(statusData.want_to_read),
      currentlyReading: parseInt(statusData.currently_reading),
      finished: parseInt(statusData.finished),
    },
    byGenre: genreData,
    averageRating: parseFloat(ratingResult.rows[0].average_rating) || null,
    ratedBooks: parseInt(ratingResult.rows[0].rated_books),
    recentlyAdded: recentResult.rows,
  };
};

module.exports = {
  createBook,
  getBooksByUserId,
  getBookById,
  updateBook,
  deleteBook,
  getStatistics,
};
