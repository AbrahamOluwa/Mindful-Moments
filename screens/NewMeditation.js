import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, getDoc } from "firebase/firestore";

export default function NewMeditation({navigation}) {
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterMood, setFilterMood] = useState("All");
  const [meditationData, setMeditationData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [moods, setMoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lastSessions, setLastSessions] = useState([]);

  // const getAllMeditations = async () => {
  //   try {
  //     setIsFetching(true);

  //     // Fetch meditations and categories in parallel
  //     const [meditationsQuery, categoriesQuery] = await Promise.all([
  //       getDocs(collection(db, "meditations")),
  //       getDocs(collection(db, "meditation_category")),
  //     ]);

  //     const meditations = [];
  //     const uniqueMoods = new Set();

  //     // Loop through meditations and resolve mood references
  //     for (const docSnapshot of meditationsQuery.docs) {
  //       const meditationData = docSnapshot.data();
  //       const categoryReference = meditationData.category;
  //       const categoryId = categoryReference.id;

  //       // Resolve category name
  //       const category = categoriesQuery.docs.find((categoryDoc) => categoryDoc.id === categoryId);
  //       const categoryData = category ? category.data() : null;

  //       // Resolve mood reference
  //       let moodName = "Unknown";
  //       if (meditationData.mood) {
  //         const moodDoc = await getDoc(meditationData.mood); // Resolve the mood reference
  //         if (moodDoc.exists()) {
  //           moodName = moodDoc.data().name; // Get mood name
  //           uniqueMoods.add(moodName); // Add mood name to unique moods
  //         }
  //       }

  //       meditations.push({
  //         id: docSnapshot.id,
  //         ...meditationData,
  //         category: categoryData,
  //         mood: moodName, // Replace mood reference with resolved name
  //       });
  //     }

  //     setMeditationData(meditations);
  //     setCategories(categoriesQuery.docs.map((doc) => doc.data()));
  //     setMoods(["All", ...uniqueMoods]); // Add "All" to unique moods
  //     setIsFetching(false);
  //   } catch (error) {
  //     console.error("Error fetching meditations:", error);
  //     setIsFetching(false);
  //   }
  // };

  const getAllMeditations = async () => {
    try {
      setIsFetching(true);

      // Fetch meditations, categories, and moods in parallel
      const [meditationsQuery, categoriesQuery, moodsQuery] = await Promise.all(
        [
          getDocs(collection(db, "meditations")),
          getDocs(collection(db, "meditation_category")),
          getDocs(collection(db, "moods")), // Fetch moods collection
        ]
      );

      const meditations = [];
      const uniqueMoods = new Set();

      // Create a map of mood IDs to mood data for quick lookup
      const moodMap = moodsQuery.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {});

      // Loop through meditations and resolve references
      for (const docSnapshot of meditationsQuery.docs) {
        const meditationData = docSnapshot.data();
        const categoryReference = meditationData.category;
        const categoryId = categoryReference.id;

        // Resolve category name
        const category = categoriesQuery.docs.find(
          (categoryDoc) => categoryDoc.id === categoryId
        );
        const categoryData = category ? category.data() : null;

        // Resolve mood reference
        let moodName = "Unknown";
        let moodColor = "#ccc"; // Default color if not found
        if (meditationData.mood) {
          const moodId = meditationData.mood.id; // Get mood ID from reference
          const moodData = moodMap[moodId];
          if (moodData) {
            moodName = moodData.name; // Get mood name
            moodColor = moodData.color || "#ccc"; // Get mood color
            uniqueMoods.add(moodName); // Add mood name to unique moods
          }
        }

        meditations.push({
          id: docSnapshot.id,
          ...meditationData,
          category: categoryData,
          mood: moodName, // Replace mood reference with resolved name
          moodColor, // Add mood color
        });
      }

      setMeditationData(meditations);
      setCategories(categoriesQuery.docs.map((doc) => doc.data()));
      setMoods(["All", ...uniqueMoods]); // Add "All" to unique moods
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching meditations:", error);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getAllMeditations();
  }, []);

  // Filtered session list
  const filteredSessions =
    filterCategory === "All" && filterMood === "All"
      ? meditationData
      : meditationData.filter(
          (session) =>
            (filterCategory === "All" ||
              session.category?.name === filterCategory) &&
            (filterMood === "All" || session.mood === filterMood)
        );

  const handleSessionClick = (session) => {
    setLastSessions((prevSessions) => {
      const sessionExists = prevSessions.some((s) => s.id === session.id);

      if (!sessionExists) {
        return [session, ...prevSessions].slice(0, 3);
      }

      const updatedSessions = prevSessions.filter((s) => s.id !== session.id);
      return [session, ...updatedSessions].slice(0, 3);
    });
  };

  const navigateToMeditationPlayer = (
    medidationId,
    title,
    description,
    audioURL
  ) => {
    navigation.navigate("MeditationPlayerScreen", {
      medidationId,
      title,
      description,
      audioURL,
    });
  };

  const goals = [
    { id: "1", title: "Confidence Goal", session: "Overcoming Self-Doubt" },
    { id: "2", title: "Productivity Goal", session: "Focused Breathing" },
    // { id: "3", title: "Productivity Goal", session: "Focused Breathing" },
  ];

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
                <Text
                  style={styles.cardTitle}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.title}
                </Text>
                <Text style={styles.cardSubtitle} numberOfLines={1}>
                  {item.description}
                </Text>
                <View
                  style={[
                    styles.moodIndicator,
                    { backgroundColor: item.moodColor },
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
                  <Ionicons
                    name="play-circle-outline"
                    size={35}
                    color="#4CAF50"
                  />
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

      {/* Category and Mood Filters */}
      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
        <View style={{ flexDirection: "row" }}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={{
                padding: 10,
                margin: 5,
                backgroundColor: filterCategory === category.name ? "#4CAF50" : "#ccc",
                borderRadius: 20,
              }}
              onPress={() => setFilterCategory(category.name)}
            >
              <Text style={{ color: "#fff" }}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: "row" }}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood}
              style={{
                padding: 10,
                margin: 5,
                backgroundColor: filterMood === mood ? "#4CAF50" : "#ccc",
                borderRadius: 20,
              }}
              onPress={() => setFilterMood(mood)}
            >
              <Text style={{ color: "#fff" }}>{mood}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView> */}

      {/* Filter Options */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterContainer}>
          {moods.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.filterButton,
                filterMood === item && styles.filterButtonActive,
              ]}
              onPress={() => setFilterMood(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  filterMood === item && styles.filterTextActive,
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
              onPress={() => {
                try {
                  // Ensure both functions are called
                  handleSessionClick(item); // Make sure this works and is not undefined
                  navigateToMeditationPlayer(
                    item.id,
                    item.title,
                    item.description,
                    item.audioURL
                  ); // Ensure this is defined
                } catch (error) {
                  console.error("Error handling session click or navigation:", error);
                }
              }}
            >
              <Text
                style={styles.cardTitle}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.title}
              </Text>
              <Text style={styles.cardSubtitle} numberOfLines={1}>
                {item.description}
              </Text>
              <View
                style={[
                  styles.moodIndicator,
                  { backgroundColor: item.moodColor },
                ]}
              >
                <Text style={styles.moodText}>{item.mood}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5 name="clock" size={14} color="#333" />
                <Text style={styles.durationText}> {item.duration}</Text>
              </View>

              <View style={{ marginTop: 10 }}>
                <Ionicons
                  name="play-circle-outline"
                  size={35}
                  color="#4CAF50"
                />
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
      return "#FB8C00"; // Yellow for focused
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // Align items vertically
    alignItems: "center",
    padding: 20,
    flexBasis: "48%",
    backgroundColor: "#ffcbf2",
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  // card: {
  //   flexBasis: "48%",
  //   marginBottom: 15,
  //   backgroundColor: "#ffcbf2",
  //   borderRadius: 10,
  //   padding: 20,
  //   alignItems: "center",
  //   shadowColor: "#000",
  //   shadowOpacity: 0.1,
  //   shadowRadius: 5,
  //   shadowOffset: { width: 0, height: 2 },
  //   elevation: 3,
  // },

  moodText: {
    fontSize: 14,
    color: "#777",
    fontFamily: "PoppinsRegular",
  },

  cardTitle: {
    // fontSize: 15,
    // fontWeight: "bold",
    // color: "#333",
    // marginBottom: 5,
    // fontFamily: "PoppinsRegular",

    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    fontFamily: "PoppinsRegular",
    height: 50,
    textAlign: "center",
  },

  cardSubtitle: {
    fontSize: 12,
    color: "#555",
    marginBottom: 10,
    fontFamily: "PoppinsMedium",
    height: 30,
    textAlign: "center",

    // fontSize: 12,
    // color: "#555",
    // marginBottom: 10,
    // fontFamily: "PoppinsMedium",
  },

  // moodIndicator: {
  //   width: 80,
  //   height: 30,
  //   borderRadius: 15,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginBottom: 10,
  // },

  moodIndicator: {
    width: 80,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    alignSelf: "center",
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
    width: 200
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
