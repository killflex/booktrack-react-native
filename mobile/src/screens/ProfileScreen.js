import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import LoadingSpinner from "../components/LoadingSpinner";
import StatisticsCard from "../components/StatisticsCard";
import { useAuth } from "../context/AuthContext";
import * as bookService from "../services/bookService";

/**
 * ProfileScreen Component
 * Displays user information, statistics, and logout button
 */
const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch statistics
   */
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const stats = await bookService.getStatistics();
      setStatistics(stats.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load statistics",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error("Logout error:", error);
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Failed to logout. Please try again.",
            });
          }
        },
      },
    ]);
  };

  /**
   * Calculate average rating
   */
  const calculateAverageRating = () => {
    if (!statistics || !statistics.averageRating) {
      return "N/A";
    }
    return statistics.averageRating.toFixed(1);
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  // Refetch when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchStatistics();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading profile..." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.fullName?.charAt(0).toUpperCase() || "U"}
          </Text>
        </View>
        <Text style={styles.name}>{user?.fullName || "User"}</Text>
        <Text style={styles.email}>{user?.email || "email@example.com"}</Text>
      </View>

      {/* Statistics Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reading Statistics</Text>

        {statistics && (
          <>
            <View style={styles.statsGrid}>
              <StatisticsCard
                count={statistics.totalBooks || 0}
                label="Total Books"
                icon="📚"
                color="#4338CA"
              />
              <StatisticsCard
                count={statistics.byStatus?.wantToRead || 0}
                label="Want to Read"
                icon="📖"
                color="#2563EB"
              />
            </View>

            <View style={styles.statsGrid}>
              <StatisticsCard
                count={statistics.byStatus?.currentlyReading || 0}
                label="Currently Reading"
                icon="📕"
                color="#F59E0B"
              />
              <StatisticsCard
                count={statistics.byStatus?.finished || 0}
                label="Finished"
                icon="✅"
                color="#10B981"
              />
            </View>

            {/* Average Rating */}
            <View style={styles.averageRatingCard}>
              <Text style={styles.averageRatingLabel}>Average Rating</Text>
              <View style={styles.averageRatingContent}>
                <Text style={styles.averageRatingValue}>
                  {calculateAverageRating()}
                </Text>
                <Text style={styles.averageRatingStar}>★</Text>
              </View>
              <Text style={styles.averageRatingSubtext}>
                Based on {statistics.ratedBooks || 0} rated books
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.6}>
          <Text style={styles.menuItemIcon}>👤</Text>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <Text style={styles.menuItemSubtext}>Update your information</Text>
          </View>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.6}>
          <Text style={styles.menuItemIcon}>⚙️</Text>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Settings</Text>
            <Text style={styles.menuItemSubtext}>App preferences</Text>
          </View>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.6}
          onPress={() => navigation.navigate("About")}
        >
          <Text style={styles.menuItemIcon}>ℹ️</Text>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>About</Text>
            <Text style={styles.menuItemSubtext}>Version 1.0.0</Text>
          </View>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>BookTrack v1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4338CA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#6B7280",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  statsGrid: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    gap: 12,
    marginBottom: 12,
  },
  averageRatingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#FBBF24",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  averageRatingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  averageRatingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  averageRatingValue: {
    fontSize: 48,
    fontWeight: "700",
    color: "#111827",
  },
  averageRatingStar: {
    fontSize: 36,
    color: "#FBBF24",
  },
  averageRatingSubtext: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  menuItemSubtext: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  menuItemArrow: {
    fontSize: 24,
    color: "#D1D5DB",
  },
  logoutButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 24,
  },
});

export default ProfileScreen;
