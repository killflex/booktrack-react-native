/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  return {
    isValid,
    message: isValid ? "" : "Please enter a valid email address",
  };
};

/**
 * Validate password strength
 * Requirements: At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export const validatePassword = (password) => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/**
 * Validate full name
 */
export const validateFullName = (fullName) => {
  const trimmed = fullName.trim();

  if (trimmed.length < 2) {
    return {
      isValid: false,
      message: "Name must be at least 2 characters long",
    };
  }

  if (trimmed.length > 50) {
    return {
      isValid: false,
      message: "Name must not exceed 50 characters",
    };
  }

  if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
    return {
      isValid: false,
      message: "Name must contain only letters and spaces",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/**
 * Validate book title
 */
export const validateBookTitle = (title) => {
  const trimmed = title.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      message: "Title is required",
    };
  }

  if (trimmed.length > 255) {
    return {
      isValid: false,
      message: "Title must not exceed 255 characters",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/**
 * Validate book author
 */
export const validateBookAuthor = (author) => {
  const trimmed = author.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      message: "Author is required",
    };
  }

  if (trimmed.length > 100) {
    return {
      isValid: false,
      message: "Author name must not exceed 100 characters",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/**
 * Validate publication year
 */
export const validatePublicationYear = (year) => {
  const numYear = parseInt(year, 10);
  const currentYear = new Date().getFullYear();

  if (isNaN(numYear)) {
    return {
      isValid: false,
      message: "Please enter a valid year",
    };
  }

  if (numYear < 1000 || numYear > currentYear + 1) {
    return {
      isValid: false,
      message: `Year must be between 1000 and ${currentYear + 1}`,
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/**
 * Validate rating
 */
export const validateRating = (rating) => {
  const numRating = parseFloat(rating);

  if (isNaN(numRating)) {
    return {
      isValid: false,
      message: "Please enter a valid rating",
    };
  }

  if (numRating < 1 || numRating > 5) {
    return {
      isValid: false,
      message: "Rating must be between 1 and 5",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};
