import React, { useState, useEffect, useCallback} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Checkbox } from "native-base";
import { useRoute, useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { doc, deleteDoc, getDocs, collection, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";

const GoalDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { goalId, userId } = route.params;
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchGoalDetails = async () => {
    try {
      const goalDoc = await getDoc(doc(db, "users", userId, "goals", goalId));
      if (goalDoc.exists()) {
        const goalData = goalDoc.data();

        // Fetch milestones
        const milestonesSnapshot = await getDocs(collection(db, "users", userId, "goals", goalId, "milestones"));
        const milestones = milestonesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Fetch tasks
        const tasksSnapshot = await getDocs(collection(db, "users", userId, "goals", goalId, "tasks"));
        const tasks = tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setGoal({ id: goalDoc.id, ...goalData, milestones, tasks });
      } else {
        Alert.alert("Error", "Goal not found.");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error fetching goal details:", error);
      Alert.alert("Error", "There was an error fetching the goal details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchGoalDetails();
    }, [])
  );


  const handleDelete = async () => {
    setDeleting(true);
    try {
      // Delete all tasks associated with the goal
      const tasksSnapshot = await getDocs(collection(db, "users", userId, "goals", goal.id, "tasks"));
      for (const taskDoc of tasksSnapshot.docs) {
        await deleteDoc(doc(db, "users", userId, "goals", goal.id, "tasks", taskDoc.id));
      }

      // Delete all milestones associated with the goal
      const milestonesSnapshot = await getDocs(collection(db, "users", userId, "goals", goal.id, "milestones"));
      for (const milestoneDoc of milestonesSnapshot.docs) {
        await deleteDoc(doc(db, "users", userId, "goals", goal.id, "milestones", milestoneDoc.id));
      }

      // Delete the main goal document
      await deleteDoc(doc(db, "users", userId, "goals", goal.id));
      Alert.alert("Goal Deleted", "The goal has been successfully deleted.");
      navigation.navigate("GoalsListScreen"); 
    } catch (error) {
      console.error("Error deleting goal:", error);
      Alert.alert(
        "Error",
        "There was an error deleting the goal. Please try again."
      );
    } finally {
        setDeleting(false);
      }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Goal",
      "Are you sure you want to delete this goal?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: handleDelete },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4DB6AC" />
      </View>
    );
  }

  if (!goal) {
    return (
      <View style={styles.container}>
        <Text>No goal data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F8FB" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>{goal.title}</Text>
          <Text style={styles.description}>{goal.description}</Text>
          <Text style={styles.detailText}>
            Due Date: {goal.dueDate.toDate().toDateString()}
          </Text>
          <Text style={styles.detailText}>Category: {goal.category}</Text>
          <Text style={styles.detailText}>Priority: {goal.priority}</Text>

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
            Progress:{" "}
            {goal.tasks.filter((task) => task.completed === true).length}/
            {goal.tasks.length} tasks completed
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Milestones</Text>
          {goal.milestones.length > 0 ? (
            goal.milestones.map((milestone, index) => (
              <View key={index} style={styles.milestone}>
                <Checkbox
                  isChecked={milestone.completed}
                  onChange={() => {
                    /* Handle checkbox change */
                  }}
                  accessibilityLabel={milestone.text}
                />
                <Text style={styles.milestoneText}>{milestone.text}</Text>
              </View>
            ))
          ) : (
            <Text>No milestones added</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tasks</Text>
          {goal.tasks.length > 0 ? (
            goal.tasks.map((task, index) => (
              <View key={index} style={styles.task}>
                <Checkbox
                  isChecked={task.completed}
                  onChange={() => {
                    /* Handle checkbox change */
                  }}
                  accessibilityLabel={task.text}
                />
                <Text style={styles.taskText}>{task.text}</Text>
              </View>
            ))
          ) : (
            <Text>No tasks added</Text>
          )}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("EditGoalScreen", { goal, userId })
          }
        >
          <FontAwesome name="edit" size={20} color="#FFF" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => {
            /* Complete goal functionality */
          }}
        >
          <FontAwesome name="check-circle" size={20} color="#FFF" />
          <Text style={styles.completeButtonText}>Complete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
          <FontAwesome name="trash" size={20} color="#FFF" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      {deleting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3182CE" />
          <Text style={styles.loadingText}>Deleting Goal...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    // backgroundColor: "#F4F8FB",
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    borderColor: "#D7CCC8",
    borderWidth: 1,
  },
  header: {
    marginBottom: 20,
    paddingTop: 20, // Add padding to avoid notch
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#263238",
    fontFamily: "PoppinsSemiBold",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#263238",
    fontFamily: "PoppinsRegular",
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    width: "100%",
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  progress: {
    height: "100%",
    // backgroundColor: "#3182CE",
    backgroundColor: "#F48FB1",
  },
  progressText: {
    fontSize: 14,
    color: "#78909C",
    marginBottom: 20,
    fontFamily: "PoppinsRegular",
  },
  detailText: {
    fontSize: 14,
    color: "#263238",
    fontFamily: "PoppinsRegular",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D3748",
    fontFamily: "PoppinsRegular",
    marginBottom: 10,
  },
  milestone: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#D7CCC8",
    borderWidth: 1, 
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  milestoneText: {
    fontSize: 14,
    color: "#263238",
    fontFamily: "PoppinsRegular",
    marginLeft: 10,
  },
  task: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderColor: "#D7CCC8",
    borderWidth: 1, 
    marginBottom: 5,
  },
  taskText: {
    fontSize: 14,
    color: "#263238",
    fontFamily: "PoppinsRegular",
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  editButton: {
    backgroundColor: "#3182CE",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    minWidth: "25%",
    justifyContent: "center",
  },
  editButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
    marginLeft: 5,
  },
  completeButton: {
    backgroundColor: "#38A169",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    minWidth: "30%",
    justifyContent: "center",
  },
  completeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: "#E53E3E",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    minWidth: "30%",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
    marginLeft: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#FFF',
    fontSize: 16,
    fontFamily: "PoppinsRegular",
  },
});

export default GoalDetails;
