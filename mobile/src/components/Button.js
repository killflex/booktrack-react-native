import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

/**
 * Reusable Button Component
 */
const Button = ({
  title,
  onPress,
  variant = "primary", // primary, secondary, danger, outline
  size = "medium", // small, medium, large
  disabled = false,
  loading = false,
  fullWidth = true,
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    primary: { backgroundColor: "#4338CA" },
    secondary: { backgroundColor: "#059669" },
    danger: { backgroundColor: "#DC2626" },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: "#4338CA",
    },
  };

  const variantTextStyles = {
    primary: { color: "#FFFFFF" },
    secondary: { color: "#FFFFFF" },
    danger: { color: "#FFFFFF" },
    outline: { color: "#4338CA" },
  };

  const disabledStyles = { backgroundColor: "#D1D5DB" };
  const disabledTextStyles = { color: "#6B7280" };

  // Size styles
  const sizeStyles = {
    small: { paddingVertical: 8, paddingHorizontal: 16 },
    medium: { paddingVertical: 12, paddingHorizontal: 24 },
    large: { paddingVertical: 16, paddingHorizontal: 32 },
  };

  const textSizeStyles = {
    small: { fontSize: 14 },
    medium: { fontSize: 16 },
    large: { fontSize: 18 },
  };

  const buttonStyle = [
    styles.button,
    disabled || loading ? disabledStyles : variantStyles[variant],
    sizeStyles[size],
    fullWidth && styles.fullWidth,
  ];

  const textStyle = [
    styles.text,
    disabled ? disabledTextStyles : variantTextStyles[variant],
    textSizeStyles[size],
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={buttonStyle}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? "#4F46E5" : "#FFFFFF"}
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    fontWeight: "600",
  },
});

export default Button;
