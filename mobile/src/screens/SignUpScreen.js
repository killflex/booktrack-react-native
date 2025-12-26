import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { useAuth } from "../context/AuthContext";
import * as authService from "../services/authService";
import {
  validateEmail,
  validateFullName,
  validatePassword,
} from "../utils/validation";

/**
 * Sign Up Screen
 * User registration with email, password, and full name
 */
const SignUpScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /**
   * Validate form inputs
   */
  const validateForm = () => {
    const newErrors = {};

    const nameValidation = validateFullName(fullName);
    if (!nameValidation.isValid) {
      newErrors.fullName = nameValidation.message;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle sign up
   */
  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const response = await authService.register(email, password, fullName);

      // Backend returns { success, message, data: { userId, email, fullName, token } }
      const userData = {
        userId: response.data.userId,
        email: response.data.email,
        fullName: response.data.fullName,
      };
      await login(response.data.token, userData);

      Alert.alert("Success", "Account created successfully!");
    } catch (error) {
      console.error("Registration error:", error);

      if (error.error?.code === "DUPLICATE_EMAIL") {
        setErrors({ email: "Email already exists" });
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: "This email is already registered",
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
          text1: "Registration Failed",
          text2: error.message || "An error occurred during registration",
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Sign up to start tracking your books
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <InputField
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              autoCapitalize="words"
              error={errors.fullName}
            />

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

            <InputField
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              error={errors.confirmPassword}
            />
          </View>

          {/* Password Requirements */}
          <View style={styles.requirements}>
            <Text style={styles.requirementsTitle}>Password must contain:</Text>
            <Text style={styles.requirementsText}>• At least 8 characters</Text>
            <Text style={styles.requirementsText}>• One uppercase letter</Text>
            <Text style={styles.requirementsText}>• One lowercase letter</Text>
            <Text style={styles.requirementsText}>• One number</Text>
          </View>

          {/* Sign Up Button */}
          <Button
            title="Sign Up"
            onPress={handleSignUp}
            loading={loading}
            disabled={loading}
          />

          {/* Sign In Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.link}>Sign In</Text>
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
  requirements: {
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#EEF2FF",
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
  requirementsText: {
    fontSize: 12,
    color: "#6B7280",
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

export default SignUpScreen;
