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
import * as bookService from "../services/bookService";

/**
 * BookDetailsScreen Component
 * Displays full book details with edit and delete actions
 */
const BookDetailsScreen = ({ route, navigation }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch book details
   */
  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBookById(bookId);
      setBook(response.data);
    } catch (error) {
      console.error("Error fetching book:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load book details",
      });
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle delete book
   */
  const handleDelete = () => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await bookService.deleteBook(bookId);
              Toast.show({
                type: "success",
                text1: "Success",
                text2: "Book deleted successfully",
              });
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting book:", error);
              Toast.show({
                type: "error",
                text1: "Error",
                text2:
                  error.message || "Failed to delete book. Please try again.",
              });
            }
          },
        },
      ]
    );
  };

  /**
   * Handle edit book
   */
  const handleEdit = () => {
    navigation.navigate("EditBook", { bookId });
  };

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /**
   * Get status display text
   */
  const getStatusText = (status) => {
    switch (status) {
      case "want_to_read":
        return "Want to Read";
      case "currently_reading":
        return "Currently Reading";
      case "finished":
        return "Finished";
      default:
        return status;
    }
  };

  /**
   * Get status badge style
   */
  const getStatusStyle = (status) => {
    switch (status) {
      case "want_to_read":
        return styles.statusWant;
      case "currently_reading":
        return styles.statusReading;
      case "finished":
        return styles.statusFinished;
      default:
        return styles.statusDefault;
    }
  };

  /**
   * Render star rating
   */
  const renderStars = (rating) => {
    if (!rating) return <Text style={styles.noRating}>No rating</Text>;

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i <= rating ? "★" : "☆"}
        </Text>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  // Refetch when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchBook();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading book..." />;
  }

  if (!book) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Book not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, getStatusStyle(book.reading_status)]}>
          <Text style={styles.statusText}>
            {getStatusText(book.reading_status)}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{book.title}</Text>

        {/* Author */}
        <Text style={styles.author}>by {book.author}</Text>

        {/* Rating */}
        <View style={styles.ratingSection}>
          <Text style={styles.sectionLabel}>Rating</Text>
          {renderStars(book.rating)}
        </View>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          {book.genre && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Genre</Text>
              <View style={styles.genreBadge}>
                <Text style={styles.genreText}>{book.genre}</Text>
              </View>
            </View>
          )}

          {book.publication_year && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Publication Year</Text>
              <Text style={styles.detailValue}>{book.publication_year}</Text>
            </View>
          )}

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Added</Text>
            <Text style={styles.detailValue}>
              {formatDate(book.created_at)}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Last Updated</Text>
            <Text style={styles.detailValue}>
              {formatDate(book.updated_at)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {book.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionLabel}>Notes</Text>
            <View style={styles.notesContainer}>
              <Text style={styles.notesText}>{book.notes}</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEdit}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>Edit Book</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>Delete Book</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#374151",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    fontSize: 20,
  },
  deleteIcon: {
    fontSize: 20,
  },
  content: {
    padding: 16,
    gap: 20,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusWant: {
    backgroundColor: "#DBEAFE",
  },
  statusReading: {
    backgroundColor: "#FEF3C7",
  },
  statusFinished: {
    backgroundColor: "#D1FAE5",
  },
  statusDefault: {
    backgroundColor: "#F3F4F6",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 36,
  },
  author: {
    fontSize: 18,
    color: "#6B7280",
    fontStyle: "italic",
  },
  ratingSection: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 4,
  },
  star: {
    fontSize: 24,
    color: "#FBBF24",
  },
  noRating: {
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  detailsGrid: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  detailItem: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    color: "#111827",
  },
  genreBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  genreText: {
    fontSize: 14,
    color: "#4338CA",
    fontWeight: "500",
  },
  notesSection: {
    gap: 8,
  },
  notesContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  notesText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 24,
  },
  actionButtons: {
    gap: 12,
    marginTop: 8,
  },
  editButton: {
    backgroundColor: "#4338CA",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  deleteButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#DC2626",
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  errorText: {
    fontSize: 16,
    color: "#6B7280",
  },
});

export default BookDetailsScreen;
