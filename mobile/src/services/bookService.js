import api from "./api";

/**
 * Get all books for the authenticated user
 * @param {Object} params - Query parameters (readingStatus, genre, search, sortBy, sortOrder, page, limit)
 */
export const getBooks = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.readingStatus)
    queryParams.append("readingStatus", params.readingStatus);
  if (params.genre) queryParams.append("genre", params.genre);
  if (params.search) queryParams.append("search", params.search);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);

  const queryString = queryParams.toString();
  return await api.get(`/books${queryString ? `?${queryString}` : ""}`);
};

/**
 * Get a single book by ID
 */
export const getBookById = async (bookId) => {
  return await api.get(`/books/${bookId}`);
};

/**
 * Create a new book
 */
export const createBook = async (bookData) => {
  return await api.post("/books", bookData);
};

/**
 * Update an existing book
 */
export const updateBook = async (bookId, bookData) => {
  return await api.put(`/books/${bookId}`, bookData);
};

/**
 * Delete a book
 */
export const deleteBook = async (bookId) => {
  return await api.delete(`/books/${bookId}`);
};

/**
 * Get user's book statistics
 */
export const getStatistics = async () => {
  return await api.get("/books/statistics");
};
