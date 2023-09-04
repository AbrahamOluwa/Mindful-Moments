import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { HStack, Stack } from "native-base";
// import ProgressCircle from "react-native-progress-circle";

export default function GoalListItem(props) {
  // const progressPercentage = (goal.progress / goal.total) * 100;
  return (
    <View>
      <View style={styles.card}>
        <View style={styles.progressCircleContainer}>
          {/* <ProgressCircle
          percent={20}
          radius={30}
          borderWidth={8}
          color="#00a8ff"
          shadowColor="#d1d8e0"
          bgColor="#fff"
        >
          <Text style={styles.progressText}>{"20%"}</Text>
        </ProgressCircle> */}
          {/* <Text
          style={styles.progressItemProgress}
        >{`${data.progress}/100`}</Text> */}
          <Text style={styles.progressItemProgress}>2/{props.numberOfTasks}</Text>
        </View>
        <View style={styles.goalInfoContainer}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.description}>{props.description}</Text>
        </View>
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
    marginHorizontal: 12, // Add horizontal margin to the tab container
  },
  progressCircleContainer: {
    alignItems: "center",
    justifyContent: "center", // Center the progress circle vertically
    marginRight: 16,
  },

  goalInfoContainer: {
    flex: 1, // Take the remaining space in the row for goal information
  },

  title: {
    fontSize: 15,
    fontFamily: "SoraSemiBold",
  },

  description: {
    fontSize: 13,
    marginTop: 8,
    fontFamily: "SoraRegular",
  },

  progressText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#00a8ff",
  },

  progressItemProgress: {
    fontSize: 10,
    fontFamily: "SoraRegular",
    color: "#fff",
    borderRadius: 100,
    backgroundColor: "#EF798A",
    padding: 8,
  },
});
