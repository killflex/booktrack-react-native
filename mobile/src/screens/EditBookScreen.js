import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Button from "../components/Button";
import InputField from "../components/InputField";
import LoadingSpinner from "../components/LoadingSpinner";
import * as bookService from "../services/bookService";
import {
  validateBookAuthor,
  validateBookTitle,
  validatePublicationYear,
  validateRating,
} from "../utils/validation";

/**
 * EditBookScreen Component
 * Form for editing an existing book
 */
const EditBookScreen = ({ route, navigation }) => {
  const { bookId } = route.params;

  const [book, setBook] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [readingStatus, setReadingStatus] = useState("want_to_read");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const statusOptions = [
    { value: "want_to_read", label: "Want to Read" },
    { value: "currently_reading", label: "Currently Reading" },
    { value: "finished", label: "Finished" },
  ];

  /**
   * Fetch book details
   */
  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBookById(bookId);

      setBook(response.data);
      setTitle(response.data.title);
      setAuthor(response.data.author);
      setGenre(response.data.genre || "");
      setPublicationYear(
        response.data.publication_year
          ? response.data.publication_year.toString()
          : ""
      );
      setReadingStatus(response.data.reading_status);
      setRating(response.data.rating || 0);
      setNotes(response.data.notes || "");
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
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};

    const titleValidation = validateBookTitle(title);
    if (!titleValidation.isValid) {
      newErrors.title = titleValidation.message;
    }

    const authorValidation = validateBookAuthor(author);
    if (!authorValidation.isValid) {
      newErrors.author = authorValidation.message;
    }

    if (publicationYear) {
      const yearValidation = validatePublicationYear(publicationYear);
      if (!yearValidation.isValid) {
        newErrors.publicationYear = yearValidation.message;
      }
    }

    if (rating > 0) {
      const ratingValidation = validateRating(rating);
      if (!ratingValidation.isValid) {
        newErrors.rating = ratingValidation.message;
      }
    }

    if (notes.length > 2000) {
      newErrors.notes = "Notes cannot exceed 2000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setErrors({});

      const bookData = {
        title: title.trim(),
        author: author.trim(),
        genre: genre.trim() || null,
        publicationYear: publicationYear ? parseInt(publicationYear, 10) : null,
        readingStatus,
        rating: rating || null,
        notes: notes.trim() || null,
      };

      await bookService.updateBook(bookId, bookData);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Book updated successfully!",
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error updating book:", error);

      if (error.error?.details) {
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
          text1: "Error",
          text2: error.message || "Failed to update book. Please try again.",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  /**
   * Render star rating selector
   */
  const renderStarSelector = () => {
    return (
      <View style={styles.starContainer}>
        <Text style={styles.label}>Rating (Optional)</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Text style={styles.starIcon}>{star <= rating ? "★" : "☆"}</Text>
            </TouchableOpacity>
          ))}
          {rating > 0 && (
            <TouchableOpacity
              onPress={() => setRating(0)}
              style={styles.clearRating}
            >
              <Text style={styles.clearRatingText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  /**
   * Render status selector
   */
  const renderStatusSelector = () => {
    return (
      <View style={styles.statusContainer}>
        <Text style={styles.label}>Reading Status</Text>
        <View style={styles.statusOptions}>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.statusOption,
                readingStatus === option.value && styles.statusOptionActive,
              ]}
              onPress={() => setReadingStatus(option.value)}
            >
              <Text
                style={[
                  styles.statusOptionText,
                  readingStatus === option.value &&
                    styles.statusOptionTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading book..." />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Text style={styles.closeIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Book</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <InputField
            label="Title"
            placeholder="Enter book title"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
            autoCapitalize="words"
          />

          <InputField
            label="Author"
            placeholder="Enter author name"
            value={author}
            onChangeText={setAuthor}
            error={errors.author}
            autoCapitalize="words"
          />

          <InputField
            label="Genre (Optional)"
            placeholder="e.g., Fiction, Mystery, Science"
            value={genre}
            onChangeText={setGenre}
            autoCapitalize="words"
          />

          <InputField
            label="Publication Year (Optional)"
            placeholder="e.g., 2023"
            value={publicationYear}
            onChangeText={setPublicationYear}
            error={errors.publicationYear}
            keyboardType="numeric"
          />

          {renderStatusSelector()}

          {renderStarSelector()}

          {/* Notes */}
          <View style={styles.notesContainer}>
            <View style={styles.notesHeader}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <Text style={styles.charCount}>{notes.length}/2000</Text>
            </View>
            <TextInput
              style={[styles.notesInput, errors.notes && styles.inputError]}
              placeholder="Add your thoughts, quotes, or reminders..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              maxLength={2000}
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />
            {errors.notes && (
              <Text style={styles.errorText}>{errors.notes}</Text>
            )}
          </View>

          {/* Submit Button */}
          <Button
            title="Save Changes"
            onPress={handleSubmit}
            loading={saving}
            variant="primary"
          />
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
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    fontSize: 24,
    color: "#6B7280",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  form: {
    gap: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  statusContainer: {
    gap: 8,
  },
  statusOptions: {
    gap: 8,
  },
  statusOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  statusOptionActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#4338CA",
  },
  statusOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
  },
  statusOptionTextActive: {
    color: "#4338CA",
    fontWeight: "600",
  },
  starContainer: {
    gap: 8,
  },
  stars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  starIcon: {
    fontSize: 32,
    color: "#FBBF24",
  },
  clearRating: {
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
  },
  clearRatingText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  notesContainer: {
    gap: 8,
  },
  notesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  charCount: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  notesInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    minHeight: 100,
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
});

export default EditBookScreen;
