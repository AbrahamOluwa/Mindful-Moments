import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { HStack, Stack } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
// import ProgressCircle from "react-native-progress-circle";

export default function GoalListItem(props) {
  const {
    id,
    title,
    description,
    dueDate,
    category,
    priority,
    repeatOption,
    selectedDays,
    numberOfTasks,
    selectedTime,
    selectedDateMY,
    tasks,
    onDelete,
    //onUpdate
  } = props;

  const handleDelete = () => {
    // Call the onDelete function when the "Delete" button is pressed
    onDelete(id);
  };

  // const handleUpdateGoal = (updatedData) => {
  //   onUpdate(id, updatedData);
  //   // console.log('updated data', updatedData)
  // };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          props.navigation.navigate("EditGoalScreen", {
            id,
            title,
            description,
            dueDate,
            category,
            priority,
            numberOfTasks,
            repeatOption,
            selectedDays,
            selectedTime,
            selectedDateMY,
            tasks,
            //onUpdate: handleUpdateGoal
          })
        }
          
          
        }
      >
        <MaterialIcons
          name="edit"
          size={20}
          color="#fff" // Icon color
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
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
    marginBottom: 10,
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
    maxWidth: "80%", // Adjust the maximum width as needed
  },
  description: {
    fontSize: 13, // Increase font size for the description
    marginTop: 8,
    fontFamily: "SoraRegular",
    maxWidth: "90%",
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
