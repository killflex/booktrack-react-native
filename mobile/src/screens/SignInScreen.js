import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { useAuth } from "../context/AuthContext";
import * as authService from "../services/authService";
import { validateEmail } from "../utils/validation";

/**
 * Sign In Screen
 * User login with email and password
 */
const SignInScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /**
   * Validate form inputs
   */
  const validateForm = () => {
    const newErrors = {};

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle sign in
   */
  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const response = await authService.login(email, password);
      // Backend returns { success, message, data: { userId, email, fullName, token } }
      const userData = {
        userId: response.data.userId,
        email: response.data.email,
        fullName: response.data.fullName,
      };
      await login(response.data.token, userData);
    } catch (error) {
      console.error("Login error:", error);

      if (error.error?.code === "INVALID_CREDENTIALS") {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: "Invalid email or password",
        });
      } else if (error.error === "NETWORK_ERROR") {
        Toast.show({
          type: "error",
          text1: "Network Error",
          text2: error.message,
        });
      } else if (error.error?.details) {
        // Handle validation errors from backend
        const backendErrors = {};
        error.error.details.forEach((err) => {
          backendErrors[err.field] = err.message;
        });
        setErrors(backendErrors);
        Toast.show({
          type: "error",
          text1: "Validation Error",
          text2: "Please check the form for errors",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: error.message || "An error occurred during login",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue to BookTrack
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <InputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <InputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              error={errors.password}
            />
          </View>

          {/* Sign In Button */}
          <Button
            title="Sign In"
            onPress={handleSignIn}
            loading={loading}
            disabled={loading}
          />

          {/* Sign Up Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4338CA",
    marginBottom: 8,
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 16,
  },
  form: {
    marginBottom: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#6B7280",
  },
  link: {
    color: "#4338CA",
    fontWeight: "600",
  },
});

export default SignInScreen;
