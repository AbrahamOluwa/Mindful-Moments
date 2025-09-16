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
import { useFocusEffect } from "@react-navigation/native";
import { BlurView } from 'expo-blur';

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
  
      // Query for completed sessions
      const completedSessionsQuery = query(sessionsRef, orderBy("date", "desc"), limit(4));
      const completedSessionsSnapshot = await getDocs(completedSessionsQuery);
  
      const sessions = [];
  
      // Process completed sessions
      for (const docSnapshot of completedSessionsSnapshot.docs) {
        if (docSnapshot.id !== "current") { // Exclude the "current" session
          const sessionData = docSnapshot.data();
          const meditationId = sessionData.meditationId;
          const meditationDocRef = doc(db, "meditations", meditationId);
          const meditationDoc = await getDoc(meditationDocRef);
  
          if (meditationDoc.exists()) {
            const meditationData = meditationDoc.data();
            let moodData = { name: "Unknown", color: "#ccc" };
  
            if (meditationData.mood) {
              const moodDocRef = doc(db, "moods", meditationData.mood.id);
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
              date: sessionData.date,
            });
          }
        }
      }
  
      // Fetch the current session
      const currentSessionDocRef = doc(db, `users/${userId}/sessions`, "current");
      const currentSessionDoc = await getDoc(currentSessionDocRef);
  
      if (currentSessionDoc.exists()) {
        const sessionData = currentSessionDoc.data();
        const meditationId = sessionData.meditationId;
        const meditationDocRef = doc(db, "meditations", meditationId);
        const meditationDoc = await getDoc(meditationDocRef);
  
        if (meditationDoc.exists()) {
          const meditationData = meditationDoc.data();
          let moodData = { name: "Unknown", color: "#ccc" };
  
          if (meditationData.mood) {
            const moodDocRef = doc(db, "moods", meditationData.mood.id);
            const moodDoc = await getDoc(moodDocRef);
            if (moodDoc.exists()) {
              moodData = moodDoc.data();
            }
          }
  
          sessions.push({
            id: currentSessionDoc.id,
            title: meditationData.title,
            description: meditationData.description,
            duration: meditationData.duration,
            mood: moodData.name,
            moodColor: moodData.color,
            date: sessionData.date,
          });
        }
      }
  
      // Sort sessions by date in descending order
      sessions.sort((a, b) => b.date.toDate() - a.date.toDate());
  
      // Limit to the most recent 3 sessions
      const recentSessions = sessions.slice(0, 3);
  
      setLastSessions(recentSessions);
    } catch (error) {
      console.error("Error fetching last listened sessions:", error);
      setError("Failed to load last listened sessions. Please try again later.");
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

  // useEffect(() => {
  //   getAllMeditations();
  //   fetchLastListenedSessions();
  //   fetchUserStreak(); 
  // }, []);

  useFocusEffect(
    useCallback(() => {
      getAllMeditations();
      fetchLastListenedSessions();
      fetchUserStreak();
    }, [])
  );

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
        <ActivityIndicator size="large" color="#4DB6AC" />
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
                      <FontAwesome5 name="clock" size={14} color="#B39DDB" />
                      <Text style={styles.durationText}> {item.duration}</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <Ionicons
                        name="play-circle-outline"
                        size={35}
                       color="#4DB6AC"
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
                    <FontAwesome5 name="clock" size={14} color="#B39DDB" />
                    <Text style={styles.durationText}> {item.duration}</Text>
                  </View>

                  <View style={{ marginTop: 10 }}>
                    <Ionicons
                      name="play-circle-outline"
                      size={35}
                      color="#4DB6AC"
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
    backgroundColor: "#F3E5F5", // light lavender-teal blend
  },
  banner: {
    height: 320,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderRadius: 18,
    overflow: "hidden",
    // Suggest gradient overlay for premium look (use LinearGradient if possible)
  },
  bannerContent: {
    paddingTop: 54,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(76,182,172,0.18)", // soft teal overlay
    borderRadius: 18,
  },
  bannerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "PoppinsSemiBold",
    marginBottom: 14,
    letterSpacing: 1,
    textShadowColor: "#4DB6AC",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  suggestion: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: "#4DB6AC",
    padding: 14,
    marginTop: 12,
    width: "90%",
    alignItems: "center",
    elevation: 7,
    shadowColor: "#4DB6AC",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  suggestionText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#4DB6AC",
    fontFamily: "PoppinsSemiBold",
  },
  goalText: {
    fontSize: 13,
    color: "#263238",
    marginTop: 4,
    fontFamily: "PoppinsRegular",
  },
  filterContainer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#E0F2F1",
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#4DB6AC",
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: "#4DB6AC",
    borderColor: "#00897B",
    elevation: 5,
  },
  filterText: {
    color: "#263238",
    fontFamily: "PoppinsRegular",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "PoppinsSemiBold",
  },
  grid: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sessionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 22,
    flexBasis: "48%",
    backgroundColor: "#fff",
    borderColor: "#4DB6AC",
    borderWidth: 1.2,
    borderRadius: 14,
    marginBottom: 18,
    shadowColor: "#4DB6AC",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 7,
  },
  moodIndicator: {
    width: 90,
    height: 32,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    alignSelf: "center",
    backgroundColor: "#4DB6AC",
    elevation: 2,
  },
  moodText: {
    fontSize: 13,
    color: "#fff",
    fontFamily: "PoppinsMedium",
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#263238",
    marginBottom: 6,
    height: 50,
    textAlign: "center",
    fontFamily: "PoppinsSemiBold",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#78909C",
    marginBottom: 12,
    height: 30,
    textAlign: "center",
    fontFamily: "PoppinsRegular",
  },
  durationText: {
    fontSize: 13,
    color: "#4DB6AC",
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
  },
  streakContainer: {
    alignItems: "center",
    padding: 22,
    borderTopWidth: 1,
    borderTopColor: "#E0F2F1",
    marginTop: 20,
  },
  streakText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4DB6AC",
    fontFamily: "PoppinsSemiBold",
  },
  badge: {
    fontSize: 15,
    color: "#00897B",
    marginTop: 7,
    fontFamily: "PoppinsMedium",
  },
  horizontalScroll: {
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingBottom: 6,
  },
  lastListenedContainer: {
    padding: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 24,
    shadowColor: "#4DB6AC",
    shadowOpacity: 0.13,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    borderWidth: 1.5,
    borderColor: "#4DB6AC",
  },
  lastListenedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#263238",
    marginBottom: 12,
    fontFamily: "PoppinsSemiBold",
  },
  lastListenedCard: {
    padding: 22,
    borderRadius: 14,
    alignItems: "center",
    marginRight: 18,
    width: 210,
    backgroundColor: "#E0F2F1",
    borderColor: "#4DB6AC",
    borderWidth: 1.5,
    elevation: 3,
    shadowColor: "#4DB6AC",
    shadowOpacity: 0.09,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  lastListenedText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4DB6AC",
    fontFamily: "PoppinsMedium",
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 17,
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#4DB6AC",
    shadowOpacity: 0.09,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderWidth: 1.2,
    borderColor: "#E0F2F1",
  },
  placeholderText: {
    fontSize: 15,
    color: "#263238",
    textAlign: "center",
    fontFamily: "PoppinsRegular",
  },
  errorText: {
    fontSize: 18,
    color: "#FF7043",
    textAlign: "center",
    padding: 22,
    fontFamily: "PoppinsSemiBold",
  },
});
