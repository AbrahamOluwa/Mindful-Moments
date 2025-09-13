import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Center,
  Card,
  Icon,
  Button,
  Progress,
} from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
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

export default function NewHome() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [entries, setEntries] = useState([]);
  const [streak, setStreak] = useState(0);
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
            const completedTasks = tasks.filter((task) => task.completed).length;
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
    <ImageBackground
      source={require("../assets/images/g1.jpg")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.safeArea}>
          {/* Personalized Greeting Section */}
          <Text style={styles.greetingText}>
            {getGreeting()}, {user?.username || "User"}!
          </Text>

          {/* Today's Focus Section */}
          <TouchableOpacity
            style={styles.focusCard}
            onPress={() => navigation.navigate("Meditations")}
          >
            <MaterialIcons name="self-improvement" size={30} color="#fff" />
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
          </TouchableOpacity>

          {/* Streak Tracker */}
          <View style={styles.streakContainer}>
            <MaterialIcons name="local-fire-department" size={24} color="#FFD180" />
            <Text style={styles.streakText}>{streak}-Day Streak! Keep it up.</Text>
          </View>

          {/* Goals Section */}
          <View>
            <Text style={styles.sectionTitle}>Your Goals</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#FFF" />
            ) : goals.length > 0 ? (
              <View style={styles.cardContainer}>
                {goals.map((goal) => (
                  <Card key={goal.id} style={styles.card}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Progress
                      style={styles.progressBar}
                      value={goal.progress}
                      _filledTrack={{
                        bg: "#F48FB1",
                      }}
                    />
                    <Text style={styles.goalDeadline}>
                      Deadline: {new Date(goal.dueDate.toDate()).toDateString()}
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
              </View>
            ) : (
              <EmptyState
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
              <ActivityIndicator size="large" color="#FFF" />
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
              <EmptyState
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
              <EmptyState
                title="Explore resources."
                description="Browse through resources that can help you achieve your goals."
                buttonText="Explore Resources"
                onPress={() => console.log("Navigate to resources")}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "rgba(0,0,0,0.3)", // Dark overlay for better text readability
  },
  safeArea: {
    marginTop: 40,
    paddingHorizontal: 15,
    paddingBottom: 40, // Add padding to the bottom
  },
  greetingText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "RobotoSlabRegular",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  focusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent white
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 1,
  },
  focusTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  focusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "PoppinsSemiBold",
  },
  focusSubtitle: {
    fontSize: 14,
    color: "#E0E0E0",
    fontFamily: "PoppinsRegular",
  },
  focusButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  focusButtonText: {
    color: "#4DB6AC",
    fontWeight: "bold",
    fontSize: 14,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: 12,
    borderRadius: 15,
    marginVertical: 10,
  },
  streakText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "PoppinsMedium",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 22,
    marginVertical: 20,
    color: "#FFFFFF",
    fontFamily: "PoppinsSemiBold",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3, // Softened elevation
    borderColor: "#D7CCC8",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  goalTitle: {
    fontSize: 17,
    color: "#263238",
    fontFamily: "PoppinsRegular",
  },
  goalDeadline: {
    fontSize: 14,
    color: "#78909C",
    marginVertical: 10,
    fontFamily: "PoppinsRegular",
  },
  progressBar: {
    marginTop: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D7CCC8",
  },
  viewButton: {
    backgroundColor: "#4DB6AC",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "PoppinsMedium",
  },
  sectionContainer: {
    marginVertical: 15,
  },
  resourceCard: {
    width: 220,
    height: 250,
    marginRight: 15,
    borderRadius: 15,
    padding: 15,
    backgroundColor: "#fff",
    elevation: 3, // Softened elevation
    justifyContent: "space-between",
    overflow: "hidden",
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  resourceImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  resourceTitle: {
    fontSize: 14,
    color: "#263238",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "PoppinsRegular",
    flexShrink: 1,
  },
  horizontalScroll: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 3,
    paddingBottom: 5,
  },
  entryCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    elevation: 3, // Softened elevation
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  entryType: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#F48FB1",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    overflow: "hidden",
    fontFamily: "PoppinsRegular",
  },
  entryContent: {
    fontSize: 13,
    fontFamily: "PoppinsRegular",
    color: "#263238",
    marginBottom: 10,
  },
  entryDate: {
    fontSize: 12,
    color: "#78909C",
    marginBottom: 10,
    fontFamily: "PoppinsRegular",
  },
});
