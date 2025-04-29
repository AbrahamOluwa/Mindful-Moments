import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useToast } from "native-base";

export default function EntryScreen({ route, navigation }) {
  const { user } = useAuth();
  const { type, existingEntry } = route.params; // Get existingEntry from route params if available
  const [title, setTitle] = useState(existingEntry ? existingEntry.title : "");
  const [content, setContent] = useState(
    existingEntry ? existingEntry.content : ""
  );
  const [selectedMood, setSelectedMood] = useState(
    existingEntry ? existingEntry.mood : ""
  );
  const [selectedGoal, setSelectedGoal] = useState(
    existingEntry ? existingEntry.goal : ""
  );
  const [tag, setTag] = useState(
    existingEntry && existingEntry.tags ? existingEntry.tags.join(", ") : ""
  ); // Join tags with commas
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!existingEntry); // If there's no existing entry, it's a new entry
  const toast = useToast();

  const moods = ["😊", "😎", "😞", "😃", "😔"];
  const goals = [
    "None",
    "Improve Productivity",
    "Mental Wellbeing",
    "Personal Growth",
  ];

  const handleSaveEntry = async () => {
    if (!title.trim() || !content.trim() || !selectedMood) {
      toast.show({
        title: "Validation Error",
        status: "error",
        description: "Title, Content, and Mood are required.",
      });
      return;
    }

    const userId = user?.uid;
    if (!userId) {
      toast.show({
        title: "Authentication Error",
        status: "error",
        description: "You must be logged in to save an entry.",
      });
      return;
    }

    setLoading(true);

    try {
      const entry = {
        userId,
        type,
        title,
        content,
        mood: selectedMood,
        goal: selectedGoal,
        createdAt: existingEntry ? existingEntry.createdAt : serverTimestamp(),
        tags: tag ? tag.split(",").map((t) => t.trim()) : [type], // Split and trim tags
      };

      const collectionRef = collection(db, `users/${userId}/entries`);

      if (existingEntry) {
        // Update existing entry
        const entryRef = doc(collectionRef, existingEntry.id);
        await updateDoc(entryRef, entry);
      } else {
        // Add new entry
        await addDoc(collectionRef, entry);
      }

      toast.show({
        title: "Success",
        status: "success",
        description: "Entry saved successfully.",
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error saving entry: ", error);
      toast.show({
        title: "Error",
        status: "error",
        description: "Failed to save entry.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.screenTitle}>
          {type === "journal" ? "Journal Entry" : "Gratitude Moment"}
        </Text>
        {isEditing ? (
          <>
            <Text style={styles.label}>Select a Mood:</Text>
            <View style={styles.moodOptions}>
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood}
                  onPress={() => setSelectedMood(mood)}
                  style={[
                    styles.moodButton,
                    selectedMood === mood && styles.selectedMoodButton,
                  ]}
                >
                  <Text style={styles.moodEmoji}>{mood}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Select a Goal (Optional):</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedGoal}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedGoal(itemValue)}
              >
                {/* <Picker.Item label="None" value="" /> */}
                {goals.map((goal) => (
                  <Picker.Item key={goal} label={goal} value={goal} />
                ))}
              </Picker>
            </View>
            <TextInput
              style={styles.headerInput}
              placeholder="Title or Header"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.contentInput}
              multiline
              placeholder={
                type === "journal"
                  ? "Write your journal entry here..."
                  : "Write your gratitude moment here..."
              }
              value={content}
              onChangeText={setContent}
            />
            <TextInput
              style={styles.tagInput}
              multiline
              placeholder="Add a Tag (e.g., Mood, Reflection, Productivity)"
              value={tag}
              onChangeText={setTag}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveEntry}
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Entry</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          // <>
          //   <Text style={styles.content}>{content}</Text>
          //   <Text style={styles.mood}>Mood: {selectedMood}</Text>
          //   <Text style={styles.goal}>Goal: {selectedGoal}</Text>
          //   <Text style={styles.tags}>Tags: {tag}</Text>
          //   <TouchableOpacity
          //     style={styles.editButton}
          //     onPress={() => setIsEditing(true)}
          //   >
          //     <Text style={styles.editButtonText}>Edit Entry</Text>
          //   </TouchableOpacity>
          // </>

          <>
            <ScrollView contentContainerStyle={styles.scrollableCard}>
              <View style={styles.entryCard}>
                <Text style={styles.contentText}>{content}</Text>
                <Text style={styles.moodText}>
                  Mood: <Text style={styles.valueText}>{selectedMood}</Text>
                </Text>
                <Text style={styles.goalText}>
                  Goal: <Text style={styles.valueText}>{selectedGoal}</Text>
                </Text>
                <Text style={styles.tagsText}>
                  Tags: <Text style={styles.valueText}>{tag}</Text>
                </Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.editButtonText}>Edit Entry</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  screenTitle: {
    marginTop: 19,
    fontSize: 28,
    fontWeight: "bold",
    // color: "#4b0082",
    color: "#263238",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    // color: "#4b0082",
    color: "#263238",
  },
  moodOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  moodButton: {
    padding: 15,
    borderRadius: 50,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  selectedMoodButton: {
    borderColor: "#4b0082",
    backgroundColor: "#e0f7ff",
  },
  moodEmoji: {
    fontSize: 30,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  picker: {
    height: 58,
    width: "100%",
  },
  headerInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: "#fff",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  contentInput: {
    height: 550,
    // borderColor: "#ccc",
    borderColor: "#D7CCC8",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    textAlignVertical: "top",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  tagInput: {
    height: 80,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: "#fff",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  saveButton: {
    marginTop: 30,
    // backgroundColor: "#4b0082",
    backgroundColor: "#4DB6AC",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollableCard: {
    flexGrow: 1,
    padding: 10,
  },
  entryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  contentText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#333",
    lineHeight: 24,
    marginBottom: 15,
    fontFamily: "PoppinsRegular",
  },
  moodText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 8,
  },
  goalText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 8,
    fontFamily: "PoppinsRegular",
  },
  tagsText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 20,
    fontFamily: "PoppinsRegular",
  },
  valueText: {
    fontWeight: "400",
    color: "#777",
    fontFamily: "PoppinsRegular",
  },
  editButton: {
    // backgroundColor: "#4CAF50",
    backgroundColor: "#4DB6AC",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    alignSelf: "flex-start",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
