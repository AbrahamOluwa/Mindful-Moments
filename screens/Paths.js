import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const fetchGoals = async (userId) => {
  try {
    const goals = [];
    const goalsSnapshot = await getDocs(
      collection(db, "users", userId, "goals")
    );

    for (const goalDoc of goalsSnapshot.docs) {
      const goalData = goalDoc.data();
      const goalId = goalDoc.id;

      // Fetch milestones
      const milestones = [];
      const milestonesSnapshot = await getDocs(
        collection(db, "users", userId, "goals", goalId, "milestones")
      );
      milestonesSnapshot.forEach((milestoneDoc) => {
        milestones.push({ id: milestoneDoc.id, ...milestoneDoc.data() });
      });

      // Fetch tasks
      const tasks = [];
      const tasksSnapshot = await getDocs(
        collection(db, "users", userId, "goals", goalId, "tasks")
      );
      tasksSnapshot.forEach((taskDoc) => {
        tasks.push({ id: taskDoc.id, ...taskDoc.data() });
      });

      goals.push({
        id: goalId,
        ...goalData,
        milestones: milestones,
        tasks: tasks,
      });
    }

    //console.log(goals);
    return goals;
  } catch (error) {
    console.error("Error fetching goals:", error);
    return [];
  }
};



const CreatedGoals = ({ navigation, userId }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getGoals = async () => {
      try {
        const fetchedGoals = await fetchGoals(userId);
        setGoals(fetchedGoals);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    getGoals();
  }, [userId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Created Goals</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("GoalsListScreen", {userId})}
          style={styles.seeMore}
        >
          <Text style={styles.seeMoreText}>See More</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {goals.slice(0, 5).map((goal) => (
          <View style={styles.goalCard} key={goal.id}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDescription}>{goal.description}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progress,
                  {
                    width: `${
                      (goal.tasks.filter((task) => task.completed === true)
                        .length /
                        goal.tasks.length) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              Progress:{goal.tasks.filter((task) => task.completed === true).length}/
              {goal.tasks.length} tasks
              completed
            </Text>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.cardActionButton}
                onPress={() =>
                  navigation.navigate("GoalDetailsScreen", { goalId: goal.id , userId })
                }
              >
                <FontAwesome
                  name="info-circle"
                  size={20}
                  // color="#2D3748"
                  color="#fff"
                  style={styles.cardActionIcon}
                />
                <Text style={styles.cardActionText}>View Details</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.cardActionButton}>
                <FontAwesome name="edit" size={20} color="#2D3748" style={styles.cardActionIcon} />
                <Text style={styles.cardActionText}>Edit Goal</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const ActivePaths = () => {
  const activePaths = [
    {
      id: "1",
      name: "Build Confidence",
      progress: "60%",
      nextStep: "Watch: How to Overcome Self-Doubt",
    },
    {
      id: "2",
      name: "Master Time Management",
      progress: "40%",
      nextStep: "Read: The Power of Prioritization",
    },
  ];

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Paths</Text>
        <TouchableOpacity style={styles.seeMore}>
          <Text style={styles.seeMoreText}>See More</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {activePaths.map((path) => (
          <View style={styles.activePathCard} key={path.id}>
            <View style={styles.cardHeader}>
              <Text style={styles.activePathName}>{path.name}</Text>
              <Text style={styles.activePathProgress}>{path.progress}</Text>
            </View>
            <View style={styles.analyticsContainer}>
              <Text style={styles.analyticsTitle}>Progress</Text>
              <View style={styles.analyticsRow}>
                <Text style={styles.analyticsLabel}>Milestones</Text>
                <Text style={styles.analyticsValue}>5/8</Text>
              </View>
              <View style={styles.analyticsRow}>
                <Text style={styles.analyticsLabel}>Time Spent</Text>
                <Text style={styles.analyticsValue}>3 hrs</Text>
              </View>
              <View style={styles.analyticsRow}>
                <Text style={styles.analyticsLabel}>Time Remaining</Text>
                <Text style={styles.analyticsValue}>2 hrs</Text>
              </View>
            </View>
            <Text style={styles.nextStep}>Next Step:</Text>
            <Text style={styles.nextStepDetail}>{path.nextStep}</Text>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.cardActionButton}>
                <FontAwesome
                  name="info-circle"
                  size={20}
                  // color="#2D3748"
                  color="#fff"
                  style={styles.cardActionIcon}
                />
                <Text style={styles.cardActionText}>View Details</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.cardActionButton}>
                <FontAwesome
                  name="edit"
                  size={20}
                  color="#fff"
                  style={styles.cardActionIcon}
                />
                <Text style={styles.cardActionText}>Edit Path</Text>
              </TouchableOpacity> */}
              <TouchableOpacity style={styles.cardActionButton}>
                <FontAwesome
                  name="play-circle"
                  size={20}
                  color="#fff"
                  style={styles.cardActionIcon}
                />
                <Text style={styles.cardActionText}>Resume Path</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cardActionButtonComplete}>
                <FontAwesome
                  name="check-circle"
                  size={20}
                  color="#FFF"
                  style={styles.cardActionIcon}
                />
                <Text style={styles.cardActionText}>Complete Path</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const CompletedPaths = () => {
  const completedPaths = [
    {
      id: "1",
      name: "Complete Python Course",
      completedDate: "2025-01-20",
    },
    {
      id: "2",
      name: "Run a Marathon",
      completedDate: "2024-12-15",
    },
  ];

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Completed Paths</Text>
        <TouchableOpacity style={styles.seeMore}>
          <Text style={styles.seeMoreText}>See More</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {completedPaths.map((path) => (
          <View style={styles.completedPathCard} key={path.id}>
            <Text style={styles.completedPathName}>{path.name}</Text>
            <Text style={styles.completedDate}>
              Completed on: {path.completedDate}
            </Text>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.cardActionButton}>
                <FontAwesome
                  name="info-circle"
                  size={20}
                  // color="#2D3748"
                  color="#fff"
                  style={styles.cardActionIcon}
                />
                <Text style={styles.cardActionText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const AvailablePaths = ({navigation}) => {
  const suggestedPaths = [
    {
      id: "1",
      title: "Improve Communication",
      description: "Learn to express yourself effectively.",
      details: "5 Milestones, 3 Resources",
    },
    {
      id: "2",
      title: "Develop Emotional Intelligence",
      description: "Understand and manage emotions better.",
      details: "4 Milestones, 2 Resources",
    },
    {
      id: "3",
      title: "Build Financial Discipline",
      description: "Master budgeting and saving.",
      details: "3 Milestones, 3 Resources",
    },
  ];

  const [paths, setPaths] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const pathsCollection = collection(db, "paths");
        const querySnapshot = await getDocs(query(pathsCollection));

        const pathsData = {};
        querySnapshot.forEach((doc) => {
          pathsData[doc.id] = doc.data();
        });

        setPaths(pathsData);
        console.log(pathsData);
      } catch (err) {
        console.error("Error fetching paths:", err);
        setError(err);
        Alert.alert("Error", "Failed to fetch paths. Please try again."); // Use Alert for user feedback
      } finally {
        setLoading(false);
      }
    };

    fetchPaths();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4DB6AC" />
        <Text>Loading paths...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Paths</Text>
        <TouchableOpacity style={styles.seeMore}>
          <Text style={styles.seeMoreText}>See More</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {suggestedPaths.map((item) => (
          <View style={styles.suggestedCard} key={item.id}>
            <Text style={styles.suggestedTitle}>{item.title}</Text>
            <Text style={styles.suggestedDescription}>{item.description}</Text>
            <Text style={styles.suggestedDetails}>{item.details}</Text>
            <TouchableOpacity style={styles.startPathButton}  onPress={() => navigation.navigate("PathOverviewScreen")}>
              <Text style={styles.startPathText}>Start Path</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const Paths = ({ navigation }) => {
  const { user } = useAuth();
  const userId = user.uid;
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Your Paths</Text>
          <Text style={styles.subtitle}>
            Track your goals, take action, and achieve your aspirations.
          </Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Discover New Paths</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("CreateGoalScreen")}
            >
              <Text style={styles.secondaryButtonText}>Create New Goal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Created Goals Section */}
      <CreatedGoals navigation={navigation} userId={userId} />

      {/* Active Paths Section */}
      <ActivePaths />

      {/* Completed Paths Section */}
      <CompletedPaths />

      {/* Available Paths Section */}
      <AvailablePaths navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    // backgroundColor: "#EF798A",
    backgroundColor: "#4DB6AC",
    padding: 40,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  headerContent: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    fontFamily: "RobotoSlabSemiBold",
  },
  subtitle: {
    fontSize: 16,
    // color: "#E2E8F0",
    color: "#fff",
    marginTop: 5,
    textAlign: "center",
    fontFamily: "PoppinsRegular",
  },
  quickActions: {
    flexDirection: "row",
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  ctaButtonText: {
    // color: "#3182CE",
    color: "#4DB6AC",
    fontWeight: "bold",
    fontFamily: "PoppinsMedium",
  },
  secondaryButton: {
    backgroundColor: "#E2E8F0",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    fontFamily: "PoppinsRegular",
  },
  secondaryButtonText: {
    // color: "#3182CE",
    color: "#78909C",
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
  },
  section: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D3748",
    flex: 1,
    fontFamily: "PoppinsRegular",
  },
  seeMore: {
    paddingHorizontal: 10,
    alignItems: "flex-end",
  },
  seeMoreText: {
    fontSize: 15,
    // color: "#3182CE",
    color: "#F48FB1",
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
  },
  horizontalScroll: {
    paddingVertical: 10,
  },
  activePathCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    width: 270,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activePathName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3748",
    fontFamily: "PoppinsRegular",
  },
  activePathProgress: {
    fontSize: 16,
    color: "#38A169",
  },
  nextStep: {
    fontSize: 14,
    color: "#718096",
    marginTop: 10,
    fontFamily: "PoppinsRegular",
  },
  nextStepDetail: {
    fontSize: 16,
    color: "#2D3748",
    marginBottom: 10,
    fontFamily: "PoppinsRegular",
  },
  progressBar: {
    height: 8,
    width: "100%",
    // backgroundColor: "#E2E8F0",
    backgroundColor: "#D7CCC8",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 10,
  },
  progress: {
    height: "100%",
    // backgroundColor: "#3182CE",
    backgroundColor: "#F48FB1",
  },
  progressText: {
    fontSize: 14,
    color: "#718096",
    marginTop: 5,
    fontFamily: "PoppinsRegular",
  },
  cardActions: {
    marginTop: 10,
  },
  cardActionButton: {
    // backgroundColor: "#E2E8F0",
    backgroundColor: "#F48FB1",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardActionIcon: {
    marginRight: 10,
  },
  cardActionText: {
    // color: "#2D3748",
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
  },
  cardActionButtonComplete: {
    // backgroundColor: "#38A169",
    backgroundColor: "#A5D6A7",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  goalCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    width: 270,
    borderWidth: 1,
    borderColor: "#D7CCC8",
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#263238",
    fontFamily: "PoppinsRegular",
  },
  goalDescription: {
    fontSize: 14,
    color: "#718096",
    marginTop: 10,
    fontFamily: "PoppinsRegular",
  },
  completedText: {
    fontSize: 14,
    color: "#38A169",
    marginTop: 10,
    fontFamily: "PoppinsRegular",
  },
  completedPathCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    width: 270,
  },
  completedPathName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3748",
    fontFamily: "PoppinsRegular",
  },
  completedDate: {
    fontSize: 14,
    color: "#718096",
    marginTop: 10,
    fontFamily: "PoppinsRegular",
  },
  suggestedPathsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  suggestedCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    width: 220,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  suggestedTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2D3748",
    fontFamily: "PoppinsRegular",
  },
  suggestedDescription: {
    fontSize: 13,
    color: "#718096",
    marginTop: 10,
    fontFamily: "PoppinsRegular",
  },
  suggestedDetails: {
    fontSize: 13,
    color: "#4A5568",
    marginTop: 5,
    fontFamily: "PoppinsRegular",
  },
  startPathButton: {
    // backgroundColor: "#3182CE",
    backgroundColor: "#F48FB1",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center",
  },
  startPathText: {
    color: "#FFF",
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
  },
  analyticsContainer: {
    marginTop: 15,
    backgroundColor: "#F7FAFC",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3748",
  },
  analyticsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  analyticsLabel: {
    fontSize: 14,
    color: "#718096",
  },
  analyticsValue: {
    fontSize: 14,
    color: "#2D3748",
  },
});

export default Paths;
