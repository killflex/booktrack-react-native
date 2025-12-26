import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * AboutScreen Component
 * Displays information about the app and developer
 */
const AboutScreen = ({ navigation }) => {
  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* App Info Section */}
      <View style={styles.section}>
        <View style={styles.appIconContainer}>
          <Text style={styles.appIcon}>📚</Text>
        </View>
        <Text style={styles.appName}>BookTrack</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
        <Text style={styles.appDescription}>
          Your personal reading companion. Track, organize, and discover your
          next favorite book.
        </Text>
      </View>

      {/* Developer Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Developer Information</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>Ferry Hasan</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NPM</Text>
            <Text style={styles.infoValue}>22081010085</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Institution</Text>
            <Text style={styles.infoValue}>
              Universitas Pembangunan Nasional "Veteran" Jawa Timur
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Departement</Text>
            <Text style={styles.infoValue}>Informatika</Text>
          </View>
        </View>
      </View>

      {/* Tech Stack Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Built With</Text>

        <View style={styles.techGrid}>
          <View style={styles.techCard}>
            <Text style={styles.techIcon}>⚛️</Text>
            <Text style={styles.techName}>React Native</Text>
            <Text style={styles.techDesc}>0.81.5</Text>
          </View>

          <View style={styles.techCard}>
            <Text style={styles.techIcon}>📱</Text>
            <Text style={styles.techName}>Expo</Text>
            <Text style={styles.techDesc}>SDK 54</Text>
          </View>

          <View style={styles.techCard}>
            <Text style={styles.techIcon}>🟢</Text>
            <Text style={styles.techName}>Node.js</Text>
            <Text style={styles.techDesc}>18.x</Text>
          </View>

          <View style={styles.techCard}>
            <Text style={styles.techIcon}>🐘</Text>
            <Text style={styles.techName}>PostgreSQL</Text>
            <Text style={styles.techDesc}>15</Text>
          </View>

          <View style={styles.techCard}>
            <Text style={styles.techIcon}>🚀</Text>
            <Text style={styles.techName}>Express.js</Text>
            <Text style={styles.techDesc}>4.21</Text>
          </View>

          <View style={styles.techCard}>
            <Text style={styles.techIcon}>🐳</Text>
            <Text style={styles.techName}>Docker</Text>
            <Text style={styles.techDesc}>Latest</Text>
          </View>
        </View>
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact & Support</Text>

        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => openLink("mailto:ferryhasan10@gmail.com")}
          activeOpacity={0.7}
        >
          <Text style={styles.contactIcon}>📧</Text>
          <View style={styles.contactContent}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>ferryhasan10@gmail.com</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => openLink("https://github.com/killflex")}
          activeOpacity={0.7}
        >
          <Text style={styles.contactIcon}>💻</Text>
          <View style={styles.contactContent}>
            <Text style={styles.contactLabel}>GitHub</Text>
            <Text style={styles.contactValue}>github.com/killflex</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>Made with ❤️ by Ferry Hasan</Text>
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
  section: {
    marginBottom: 24,
  },
  appIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#4338CA",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  appIcon: {
    fontSize: 48,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  infoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  techGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  techCard: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  techIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  techName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 4,
  },
  techDesc: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
  },
  featureList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: "#4B5563",
    flex: 1,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: "#4338CA",
    fontWeight: "500",
  },
  legalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  legalText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 4,
  },
  footer: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
  },
});

export default AboutScreen;
