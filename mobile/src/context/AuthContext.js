import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";
import {
  getToken,
  getUser,
  removeToken,
  removeUser,
  saveToken,
  saveUser,
} from "../utils/storage";

// Create Auth Context
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Manages authentication state for the entire app
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Check authentication status on mount
   */
  const checkAuth = async () => {
    try {
      setIsLoading(true);

      // Get stored token
      const storedToken = await getToken();
      const storedUser = await getUser();

      if (storedToken) {
        // Verify token with backend
        try {
          const response = await authService.verifyToken();
          setToken(storedToken);
          setUser(response.user);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid, clear storage
          await removeToken();
          await removeUser();
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else if (storedUser) {
        // Clear orphaned user data
        await removeUser();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login function
   */
  const login = async (authToken, userData) => {
    try {
      // Save to AsyncStorage
      await saveToken(authToken);
      await saveUser(userData);

      // Update state
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      // Clear AsyncStorage
      await removeToken();
      await removeUser();

      // Reset state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  /**
   * Update user data
   */
  const updateUser = async (newUserData) => {
    try {
      const updatedUser = { ...user, ...newUserData };
      await saveUser(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error("Update user failed:", error);
      throw error;
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
