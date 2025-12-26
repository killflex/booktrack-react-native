import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

/**
 * Reusable Loading Spinner Component
 */
const LoadingSpinner = ({
  size = "large",
  color = "#4F46E5",
  text = "",
  fullScreen = false,
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  text: {
    color: "#4B5563",
    marginTop: 16,
    fontSize: 16,
  },
});

export default LoadingSpinner;
