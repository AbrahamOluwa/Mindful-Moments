import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { HStack, Stack } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
// import ProgressCircle from "react-native-progress-circle";

export default function GoalListItem(props) {
  const { title, description, dueDate } = props;
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.editButton} onPress={() => props.navigation.navigate("EditGoalScreen", {
        title, 
        description,
        dueDate
      })}>
        <MaterialIcons
          name="edit"
          size={20}
          color="#fff" // Icon color
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton}>
        <MaterialIcons
          name="delete"
          size={20}
          color="#fff" // Icon color
        />
      </TouchableOpacity>
      <View style={styles.goalInfoContainer}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.description}>{props.description}</Text>
        <View style={styles.progressBar}>
          <View
            style={{
              width: `${(props.completedTasks / props.numberOfTasks) * 100}%`,
              // width: `${(1 / props.numberOfTasks) * 100}%`,
              backgroundColor: "#EF798A",
              height: 10,
              borderRadius: 5,
            }}
          ></View>
        </View>
        <Text style={styles.progressText}>
          {props.completedTasks}/{props.numberOfTasks} tasks completed
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    marginHorizontal: 12,
    position: "relative",
  },
  editButton: {
    position: "absolute",
    top: 5,
    right: 48, // Adjust the position
    backgroundColor: "#EF798A",
    padding: 10, // Adjust the padding
    borderRadius: 20, // Make it a circle
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 4,
    backgroundColor: "#FF5733", // Customize the delete button color
    padding: 10, // Adjust the padding
    borderRadius: 20, // Make it a circle
  },
  goalInfoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15, // Increase font size for the title
    fontFamily: "SoraSemiBold",
  },
  description: {
    fontSize: 13, // Increase font size for the description
    marginTop: 8,
    fontFamily: "SoraRegular",
  },
  progressBar: {
    height: 10,
    backgroundColor: "#ddd",
    marginTop: 8,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: "SoraRegular",
  },
});