import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "userToken";
const USER_KEY = "userData";

/**
 * Save authentication token
 */
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token:", error);
    throw error;
  }
};

/**
 * Get authentication token
 */
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

/**
 * Remove authentication token
 */
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error removing token:", error);
    throw error;
  }
};

/**
 * Save user data
 */
export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};

/**
 * Get user data
 */
export const getUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

/**
 * Remove user data
 */
export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Error removing user:", error);
    throw error;
  }
};

/**
 * Clear all stored data
 */
export const clearAll = async () => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  } catch (error) {
    console.error("Error clearing storage:", error);
    throw error;
  }
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = async () => {
  try {
    const token = await getToken();
    return !!token;
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
};
