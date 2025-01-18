import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

export default function NewMeditation({ navigation }) {
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterMood, setFilterMood] = useState("All");
  const [meditationData, setMeditationData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [moods, setMoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lastSessions, setLastSessions] = useState([]);
  const [streak, setStreak] = useState(null); // Add streak state
  const [error, setError] = useState(null);

  const getAllMeditations = async () => {
    try {
      setIsFetching(true);
      setError(null);

      const [meditationsQuery, categoriesQuery, moodsQuery] = await Promise.all(
        [
          getDocs(collection(db, "meditations")),
          getDocs(collection(db, "meditation_category")),
          getDocs(collection(db, "moods")),
        ]
      );

      const meditations = [];
      const uniqueMoods = new Set();

      const moodMap = moodsQuery.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {});

      for (const docSnapshot of meditationsQuery.docs) {
        const meditationData = docSnapshot.data();
        const categoryReference = meditationData.category;
        const categoryId = categoryReference.id;

        const category = categoriesQuery.docs.find(
          (categoryDoc) => categoryDoc.id === categoryId
        );
        const categoryData = category ? category.data() : null;

        let moodName = "Unknown";
        let moodColor = "#ccc";
        if (meditationData.mood) {
          const moodId = meditationData.mood.id;
          const moodData = moodMap[moodId];
          if (moodData) {
            moodName = moodData.name;
            moodColor = moodData.color || "#ccc";
            uniqueMoods.add(moodName);
          }
        }

        meditations.push({
          id: docSnapshot.id,
          ...meditationData,
          category: categoryData,
          mood: moodName,
          moodColor,
        });
      }

      setMeditationData(meditations);
      setCategories(categoriesQuery.docs.map((doc) => doc.data()));
      setMoods(["All", ...uniqueMoods]);
    } catch (error) {
      console.error("Error fetching meditations:", error);
      setError("Failed to load meditations. Please try again later.");
    } finally {
      setIsFetching(false);
    }
  };

  const fetchLastListenedSessions = async () => {
    try {
      setIsFetching(true);
      setError(null);

      const userId = auth.currentUser.uid;
      const sessionsRef = collection(db, `users/${userId}/sessions`);
      const q = query(sessionsRef, orderBy("date", "desc"), limit(3));
      const querySnapshot = await getDocs(q);

      const sessions = [];
      for (const docSnapshot of querySnapshot.docs) {
        const sessionData = docSnapshot.data();
        const meditationId = sessionData.meditationId;
        const meditationDocRef = doc(db, "meditations", meditationId);
        const meditationDoc = await getDoc(meditationDocRef);

        if (meditationDoc.exists()) {
          const meditationData = meditationDoc.data();
          let moodData = { name: "Unknown", color: "#ccc" };

          if (meditationData.mood) {
            const moodDocRef = doc(db, "moods", meditationData.mood.id); // Ensure this is a reference to the mood document
            const moodDoc = await getDoc(moodDocRef);
            if (moodDoc.exists()) {
              moodData = moodDoc.data();
            }
          }

          sessions.push({
            id: docSnapshot.id,
            title: meditationData.title,
            description: meditationData.description,
            duration: meditationData.duration,
            mood: moodData.name,
            moodColor: moodData.color,
          });
        }
      }

      setLastSessions(sessions);
    } catch (error) {
      console.error("Error fetching last listened sessions:", error);
      setError(
        "Failed to load last listened sessions. Please try again later."
      );
    } finally {
      setIsFetching(false);
    }
  };

  const fetchUserStreak = async () => {
    try {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, `users/${userId}`);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setStreak(userData.streak);
      }
    } catch (error) {
      console.error("Error fetching user streak:", error);
      setError("Failed to load user streak. Please try again later.");
    }
  };

  useEffect(() => {
    getAllMeditations();
    fetchLastListenedSessions();
    fetchUserStreak(); 
  }, []);

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
    meditationId,
    title,
    description,
    audioURL
  ) => {
    navigation.navigate("MeditationPlayerScreen", {
      meditationId,
      title,
      description,
      audioURL,
    });
  };

  const goals = [
    { id: "1", title: "Confidence Goal", session: "Overcoming Self-Doubt" },
    { id: "2", title: "Productivity Goal", session: "Focused Breathing" },
  ];

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={{
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

      {isFetching ? (
        <ActivityIndicator size="large" color="#FF7F9F" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          {lastSessions.length > 0 ? (
            <View style={styles.lastListenedContainer}>
              <Text style={styles.lastListenedTitle}>
                Last Listened Meditation
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
              >
                {lastSessions.map((item) => (
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
                      <Text style={styles.moodText}>{item.mood}</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
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

          <ScrollView contentContainerStyle={styles.grid}>
            <View style={styles.sessionGrid}>
              {filteredSessions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  onPress={() => {
                    try {
                      handleSessionClick(item);
                      navigateToMeditationPlayer(
                        item.id,
                        item.title,
                        item.description,
                        item.audioURL
                      );
                    } catch (error) {
                      console.error(
                        "Error handling session click or navigation:",
                        error
                      );
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

          <View style={styles.streakContainer}>
            <Text style={styles.streakText}>Streak: {streak ? `${streak} days in a row` : "No streak yet"}</Text>
            {streak && <Text style={styles.badge}>🔥 Keep it up!</Text>}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  banner: {
    height: 320,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
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
  },
  goalText: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
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
  },
  filterText: {
    color: "#555",
  },
  filterTextActive: {
    color: "#333",
    fontWeight: "bold",
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
    justifyContent: "space-between",
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
  moodText: {
    fontSize: 12.5,
    color: "#fff",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    height: 50,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#555",
    marginBottom: 10,
    height: 30,
    textAlign: "center",
  },
  moodIndicator: {
    width: 80,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    alignSelf: "center",
  },
  durationText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "bold",
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
  },
  badge: {
    fontSize: 14,
    color: "#ff6347",
    marginTop: 5,
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
  },
  lastListenedCard: {
    padding: 22,
    backgroundColor: "#ffcbf2",
    borderRadius: 10,
    alignItems: "center",
    marginRight: 16,
    width: 200,
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
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    padding: 20,
  },
});
