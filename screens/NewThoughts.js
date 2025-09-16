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
import { BlurView } from 'expo-blur';

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
        <ActivityIndicator size="large" color="#4DB6AC" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3E5F5" }}>
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
    marginTop: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#263238",
    fontFamily: "PoppinsSemiBold",
    letterSpacing: 1,
  },
  quote: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#4DB6AC",
    fontFamily: "PoppinsRegular",
    marginTop: 8,
  },
  dailyPromptContainer: {
    marginBottom: 24,
    backgroundColor: "rgba(255,255,255,0.96)",
    padding: 18,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#4DB6AC",
    elevation: 8,
    shadowColor: "#4DB6AC",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
  },
  dailyPromptTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#263238",
    fontFamily: "PoppinsSemiBold",
    marginBottom: 6,
  },
  sectionDivider: {
    width: 40,
    height: 4,
    backgroundColor: "#4DB6AC",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  dailyPromptText: {
    fontSize: 16,
    color: "#263238",
    marginTop: 8,
    fontFamily: "PoppinsRegular",
  },
  startReflectionButton: {
    marginTop: 12,
    alignSelf: "center",
    backgroundColor: "#4DB6AC",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 3,
  },
  reflectionButtonText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "PoppinsSemiBold",
  },
  moodTracker: {
    marginBottom: 24,
    backgroundColor: "#E0F2F1",
    padding: 18,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: "#4DB6AC",
    elevation: 5,
  },
  moodTrackerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4DB6AC",
    fontFamily: "PoppinsSemiBold",
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
    elevation: 3,
    borderWidth: 1,
    borderColor: "#4DB6AC",
    justifyContent: "center",
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 30,
    color: "#4DB6AC",
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchInput: {
    height: 50,
    borderColor: "#4DB6AC",
    borderWidth: 1.2,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    width: "100%",
  },
  analyticsContainer: {
    marginBottom: 24,
    padding: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#4DB6AC",
    elevation: 6,
    shadowColor: "#4DB6AC",
    shadowOpacity: 0.09,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  analyticsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4DB6AC",
    fontFamily: "PoppinsSemiBold",
    marginBottom: 6,
  },
  analyticsText: {
    fontSize: 15,
    color: "#263238",
    marginTop: 8,
    fontFamily: "PoppinsRegular",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: "#E0F2F1",
    borderRadius: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#4DB6AC",
  },
  activeTab: {
    backgroundColor: "#4DB6AC",
  },
  tabText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "PoppinsSemiBold",
  },
  entriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  entryCard: {
    width: "48%",
    marginVertical: 12,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    elevation: 5,
    shadowColor: "#4DB6AC",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  journalCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1.2,
    borderColor: "#4DB6AC",
  },
  gratitudeCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1.2,
    borderColor: "#4DB6AC",
  },
  entryText: {
    fontSize: 14,
    color: "#263238",
    fontFamily: "PoppinsRegular",
    marginBottom: 8,
  },
  entryMood: {
    fontSize: 13,
    color: "#4DB6AC",
    marginTop: 2,
    fontFamily: "PoppinsMedium",
  },
  entryTag: {
    fontSize: 12,
    color: "#00897B",
    marginTop: 4,
    fontFamily: "PoppinsMedium",
  },
  entryDate: {
    fontSize: 12,
    color: "#78909C",
    marginTop: 6,
    fontFamily: "PoppinsRegular",
    marginBottom: 8,
  },
  addEntryButton: {
    marginTop: 28,
    backgroundColor: "#4DB6AC",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignSelf: "center",
    elevation: 4,
  },
  addEntryText: {
    fontSize: 17,
    color: "#fff",
    fontFamily: "PoppinsSemiBold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 320,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 14,
    alignItems: "center",
    elevation: 8,
    borderColor: "#4DB6AC",
    borderWidth: 1.2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 18,
    fontFamily: "PoppinsSemiBold",
    color: "#4DB6AC",
  },
  modalButton: {
    backgroundColor: "#4DB6AC",
    padding: 12,
    borderRadius: 8,
    marginVertical: 7,
    width: "100%",
    alignItems: "center",
    elevation: 2,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
  },
  modalCloseButton: {
    marginTop: 12,
  },
  modalCloseButtonText: {
    color: "#4DB6AC",
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
  },
  loadingContainer: {
    marginTop: 70,
    alignItems: "center",
  },
  entryActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 6,
  },
  iconButton: {
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#4DB6AC",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  motivationalText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#263238",
    marginTop: 24,
    textAlign: "center",
    fontFamily: "PoppinsRegular",
  },
  glassCard: {
  padding: 15,
  backgroundColor: "rgba(255,255,255,0.55)", // More transparent for glass look
  borderRadius: 14,
  borderWidth: 1.5,
  borderColor: "#4DB6AC",
  elevation: 8,
},
});
