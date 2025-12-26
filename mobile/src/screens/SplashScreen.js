import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * Splash Screen Component
 * Displays for minimum 2 seconds while checking authentication
 */
const SplashScreenComponent = ({ navigation }) => {
  const { checkAuth } = useAuth();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await checkAuth();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error("Splash screen error:", error);
        await SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BookTrack</Text>
      <Text style={styles.subtitle}>Your Personal Library Manager</Text>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4F46E5",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#E0E7FF",
    marginBottom: 32,
  },
});

export default SplashScreenComponent;
