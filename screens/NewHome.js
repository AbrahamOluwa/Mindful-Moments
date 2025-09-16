import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Card, Button, Progress } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Empty from "../components/home/Empty";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";

export default function NewHome() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [entries, setEntries] = useState([]);
  const [streak, setStreak] = useState(0);
  const [quote, setQuote] = useState({
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
  });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch User Streak
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setStreak(userDocSnap.data().streak || 0);
        }

        // Fetch Goals
        const goalsQuery = query(
          collection(db, "users", user.uid, "goals"),
          where("isGoalCompleted", "==", false),
          orderBy("dueDate", "asc"),
          limit(3)
        );

        // Fetch Entries
        const entriesQuery = query(
          collection(db, "users", user.uid, "entries"),
          orderBy("createdAt", "desc"),
          limit(3)
        );

        const [goalsSnapshot, entriesSnapshot] = await Promise.all([
          getDocs(goalsQuery),
          getDocs(entriesQuery),
        ]);

        const goalsList = Promise.all(
          goalsSnapshot.docs.map(async (d) => {
            const goalData = d.data();
            const tasksSnapshot = await getDocs(
              collection(db, "users", user.uid, "goals", d.id, "tasks")
            );
            const tasks = tasksSnapshot.docs.map((taskDoc) => taskDoc.data());
            const completedTasks = tasks.filter(
              (task) => task.completed
            ).length;
            const progress =
              tasks.length > 0
                ? Math.round((completedTasks / tasks.length) * 100)
                : 0;
            return { id: d.id, ...goalData, tasks, completedTasks, progress };
          })
        );

        setGoals(await goalsList);

        const entriesList = entriesSnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setEntries(entriesList);
      } catch (error) {
        console.error("Error fetching home screen data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [user]);

  const resources = [
    { title: "Digital Marketing 101", type: "article" },
    { title: "How to Stay Focused", type: "article" },
    { title: "Meditation for Beginners", type: "video" },
  ];

  return (
    <LinearGradient
      colors={["#E1F5FE", "#F3E5F5"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.safeArea}>
          {/* Greeting */}
          <Text style={styles.greetingText}>
            {getGreeting()}, {user?.username || "User"}!
          </Text>

          {/* Premium Teal Quote Card */}
          <Card style={styles.dailyInspiration}>
            <MaterialIcons name="format-quote" size={34} color="#4DB6AC" />
            <Text style={styles.inspirationText}>{quote.text}</Text>
            <Text style={styles.inspirationAuthor}>- {quote.author}</Text>
            <TouchableOpacity
              style={styles.seeMoreButton}
              onPress={() => navigation.navigate("Quotes")}
            >
              <Text style={styles.buttonText}>See More Quotes</Text>
            </TouchableOpacity>
          </Card>

          {/* Focus Card */}
          <View style={styles.focusCard}>
            <MaterialIcons name="self-improvement" size={30} color="#FFFFFF" />
            <View style={styles.focusTextContainer}>
              <Text style={styles.focusTitle}>Today's Focus</Text>
              <Text style={styles.focusSubtitle}>
                5-Minute Breathing Meditation
              </Text>
            </View>
            <Button
              style={styles.focusButton}
              onPress={() => navigation.navigate("Meditations")}
            >
              <Text style={styles.focusButtonText}>Start</Text>
            </Button>
          </View>

          {/* Streak Tracker */}
          <View style={styles.streakContainer}>
            <MaterialIcons name="local-fire-department" size={24} color="#4DB6AC" />
            <Text style={styles.streakText}>
              {streak}-Day Streak! Keep it up.
            </Text>
          </View>

          {/* Goals Section - Horizontal Scroll */}
          <View>
            <Text style={styles.sectionTitle}>Your Goals</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#4DB6AC" />
            ) : goals.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {goals.map((goal) => (
                  <Card key={goal.id} style={styles.goalCard}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Progress
                      style={styles.progressBar}
                      value={goal.progress}
                      _filledTrack={{
                        bg: "#4DB6AC",
                      }}
                    />
                    <Text style={styles.goalDeadline}>
                      <MaterialIcons name="event" size={14} color="#4DB6AC" />
                      {"  Deadline: "}
                      {new Date(goal.dueDate.toDate()).toDateString()}
                    </Text>
                    <Button
                      style={styles.viewButton}
                      onPress={() =>
                        navigation.navigate("GoalDetailsScreen", {
                          goalId: goal.id,
                          userId: user.uid,
                        })
                      }
                    >
                      <Text style={styles.viewButtonText}>View Goal</Text>
                    </Button>
                  </Card>
                ))}
              </ScrollView>
            ) : (
              <Empty
                title="No Goals Yet"
                description="Set your first goal to start making progress on what matters most."
                buttonText="Set a New Goal"
                onPress={() => console.log("Navigate to set goal")}
              />
            )}
          </View>

          {/* Entries Section */}
          <View>
            <Text style={styles.sectionTitle}>Reflect on Your Journey</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#4DB6AC" />
            ) : entries.length > 0 ? (
              <View style={styles.cardContainer}>
                {entries.map((entry) => (
                  <Card key={entry.id} style={styles.entryCard}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryType}>
                        {entry.type.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.entryContent}>
                      {entry.content.length > 100
                        ? `${entry.content.substring(0, 90)}...`
                        : entry.content}
                    </Text>
                    <Text style={styles.entryDate}>
                      {new Date(entry.createdAt.toDate()).toDateString()}
                    </Text>
                    <Button
                      style={styles.viewButton}
                      onPress={() =>
                        navigation.navigate("EntryDetailsScreen", {
                          entryId: entry.id,
                          userId: user.uid,
                        })
                      }
                    >
                      <Text style={styles.viewButtonText}>View</Text>
                    </Button>
                  </Card>
                ))}
              </View>
            ) : (
              <Empty
                title="No Entries Yet"
                description="Add your first journal or gratitude entry to reflect on your journey."
                buttonText="Add Entry"
                onPress={() => console.log("Navigate to add entry")}
              />
            )}
          </View>

          {/* Resources Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Resources for You</Text>
            {resources.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {resources.map((resource, index) => (
                  <Card key={index} style={styles.resourceCard}>
                    <Image
                      source={{ uri: "https://via.placeholder.com/150" }}
                      style={styles.resourceImage}
                    />
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    <Button style={styles.viewButton}>
                      <Text style={styles.viewButtonText}>Read More</Text>
                    </Button>
                  </Card>
                ))}
              </ScrollView>
            ) : (
              <Empty
                title="Explore resources."
                description="Browse through resources that can help you achieve your goals."
                buttonText="Explore Resources"
                onPress={() => console.log("Navigate to resources")}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
  safeArea: {
    marginTop: 40,
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#263238",
    textAlign: "center",
    marginVertical: 28,
    fontFamily: "PoppinsBold",
    letterSpacing: 1,
  },
  dailyInspiration: {
    padding: 28,
    borderRadius: 20,
    marginVertical: 18,
    backgroundColor: "rgba(255,255,255,0.97)",
    shadowColor: "#4DB6AC",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#4DB6AC",
  },
  inspirationText: {
    fontSize: 22,
    color: "#263238",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "PoppinsRegular",
    fontStyle: "italic",
    fontWeight: "bold",
  },
  inspirationAuthor: {
    fontSize: 16,
    color: "#4DB6AC",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "PoppinsRegular",
  },
  seeMoreButton: {
    marginTop: 10,
    alignSelf: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#E0F2F1",
    borderWidth: 1,
    borderColor: "#4DB6AC",
  },
  buttonText: {
    fontSize: 16,
    color: "#4DB6AC",
    fontFamily: "PoppinsRegular",
    fontWeight: "bold",
  },
  focusCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 18,
    marginVertical: 14,
    backgroundColor: "#4DB6AC",
    elevation: 10,
    shadowColor: "#00897B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
  },
  focusTextContainer: {
    flex: 1,
    marginLeft: 15,
    backgroundColor: "transparent",
  },
  focusTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "PoppinsSemiBold",
  },
  focusSubtitle: {
    fontSize: 15,
    color: "#F5F5F5",
    fontFamily: "PoppinsRegular",
  },
  focusButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    elevation: 4,
  },
  focusButtonText: {
    color: "#4DB6AC",
    fontWeight: "bold",
    fontSize: 16,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#263238",
    padding: 16,
    borderRadius: 17,
    marginVertical: 15,
    elevation: 9,
    shadowColor: "#4DB6AC",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  streakText: {
    fontSize: 18,
    color: "#4DB6AC",
    fontFamily: "PoppinsMedium",
    marginLeft: 8,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 24,
    marginVertical: 20,
    color: "#263238",
    fontFamily: "PoppinsSemiBold",
    fontWeight: "bold",
  },
  horizontalScroll: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 3,
    paddingBottom: 5,
  },
  goalCard: {
    width: 230,
    marginRight: 20,
    borderRadius: 18,
    padding: 18,
    backgroundColor: "#fff",
    elevation: 12,
    shadowColor: "#4DB6AC",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    borderWidth: 1.5,
    borderColor: "#4DB6AC",
    justifyContent: "space-between",
  },
  goalTitle: {
    fontSize: 18,
    color: "#263238",
    fontFamily: "PoppinsSemiBold",
    marginBottom: 12,
  },
  goalDeadline: {
    fontSize: 15,
    color: "#4DB6AC",
    marginVertical: 8,
    fontFamily: "PoppinsRegular",
    fontWeight: "bold",
  },
  progressBar: {
    marginTop: 8,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E0F2F1",
  },
  viewButton: {
    backgroundColor: "#4DB6AC",
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    elevation: 3,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "PoppinsMedium",
  },
  cardContainer: {
    marginBottom: 20,
  },
  sectionContainer: {
    marginVertical: 15,
  },
  resourceCard: {
    width: 220,
    height: 250,
    marginRight: 15,
    borderRadius: 16,
    padding: 18,
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#4DB6AC",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    justifyContent: "space-between",
    overflow: "hidden",
    borderColor: "#4DB6AC",
    borderWidth: 1.5,
  },
  resourceImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  resourceTitle: {
    fontSize: 16,
    color: "#263238",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "PoppinsRegular",
    flexShrink: 1,
    fontWeight: "bold",
  },
  entryCard: {
    padding: 18,
    marginBottom: 14,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderColor: "#4DB6AC",
    borderWidth: 1.2,
    elevation: 9,
    shadowColor: "#4DB6AC",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  entryType: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#4DB6AC",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    overflow: "hidden",
    fontFamily: "PoppinsRegular",
    letterSpacing: 1,
  },
  entryContent: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    color: "#263238",
    marginBottom: 10,
  },
  entryDate: {
    fontSize: 13,
    color: "#4DB6AC",
    marginBottom: 10,
    fontFamily: "PoppinsRegular",
  },
});