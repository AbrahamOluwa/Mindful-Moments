import React, { useState } from "react";
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
  increment,
  getDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { useToast } from "native-base";

export default function EntryScreen({ route, navigation }) {
  const { user } = useAuth();
  const { type } = route.params;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [tag, setTag] = useState(""); // New state for tag
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const moods = ["😊", "😎", "😞", "😃", "😔"];
  const goals = ["Improve Productivity", "Mental Wellbeing", "Personal Growth"];

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
        createdAt: serverTimestamp(),
        tags: tag ? [tag] : [type], // Default to type if no tag is provided
      };

      const collectionRef = collection(db, `users/${userId}/entries`);
      await addDoc(collectionRef, entry);

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
            <Picker.Item label="None" value="" />
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
    color: "#4b0082",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#4b0082",
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
    height: 590, // Significantly longer text area
    borderColor: "#ccc",
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
    backgroundColor: "#4b0082",
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
});
