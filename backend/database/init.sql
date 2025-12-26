-- BookTrack Database Schema
-- This file runs automatically when the database container starts for the first time

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  book_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  publication_year INTEGER,
  reading_status VARCHAR(20) NOT NULL CHECK (reading_status IN ('want_to_read', 'currently_reading', 'finished')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_reading_status ON books(user_id, reading_status);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(user_id, title);

-- Add helpful comments
COMMENT ON TABLE users IS 'Stores user accounts for BookTrack application';
COMMENT ON TABLE books IS 'Stores book collection data for each user';
COMMENT ON COLUMN books.reading_status IS 'Values: want_to_read, currently_reading, finished';
COMMENT ON COLUMN books.rating IS 'Optional rating between 1-5 stars';
