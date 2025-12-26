// API Configuration
const __DEV__ = process.env.NODE_ENV === "development";

export const API_CONFIG = {
  // Development configurations:
  // - iOS Simulator: http://localhost:3000/api
  // - Android Emulator: http://10.0.2.2:3000/api
  // - Physical Device: http://YOUR_COMPUTER_IP:3000/api (use ipconfig to find it)
  API_BASE_URL: __DEV__
    ? "http://192.168.56.1:3000/api" // Android Emulator (change to localhost for iOS)
    : "https://api.booktrack.com/api", // Production

  TIMEOUT: 10000, // 10 seconds
};
