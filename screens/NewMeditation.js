import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons"; // Importing icons

export default function NewMeditation() {
  const [filter, setFilter] = useState("All"); // Active filter
  //   const [lastSession, setLastSession] = useState(null);

  const [lastSessions, setLastSessions] = useState([
    {
      id: "1",
      title: "Morning Calm",
      subtitle: "Start your day peacefully",
      mood: "Calm",
      duration: "15 min",
    },
    {
      id: "2",
      title: "Power Focus",
      subtitle: "Boost your productivity",
      mood: "Focused",
      duration: "20 min",
    },
    {
      id: "3",
      title: "Energy Booster",
      subtitle: "Recharge your energy levels",
      mood: "Energized",
      duration: "25 min",
    },
  ]);

  const filters = ["All", "Calm", "Focused", "Energized", "Happy"];
  const goals = [
    { id: "1", title: "Confidence Goal", session: "Overcoming Self-Doubt" },
    { id: "2", title: "Productivity Goal", session: "Focused Breathing" },
    // { id: "3", title: "Productivity Goal", session: "Focused Breathing" },
  ];

  const sessions = [
    {
      id: "1",
      title: "Morning Calm",
      subtitle: "Start your day peacefully",
      mood: "Calm",
      duration: "15 min",
    },
    {
      id: "2",
      title: "Power Focus",
      subtitle: "Boost your productivity",
      mood: "Focused",
      duration: "20 min",
    },
    {
      id: "3",
      title: "Energy Booster",
      subtitle: "Recharge your energy levels",
      mood: "Energized",
      duration: "25 min",
    },
    {
      id: "4",
      title: "Evening Relax",
      subtitle: "Wind down and relax",
      mood: "Calm",
      duration: "20 min",
    },
    {
      id: "5",
      title: "Focus Flow",
      subtitle: "Concentration for deep work",
      mood: "Focused",
      duration: "30 min",
    },
    {
      id: "6",
      title: "Morning Boost",
      subtitle: "Wake up with high energy",
      mood: "Energized",
      duration: "25 min",
    },
  ];

  // Filtered session list
  const filteredSessions =
    filter === "All" ? sessions : sessions.filter((s) => s.mood === filter);

  const handleSessionClick = (session) => {
    // Update the lastSessions array to include the new session
    setLastSessions((prevSessions) => {
      // Check if the session is already in the list
      const sessionExists = prevSessions.some((s) => s.id === session.id);

      // Add new session to the front if it doesn't already exist
      if (!sessionExists) {
        return [session, ...prevSessions].slice(0, 3); // Keep only the last 3 sessions
      }

      // If the session exists, move it to the front
      const updatedSessions = prevSessions.filter((s) => s.id !== session.id);
      return [session, ...updatedSessions].slice(0, 3);
    });
  };

  const getMoodDetails = (mood) => {
    switch (mood) {
      case "Calm":
        return { moodColor: "#90CAF9", moodIcon: "ios-pause" }; // Light blue for calm
      case "Focused":
        return { moodColor: "#FFEB3B", moodIcon: "ios-speedometer" }; // Yellow for focused
      case "Energized":
        return { moodColor: "#FF5722", moodIcon: "ios-flame" }; // Red for energized
      default:
        return { moodColor: "#90CAF9", moodIcon: "ios-pause" }; // Default to calm
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Banner */}
      <ImageBackground
        source={{
          //   uri: "https://plus.unsplash.com/premium_photo-1666946131242-b2c5cc73892a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          uri: "https://images.pexels.com/photos/221471/pexels-photo-221471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        }}
        style={styles.banner}
      >
        <View style={styles.bannerContent}>
          <Text style={styles.bannerText}>Suggested Meditations</Text>
          {goals.map((goal) => (
            <TouchableOpacity key={goal.id} style={styles.suggestion}>
              <Text style={styles.suggestionText}>{goal.session}</Text>
              <Text style={styles.goalText}>{goal.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ImageBackground>

      {/* Continue Listening Section */}
      {lastSessions.length > 0 ? (
        <View style={styles.lastListenedContainer}>
          <Text style={styles.lastListenedTitle}>Last Listened Meditation</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {lastSessions.map((item) => (
              //   const { moodColor, moodIcon } = getMoodDetails(item.mood);

              <TouchableOpacity
                key={item.id}
                style={styles.lastListenedCard}
                onPress={() => handleSessionClick(item)}
              >
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                <View
                  style={[
                    styles.moodIndicator,
                    { backgroundColor: getMoodColor(item.mood) },
                  ]}
                >
                  {/* <Ionicons name="pause" size={20} color="#fff" /> */}
                  <Text style={styles.moodText}>{item.mood}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome5 name="clock" size={14} color="#333" />
                  <Text style={styles.durationText}> {item.duration}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Ionicons name="play-circle-outline" size={35} color="#4CAF50" />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            No sessions listened to yet. Start your journey now!
          </Text>
        </View>
      )}

      {/* Filter Options */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterContainer}>
          {filters.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.filterButton,
                filter === item && styles.filterButtonActive,
              ]}
              onPress={() => setFilter(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item && styles.filterTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Meditation Sessions Grid */}
      <ScrollView contentContainerStyle={styles.grid}>
        <View style={styles.sessionGrid}>
          {filteredSessions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => handleSessionClick(item)}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              <View
                style={[
                  styles.moodIndicator,
                  { backgroundColor: getMoodColor(item.mood) },
                ]}
              >
                <Text style={styles.moodText}>{item.mood}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5 name="clock" size={14} color="#333" />
                <Text style={styles.durationText}> {item.duration}</Text>
              </View>

              <View style={{ marginTop: 10 }}>
                <Ionicons name="play-circle-outline" size={35} color="#4CAF50" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Streak Tracker */}
      <View style={styles.streakContainer}>
        <Text style={styles.streakText}>Streak: 4 days in a row</Text>
        <Text style={styles.badge}>🔥 Keep it up!</Text>
      </View>
    </ScrollView>
  );
}

const getMoodColor = (mood) => {
  switch (mood) {
    case "Calm":
      return "#90CAF9"; // Light blue for calm
    case "Focused":
      return "#FFEB3B"; // Yellow for focused
    case "Energized":
      return "#FF5722"; // Red for energized
    default:
      return "#90CAF9";
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Light background color
  },
  banner: {
    height: 320, // Increased height to ensure visibility
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 0, // Added top margin to avoid phone header overlap
  },
  bannerContent: {
    paddingTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    fontFamily: "PoppinsSemiBold",
  },
  suggestion: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    width: "90%",
    alignItems: "center",
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "PoppinsRegular",
  },
  goalText: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
    fontFamily: "PoppinsRegular",
  },
  filterContainer: {
    marginTop: 7,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    marginHorizontal: 5,
  },
  filterButtonActive: {
    backgroundColor: "#90CAF9",
    // backgroundColor: "#ffffff",
  },
  filterText: {
    color: "#555",
    fontFamily: "PoppinsRegular",
  },
  filterTextActive: {
    color: "#333",
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
  },
  grid: {
    paddingHorizontal: 10,
  },
  sessionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    flexBasis: "48%",
    marginBottom: 15,
    backgroundColor: "#ffcbf2", // Light purple color
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  moodText: {
    fontSize: 14,
    color: "#777",
    fontFamily: "PoppinsRegular"
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    fontFamily: "PoppinsRegular",
  },

  cardSubtitle: {
    fontSize: 12,
    color: "#555",
    marginBottom: 10,
    fontFamily: "PoppinsMedium",
  },

  moodIndicator: {
    width: 80,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  moodText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "PoppinsMedium",
  },

  durationText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "bold",
    fontFamily: "PoppinsMedium",
  },

  streakContainer: {
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  streakText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "PoppinsRegular",
  },
  badge: {
    fontSize: 14,
    color: "#ff6347",
    marginTop: 5,
    fontFamily: "PoppinsRegular",
  },
  horizontalScroll: {
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingBottom: 5,
  },

  lastListenedContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  lastListenedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    fontFamily: "PoppinsSemiBold",
  },

  lastListenedCard: {
    padding: 22,
    backgroundColor: "#ffcbf2",
    borderRadius: 10,
    alignItems: "center",
    marginRight: 16,
  },

  lastListenedText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  lastListenedMood: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginHorizontal: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  placeholderText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
});
