import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import "./global.css";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * Main Navigation Component
 * Decides which navigator to show based on authentication state
 */
const Navigation = () => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Hide splash screen after auth check completes
    if (!isLoading) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 2000); // Minimum 2 seconds as per requirements
    }
  }, [isLoading]);

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#4F46E5",
        }}
      >
        <Text
          style={{
            fontSize: 36,
            fontWeight: "bold",
            color: "#fff",
            marginBottom: 8,
          }}
        >
          BookTrack
        </Text>
        <Text style={{ fontSize: 18, color: "#E0E7FF", marginBottom: 32 }}>
          Your Personal Library Manager
        </Text>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

/**
 * App Component
 * Root component with providers
 */
export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Navigation />
      <Toast />
    </AuthProvider>
  );
}
