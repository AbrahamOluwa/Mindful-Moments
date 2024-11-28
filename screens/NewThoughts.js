import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

export default function NewThoughts({ navigation }) {
  const [activeTab, setActiveTab] = useState("journals");
  const [searchTerm, setSearchTerm] = useState("");
  const [mood, setMood] = useState("😊");

  const sampleJournals = [
    {
      id: "1",
      content: "Felt more focused after meditating.",
      mood: "😊",
      tags: ["Productivity"],
      date: "2024-11-28",
    },
    {
      id: "2",
      content: "Achieved a personal goal today!",
      mood: "😎",
      tags: ["Goals"],
      date: "2024-11-27",
    },
    {
      id: "3",
      content: "Achieved a personal love today!",
      mood: "😎",
      tags: ["Goals"],
      date: "2024-11-27",
    },
    {
      id: "4",
      content: "Achieved a personal greatness today!",
      mood: "😎",
      tags: ["Goals"],
      date: "2024-11-27",
    },
  ];

  const sampleGratitudes = [
    {
      id: "1",
      content: "Grateful for my supportive friends!",
      mood: "😊",
      tags: ["Relationships"],
      date: "2024-11-28",
    },
    {
      id: "2",
      content: "Thankful for a productive day at work.",
      mood: "😊",
      tags: ["Work"],
      date: "2024-11-27",
    },
  ];

  // const goals = ['Improve Productivity', 'Mental Wellbeing', 'Personal Growth'];

  const filteredJournals = sampleJournals.filter((item) =>
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredGratitudes = sampleGratitudes.filter((item) =>
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle analytics (example counts)
  const totalJournals = filteredJournals.length;
  const totalGratitudes = filteredGratitudes.length;
  const moodDistribution = { "😊": 5, "😎": 2 };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilteredJournals(
      sampleJournals.filter((entry) =>
        entry.text.toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredGratitudes(
      sampleGratitudes.filter((entry) =>
        entry.text.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
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
          Total Journals: {totalJournals}
        </Text>
        <Text style={styles.analyticsText}>
          Total Gratitudes: {totalGratitudes}
        </Text>
        <Text style={styles.analyticsText}>
          Mood Distribution: 😊: {moodDistribution["😊"]}, 😎:{" "}
          {moodDistribution["😎"]}
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
        {(activeTab === "journals" ? filteredJournals : filteredGratitudes).map(
          (item) => (
            <View
              key={item.id}
              style={[styles.entryCard, { backgroundColor: getRandomColor() }]}
            >
              <Text style={styles.entryText}>{item.content}</Text>
              <Text style={styles.entryMood}>{item.mood}</Text>
              <Text style={styles.entryTag}>{item.tags.join(", ")}</Text>
              <Text style={styles.entryDate}>{item.date}</Text>
            </View>
          )
        )}
      </View>

      {/* Add New Entry Button */}
      <TouchableOpacity style={styles.addEntryButton}>
        <Text style={styles.addEntryText}>+ Add Entry</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Helper function to generate random background color
const getRandomColor = () => {
//   const colors = [
//     "#FF6347",
//     "#98FB98",
//     "#87CEFA",
//     "#FFD700",
//     "#32CD32",
//     "#FF4500",
//   ];
  const colors = [
    "#A7C7E7",
    "#89CFF0",
    "#7EC8B8",
    "#9ACD32",
    "#B0E0E6",
    "#ADD8E6",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

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
    //backgroundColor: "#fff3e0",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#9D50BB",
    // borderColor: "#ff9800",
  },
  dailyPromptTitle: {
    fontSize: 20,
    fontWeight: "bold",
    // color: "#ff9800",
    color: "#fff",
    fontFamily: "PoppinsSemiBold",
  },
  dailyPromptText: {
    fontSize: 16,
    color: "#333",
    color: "#fff",
    marginTop: 8,
    fontFamily: "PoppinsRegular",
  },
  moodTracker: {
    marginBottom: 20,
    backgroundColor: "#fff5f8",
    // backgroundColor: "#f0f8ff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fff5f8",
    // borderColor: "#add8e6",
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
    // backgroundColor: "#ffebcd",
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
    fontSize: 15,
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
    // backgroundColor: "#4CAF50",
    backgroundColor: "#EF798A",
  },
  tabText: {
    fontSize: 18,
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
  entryText: {
    fontSize: 15,
    color: "#fff",
    fontFamily: "PoppinsRegular",
  },
  entryMood: {
    fontSize: 13,
    color: "#fffbf0",
    marginTop: 8,
  },
  entryTag: {
    fontSize: 14,
    color: "#fffbf0",
    marginTop: 4,
    fontFamily: "PoppinsRegular",
  },
  entryDate: {
    fontSize: 14,
    color: "#fffbf0",
    marginTop: 4,
    fontFamily: "PoppinsRegular",
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
});
