import api from "./api";

/**
 * Register a new user
 */
export const register = async (email, password, fullName) => {
  return await api.post("/auth/register", {
    email,
    password,
    fullName,
  });
};

/**
 * Login user
 */
export const login = async (email, password) => {
  return await api.post("/auth/login", {
    email,
    password,
  });
};

/**
 * Verify authentication token
 */
export const verifyToken = async () => {
  return await api.get("/auth/verify");
};
