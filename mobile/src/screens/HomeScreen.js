import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import BookCard from "../components/BookCard";
import LoadingSpinner from "../components/LoadingSpinner";
import StatisticsCard from "../components/StatisticsCard";
import { useAuth } from "../context/AuthContext";
import * as bookService from "../services/bookService";

/**
 * HomeScreen Component
 * Main screen displaying book list, statistics, and filters
 */
const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { key: "all", label: "All" },
    { key: "want_to_read", label: "Want to Read" },
    { key: "currently_reading", label: "Reading" },
    { key: "finished", label: "Finished" },
  ];

  /**
   * Fetch books from API
   */
  const fetchBooks = async () => {
    try {
      const response = await bookService.getBooks();
      setBooks(response.data.books || []);
      applyFilters(response.data.books || [], activeTab, searchQuery);
    } catch (error) {
      console.error("Error fetching books:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load books",
      });
    }
  };

  /**
   * Fetch statistics from API
   */
  const fetchStatistics = async () => {
    try {
      const stats = await bookService.getStatistics();
      setStatistics(stats.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  /**
   * Load data on mount
   */
  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchBooks(), fetchStatistics()]);
    setLoading(false);
  };

  /**
   * Pull to refresh handler
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchBooks(), fetchStatistics()]);
    setRefreshing(false);
  }, []);

  /**
   * Apply filters based on tab and search query
   */
  const applyFilters = (bookList, tab, query) => {
    let filtered = bookList;

    // Filter by tab
    if (tab !== "all") {
      filtered = filtered.filter((book) => book.reading_status === tab);
    }

    // Filter by search query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(lowerQuery) ||
          book.author.toLowerCase().includes(lowerQuery) ||
          (book.genre && book.genre.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredBooks(filtered);
  };

  /**
   * Handle tab change
   */
  const handleTabChange = useCallback(
    (tab) => {
      setActiveTab(tab);
      applyFilters(books, tab, searchQuery);
    },
    [books, searchQuery]
  );

  /**
   * Handle search query change
   */
  const handleSearchChange = useCallback(
    (query) => {
      setSearchQuery(query);
      applyFilters(books, activeTab, query);
    },
    [books, activeTab]
  );

  /**
   * Handle book press
   */
  const handleBookPress = useCallback(
    (book) => {
      navigation.navigate("BookDetails", { bookId: book.book_id });
    },
    [navigation]
  );

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
          await logout();
        },
      },
    ]);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Refetch when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchBooks();
      fetchStatistics();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading books..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.book_id.toString()}
        renderItem={({ item }) => (
          <BookCard book={item} onPress={() => handleBookPress(item)} />
        )}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Hello, {user?.fullName}!</Text>
                <Text style={styles.subtitle}>Your Book Collection</Text>
              </View>
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.logoutButton}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>

            {/* Statistics */}
            {statistics && (
              <View style={styles.statsContainer}>
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
                <StatisticsCard
                  count={statistics.byStatus?.currentlyReading || 0}
                  label="Reading"
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
            )}

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search books, authors, genres..."
                value={searchQuery}
                onChangeText={handleSearchChange}
                placeholderTextColor="#9CA3AF"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => handleSearchChange("")}>
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tab,
                    activeTab === tab.key && styles.activeTab,
                  ]}
                  onPress={() => handleTabChange(tab.key)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab.key && styles.activeTabText,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Section Title */}
            <Text style={styles.sectionTitle}>
              {filteredBooks.length}{" "}
              {filteredBooks.length === 1 ? "Book" : "Books"}
            </Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyTitle}>No books found</Text>
            <Text style={styles.emptyText}>
              {searchQuery || activeTab !== "all"
                ? "Try adjusting your filters"
                : "Start adding books to your collection"}
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4338CA"
          />
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddBook")}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: "#DC2626",
    fontWeight: "600",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  clearIcon: {
    fontSize: 18,
    color: "#9CA3AF",
    paddingLeft: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  activeTab: {
    backgroundColor: "#4338CA",
    borderColor: "#4338CA",
  },
  tabText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4338CA",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: "#FFFFFF",
    fontWeight: "300",
  },
});

export default HomeScreen;
