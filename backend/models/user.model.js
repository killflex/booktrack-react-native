const { pool } = require("../config/db");

/**
 * Create a new user in the database
 * @param {string} email - User email
 * @param {string} passwordHash - Hashed password
 * @param {string} fullName - User's full name
 * @returns {object} Created user object (without password hash)
 */
const createUser = async (email, passwordHash, fullName) => {
  const query = `
    INSERT INTO users (email, password_hash, full_name, created_at, updated_at)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING user_id, email, full_name, created_at
  `;

  try {
    const result = await pool.query(query, [email, passwordHash, fullName]);
    return result.rows[0];
  } catch (error) {
    // Handle unique constraint violation (duplicate email)
    if (error.code === "23505") {
      const err = new Error("Email already exists");
      err.statusCode = 409;
      err.code = "EMAIL_EXISTS";
      throw err;
    }
    throw error;
  }
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {object|null} User object with password hash or null if not found
 */
const findUserByEmail = async (email) => {
  const query = `
    SELECT user_id, email, password_hash, full_name, created_at, updated_at
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};

/**
 * Find user by ID
 * @param {number} userId - User ID
 * @returns {object|null} User object (without password hash) or null if not found
 */
const findUserById = async (userId) => {
  const query = `
    SELECT user_id, email, full_name, created_at, updated_at
    FROM users
    WHERE user_id = $1
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0] || null;
};

/**
 * Update user's updated_at timestamp
 * @param {number} userId - User ID
 * @returns {boolean} Success status
 */
const updateUserTimestamp = async (userId) => {
  const query = `
    UPDATE users
    SET updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $1
  `;

  const result = await pool.query(query, [userId]);
  return result.rowCount > 0;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserTimestamp,
};
