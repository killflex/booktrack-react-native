import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * BookCard Component
 * Displays a book item in a list with title, author, status, and rating
 */
const BookCard = React.memo(({ book, onPress }) => {
  /**
   * Get status badge style based on reading status
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
   * Format status text for display
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
   * Render star rating
   */
  const renderStars = (rating) => {
    if (!rating) return null;

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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        {/* Title and Author */}
        <View style={styles.mainInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {book.author}
          </Text>
        </View>

        {/* Genre and Year */}
        <View style={styles.metadata}>
          {book.genre && (
            <View style={styles.genreBadge}>
              <Text style={styles.genreText}>{book.genre}</Text>
            </View>
          )}
          {book.publication_year && (
            <Text style={styles.year}>{book.publication_year}</Text>
          )}
        </View>

        {/* Status and Rating */}
        <View style={styles.footer}>
          <View
            style={[styles.statusBadge, getStatusStyle(book.reading_status)]}
          >
            <Text style={styles.statusText}>
              {getStatusText(book.reading_status)}
            </Text>
          </View>
          {renderStars(book.rating)}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    gap: 12,
  },
  mainInfo: {
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 24,
  },
  author: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  genreBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  genreText: {
    fontSize: 12,
    color: "#4338CA",
    fontWeight: "500",
  },
  year: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
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
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  star: {
    fontSize: 14,
    color: "#FBBF24",
  },
});

export default BookCard;
