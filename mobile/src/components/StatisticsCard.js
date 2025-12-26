import { StyleSheet, Text, View } from "react-native";

/**
 * StatisticsCard Component
 * Displays a statistic with count, label, and icon
 */
const StatisticsCard = ({ count, label, icon, color }) => {
  return (
    <View style={[styles.card, { borderLeftColor: color || "#4338CA" }]}>
      <View style={styles.content}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.count}>{count}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flex: 1,

    minWidth: 150,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    fontSize: 32,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  count: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 32,
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
  },
});

export default StatisticsCard;
