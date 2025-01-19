import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert 
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

export default function NewThoughts({ navigation }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("journals");
  const [searchTerm, setSearchTerm] = useState("");
  const [mood, setMood] = useState("😊");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [journalEntries, setJournalEntries] = useState([]);
  const [gratitudeMoments, setGratitudeMoments] = useState([]);

  // useEffect(() => {
  //   const fetchEntries = async () => {
  //     if (!user) return;

  //     const userId = user.uid;
  //     const journalQuery = query(
  //       collection(db, `users/${userId}/entries`),
  //       where("type", "==", "journal")
  //     );
  //     const gratitudeQuery = query(
  //       collection(db, `users/${userId}/entries`),
  //       where("type", "==", "gratitude")
  //     );

  //     try {
  //       const journalSnapshot = await getDocs(journalQuery);
  //       const gratitudeSnapshot = await getDocs(gratitudeQuery);

  //       const journals = journalSnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //         entryDate: formatDate(doc.data().createdAt),
  //       }));
  //       const gratitudes = gratitudeSnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //         entryDate: formatDate(doc.data().createdAt),
  //       }));

  //       setJournalEntries(journals);
  //       setGratitudeMoments(gratitudes);
  //     } catch (error) {
  //       console.error("Error fetching entries: ", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchEntries();
  // }, [user]);

   useFocusEffect(
      useCallback(() => {
        const fetchEntries = async () => {
          if (!user) return;
    
          const userId = user.uid;
          const journalQuery = query(
            collection(db, `users/${userId}/entries`),
            where("type", "==", "journal")
          );
          const gratitudeQuery = query(
            collection(db, `users/${userId}/entries`),
            where("type", "==", "gratitude")
          );
    
          try {
            const journalSnapshot = await getDocs(journalQuery);
            const gratitudeSnapshot = await getDocs(gratitudeQuery);
    
            const journals = journalSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              entryDate: formatDate(doc.data().createdAt),
            }));
            const gratitudes = gratitudeSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              entryDate: formatDate(doc.data().createdAt),
            }));
    
            setJournalEntries(journals);
            setGratitudeMoments(gratitudes);
          } catch (error) {
            console.error("Error fetching entries: ", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchEntries();
      }, [])
    );

  // Function to format the Firebase Timestamp to a readable date string
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate(); // Converts the Firebase Timestamp to a JavaScript Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Filter entries based on the search term
  const filteredJournals = journalEntries.filter((item) =>
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGratitudeMoments = gratitudeMoments.filter((item) =>
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate mood distribution
  const calculateMoodDistribution = (entries) => {
    const moodCount = {};
    entries.forEach((entry) => {
      moodCount[entry.mood] = (moodCount[entry.mood] || 0) + 1;
    });
    return moodCount;
  };

  const moodDistribution = calculateMoodDistribution([
    ...filteredJournals,
    ...filteredGratitudeMoments,
  ]);

  const handleStartReflection = () => {
    setModalVisible(true);
  };

  const handleAddEntry = () => {
    setModalVisible(true);
  };

  const navigateToEntryScreen = (type) => {
    setModalVisible(false);
    navigation.navigate("EntryScreen", { type });
  };

  // const navigateToEntryScreen = (entry) => {
  //   setModalVisible(false);
  //   navigation.navigate("EntryScreen", { type: entry.type, existingEntry: entry });
  // };

  // const handleEditEntry = (entry) => {
  //   navigateToEntryScreen(entry);
  // };

  // const handleAddEntry = (type) => {
  //   setModalVisible(false);
  //   navigation.navigate("EntryScreen", { type });
  // };

  const handleEditEntry = (entry) => {
    navigation.navigate("EntryScreen", {
      type: entry.type,
      existingEntry: entry,
    });
  };

  const handleDeleteEntry = (entryId, type) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this entry?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const userId = user.uid;
              const entryRef = doc(db, `users/${userId}/entries`, entryId);
  
              await deleteDoc(entryRef);
  
              // Update the local state
              if (type === "journal") {
                setJournalEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== entryId));
              } else if (type === "gratitude") {
                setGratitudeMoments((prevEntries) => prevEntries.filter((entry) => entry.id !== entryId));
              }
  
              // Optional: Provide feedback to the user
              alert("Entry deleted successfully.");
            } catch (error) {
              console.error("Error deleting entry: ", error);
              alert("Failed to delete entry.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderEntry = (item) => (
    <View
      key={item.id}
      style={[
        styles.entryCard,
        item.type === "journal" ? styles.journalCard : styles.gratitudeCard,
      ]}
    >
      <Text style={styles.entryText}>
        {item.content.length > 50
          ? item.content.substring(0, 40) + "..."
          : item.content}
      </Text>
      <Text style={styles.entryMood}>{item.mood}</Text>
      <Text style={styles.entryTag}>
        {Array.isArray(item.tags) ? item.tags.join(", ") : ""}
      </Text>
      <Text style={styles.entryDate}>{item.entryDate}</Text>
      <View style={styles.entryActions}>
        <LinearGradient
          colors={["#4caf50", "#81c784"]}
          style={styles.iconButton}
        >
          <TouchableOpacity onPress={() => handleEditEntry(item)}>
            <MaterialIcons name="edit" size={20} color="white" />
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          colors={["#f44336", "#e57373"]}
          style={styles.iconButton}
        >
          <TouchableOpacity
            onPress={() => handleDeleteEntry(item.id, item.type)}
          >
            <MaterialIcons name="delete" size={20} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Thoughts</Text>
          <Text style={styles.quote}>"Reflect, Grow, and Be Grateful"</Text>
        </View>

        {/* Daily Prompt */}
        <View style={styles.dailyPromptContainer}>
          <Text style={styles.dailyPromptTitle}>Daily Prompts</Text>
          <Text style={styles.dailyPromptText}>What went well today?</Text>
          <Text style={styles.dailyPromptText}>
            What are you grateful for right now?
          </Text>
          <TouchableOpacity
            style={styles.startReflectionButton}
            onPress={handleStartReflection}
          >
            <Text style={styles.reflectionButtonText}>Start a Reflection</Text>
          </TouchableOpacity>
        </View>

        {/* Mood Tracker */}
        <View style={styles.moodTracker}>
          <Text style={styles.moodTrackerText}>How are you feeling today?</Text>
          <View style={styles.moodOptions}>
            {["😊", "😎", "😞", "😃", "😔"].map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => setMood(emoji)}
                style={styles.moodButton}
              >
                <Text style={styles.moodEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Journals or Gratitudes..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {/* Analytics */}
        <View style={styles.analyticsContainer}>
          <Text style={styles.analyticsTitle}>Analytics</Text>
          <Text style={styles.analyticsText}>
            Total Journals: {filteredJournals.length}
          </Text>
          <Text style={styles.analyticsText}>
            Total Gratitudes: {filteredGratitudeMoments.length}
          </Text>
          <Text style={styles.analyticsText}>
            Mood Distribution:{" "}
            {Object.keys(moodDistribution).map((mood) => (
              <Text key={mood}>
                {mood}: {moodDistribution[mood]}{" "}
              </Text>
            ))}
          </Text>
        </View>

        {/* Tabs for Journals/Gratitudes */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "journals" && styles.activeTab]}
            onPress={() => setActiveTab("journals")}
          >
            <Text style={styles.tabText}>Journals</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "gratitudes" && styles.activeTab]}
            onPress={() => setActiveTab("gratitudes")}
          >
            <Text style={styles.tabText}>Gratitudes</Text>
          </TouchableOpacity>
        </View>

        {/* Entries Grid */}
        <View style={styles.entriesGrid}>
          {activeTab === "journals" && filteredJournals.length === 0 && (
            <Text style={styles.motivationalText}>Start your first journal entry to reflect on your day!</Text>
          )}
          {activeTab === "gratitudes" && filteredGratitudeMoments.length === 0 && (
            <Text style={styles.motivationalText}>Write your first gratitude moment to appreciate the little things!</Text>
          )}
          {activeTab === "journals"
            ? filteredJournals.map(renderEntry)
            : filteredGratitudeMoments.map(renderEntry)}
        </View>

        {/* Add New Entry Button */}
        <TouchableOpacity
          style={styles.addEntryButton}
          onPress={handleAddEntry}
        >
          <Text style={styles.addEntryText}>+ Add Entry</Text>
        </TouchableOpacity>

        {/* Modal for Entry Options */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose Entry Type</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => navigateToEntryScreen("journal")}
              >
                <Text style={styles.modalButtonText}>Journal Entry</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => navigateToEntryScreen("gratitude")}
              >
                <Text style={styles.modalButtonText}>Gratitude Moment</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => navigateToEntryScreen("goal")}
              >
                <Text style={styles.modalButtonText}>Goal Entry</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f8f8",
    marginTop: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "PoppinsSemiBold",
  },
  quote: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#666",
    fontFamily: "PoppinsRegular",
  },
  dailyPromptContainer: {
    marginBottom: 20,
    backgroundColor: "#9D50BB",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#9D50BB",
  },
  dailyPromptTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "PoppinsSemiBold",
  },
  dailyPromptText: {
    fontSize: 16,
    color: "#fff",
    marginTop: 8,
    fontFamily: "PoppinsRegular",
  },
  startReflectionButton: {
    marginTop: 10,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 5,
  },
  reflectionButtonText: {
    fontSize: 14,
    color: "#9D50BB",
    fontFamily: "PoppinsRegular",
  },
  moodTracker: {
    marginBottom: 20,
    backgroundColor: "#fff5f8",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fff5f8",
  },
  moodTrackerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
    fontFamily: "PoppinsRegular",
  },
  moodOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  moodButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: "#fff",
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 30,
    color: "#007bff",
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    width: "100%", // Ensure the search bar spans full width
  },
  analyticsContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#ffcbf2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffcbf2",
  },
  analyticsTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#e76f51",
    fontFamily: "PoppinsSemiBold",
  },
  analyticsText: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
    fontFamily: "PoppinsRegular",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  activeTab: {
    backgroundColor: "#EF798A",
  },
  tabText: {
    fontSize: 17,
    color: "#fff",
  },
  entriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  entryCard: {
    width: "48%",
    marginVertical: 10,
    padding: 15,
    borderRadius: 8,
  },
  journalCard: {
    backgroundColor: "#A7C7E7",
  },
  gratitudeCard: {
    backgroundColor: "#B0E0E6",
  },
  entryText: {
    fontSize: 13,
    color: "black",
    fontFamily: "PoppinsRegular",
  },
  entryMood: {
    fontSize: 13,
    color: "#fffbf0",
    marginTop: 8,
  },
  entryTag: {
    fontSize: 12,
    color: "black",
    marginTop: 4,
    fontFamily: "PoppinsRegular",
  },
  entryDate: {
    fontSize: 12,
    color: "black",
    marginTop: 5,
    fontFamily: "PoppinsRegular",
    marginBottom: 8,
  },
  addEntryButton: {
    marginTop: 20,
    backgroundColor: "#9D50BB",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: "center",
  },
  addEntryText: {
    fontSize: 15,
    color: "#fff",
    fontFamily: "PoppinsRegular",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "PoppinsSemiBold",
  },
  modalButton: {
    backgroundColor: "#9D50BB",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PoppinsRegular",
  },
  modalCloseButton: {
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: "#9D50BB",
    fontSize: 16,
    fontFamily: "PoppinsRegular",
  },
  loadingContainer: {
    marginTop: 70,
    alignItems: "center",
  },
  entryActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  iconButton: {
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  motivationalText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#333",
    marginTop: 20,
    textAlign: "center",
    fontFamily: "PoppinsRegular",
  }
});
