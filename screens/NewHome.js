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
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import EmptyState from "../components/home/EmptyState";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function NewHome() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Get greeting based on time of day
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
    const fetchGoals = async () => {
      try {
        const goalsQuery = query(
          collection(db, "users", user.uid, "goals"),
          where("isGoalCompleted", "==", false),
          orderBy("dueDate", "asc"),
          limit(3)
        );

        const goalsSnapshot = await getDocs(goalsQuery);

        // More efficient way to process goals and tasks:
        const goalsList = goalsSnapshot.docs.map((doc) => {
          const goalData = doc.data();
          return getDocs(
            collection(db, "users", user.uid, "goals", doc.id, "tasks")
          ).then((tasksSnapshot) => {
            const tasks = tasksSnapshot.docs.map((taskDoc) => taskDoc.data());
            const completedTasks = tasks.filter(
              (task) => task.completed
            ).length;
            const progress =
              tasks.length > 0
                ? Math.round((completedTasks / tasks.length) * 100)
                : 0;

            return {
              id: doc.id,
              ...goalData,
              tasks,
              completedTasks,
              progress,
            };
          });
        });

        const resolvedGoals = await Promise.all(goalsList); // Resolve all promises
        setGoals(resolvedGoals);
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchGoals();
    }
  }, [user]);

  // Sample data for resources
  const resources = [
    { title: "Digital Marketing 101", type: "article" },
    { title: "How to Stay Focused", type: "article" },
    { title: "Meditation for Beginners", type: "video" },
    { title: "Healthy Eating Guide", type: "article" },
    { title: "Time Blocking for Better Workflow", type: "article" },
  ];

  const startedResources = [
    { title: "How To SEO", type: "audio" },
    { title: "Mindfulness Techniques", type: "audio" },
    { title: "Productivity Hacks", type: "article" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.safeArea}>
        {/* Greeting Section */}
        <Text style={styles.greetingText}>{getGreeting()}, welcome back!</Text>
        {/* <Text style={styles.welcomeText}>Welcome, {user ? user.uid : 'User'}!</Text> */}

        {/* Beautiful Daily Inspiration Section */}
        <LinearGradient
          colors={["#9D50BB", "#6E48AA"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.dailyInspiration}
        >
          <Text style={styles.inspirationText}>
            “Success is the sum of small efforts, repeated day in and day out.”
          </Text>
          <TouchableOpacity style={styles.seeMoreButton}>
            <Text style={styles.buttonText}>See More Quotes</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Goals Section */}
        <View>
          <Text style={styles.sectionTitle}>Your Goals</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#3182CE" />
          ) : goals.length > 0 ? (
            <View style={styles.cardContainer}>
              {goals.map((goal, index) => (
                <Card
                  key={goal.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor:
                        goal.progress === 100 ? "#4CAF50" : "#EF798A",
                    },
                  ]}
                >
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Progress
                    style={styles.progressBar}
                    value={goal.progress}
                    color={goal.isCompleted ? "#4CAF50" : "#EF798A"}
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

        {/* Resources Section Tied to Goals */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Resources for Your Goals</Text>
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
              <View style={styles.spacer} />
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

        {/* Started Resources Section */}
        <View style={styles.sectionContainerAlt}>
          <Text style={styles.sectionTitle}>
            Started Reading for Your Goals
          </Text>
          {startedResources.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {startedResources.map((resource, index) => (
                <Card key={index} style={styles.startedResourceCard}>
                  <Image
                    source={{ uri: "https://via.placeholder.com/150" }}
                    style={styles.resourceImage}
                  />
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <Button style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>Continue Reading</Text>
                  </Button>
                </Card>
              ))}
            </ScrollView>
          ) : (
            <EmptyState
              title="No Resources Started"
              description="Browse through resources that can help you achieve your goals."
              buttonText="Explore Resources"
              onPress={() => console.log("Navigate to resources")}
            />
          )}
        </View>

        {/* Meditation Section Tied to Mindfulness Goals */}
        <Text style={styles.sectionTitle}>Guided Meditation</Text>
        <View style={styles.meditationCard}>
          <Image
            source={{ uri: "https://via.placeholder.com/60" }} // Replace with actual image URL
            style={styles.meditationImage}
          />
          <View style={styles.meditationTextContainer}>
            <Text style={styles.meditationTitle}>
              Guided Meditation for Focus
            </Text>
            <Button style={styles.viewButton}>
              <Text style={styles.viewButtonText}>Start Meditation</Text>
            </Button>
          </View>
        </View>
        <View style={styles.meditationCard}>
          <Image
            source={{ uri: "https://via.placeholder.com/60" }} // Replace with actual image URL
            style={styles.meditationImage}
          />
          <View style={styles.meditationTextContainer}>
            <Text style={styles.meditationTitle}>
              Guided Meditation for Relaxation
            </Text>
            <Button style={styles.viewButton}>
              <Text style={styles.viewButtonText}>Start Meditation</Text>
            </Button>
          </View>
        </View>

        {/* Journals Section Tied to Goal Reflection */}
        <Text style={styles.sectionTitle}>Reflect on Your Journey</Text>
        <EmptyState
          title="No Journal Entries"
          description="Reflect on your journey by writing your first journal entry."
          buttonText="Log Your First Thought"
          onPress={() => console.log("Navigate to journaling")}
        />

        {/* Call-to-Action Buttons for New Goals */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity style={styles.ctaButton}>
            <MaterialIcons name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.ctaButtonText}>Start New Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaButton}>
            <FontAwesome5 name="book-reader" size={24} color="#fff" />
            <Text style={styles.ctaButtonText}>Explore Resources</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaButton}>
            <FontAwesome name="pencil-square-o" size={24} color="#fff" />
            <Text style={styles.ctaButtonText}>Log a Thought</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaButton}>
            <MaterialIcons name="self-improvement" size={24} color="#fff" />
            <Text style={styles.ctaButtonText}>Start Meditation</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
  },
  safeArea: {
    marginTop: 40,
    paddingHorizontal: 15,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "RobotoSlabRegular",
  },
  dailyInspiration: {
    padding: 18,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  inspirationText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "PoppinsRegular",
  },
  seeMoreButton: {
    marginTop: 10,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 14,
    color: "#9D50BB",
    fontFamily: "PoppinsRegular",
  },
  sectionTitle: {
    fontSize: 22,
    marginVertical: 20,
    color: "#333",
    fontFamily: "PoppinsSemiBold",
  },
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 5,
  },
  goalTitle: {
    fontSize: 17,
    color: "#fff",
    fontFamily: "PoppinsRegular",
  },
  goalDeadline: {
    fontSize: 14,
    color: "#fff",
    marginVertical: 10,
    fontFamily: "PoppinsRegular",
  },
  progressBar: {
    marginTop: 10,
    height: 10,
    borderRadius: 5,
  },
  viewButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  viewButtonText: {
    color: "#9D50BB",
    fontSize: 14,
    fontWeight: "600",
  },
  sectionContainerAlt: {
    marginVertical: 15,
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#fff5f8",
  },
  sectionContainer: {
    marginVertical: 15,
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#f0f8ff",
  },
  resourceCard: {
    width: 220,
    height: 250,
    marginRight: 15,
    borderRadius: 15,
    padding: 15,
    backgroundColor: "#fff",
    elevation: 5,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  resourceImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  resourceTitle: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "PoppinsRegular",
    flexShrink: 1,
  },
  horizontalScrollContainer: {
    marginBottom: 20,
  },
  horizontalScroll: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 3,
    paddingBottom: 5,
  },
  spacer: {
    width: 20,
  },
  startedResourceCard: {
    width: 220,
    height: 250,
    marginRight: 15,
    borderRadius: 15,
    padding: 15,
    backgroundColor: "#fff",
    elevation: 5,
    justifyContent: "space-between",
  },
  meditationCard: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#EF798A",
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  meditationTitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
    fontFamily: "PoppinsRegular",
  },
  meditationImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 12,
  },
  meditationTextContainer: {
    flexShrink: 1,
    justifyContent: "center",
    minWidth: 150,
  },
  journalCard: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#9D50BB",
    elevation: 5,
    alignItems: "center",
  },
  journalTitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
    fontFamily: "PoppinsRegular",
  },
  ctaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
    flexWrap: "wrap",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3F72AF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    marginVertical: 5,
    elevation: 5,
    flexGrow: 1,
    minWidth: "40%",
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
    fontFamily: "PoppinsRegular",
  },
});
