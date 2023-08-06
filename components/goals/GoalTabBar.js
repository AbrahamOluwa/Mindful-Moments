import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

export default function GoalTabBar({ activeTab, setActiveTab }) {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === "all" && styles.activeTabButton,
        ]}
        onPress={() => setActiveTab("all")}
      >
        <Text
          style={[
            styles.tabButtonText,
            activeTab === "all" && styles.activeTabButtonText,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === "active" && styles.activeTabButton,
        ]}
        onPress={() => setActiveTab("active")}
      >
        <Text
          style={[
            styles.tabButtonText,
            activeTab === "active" && styles.activeTabButtonText,
          ]}
        >
          Active
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === "completed" && styles.activeTabButton,
        ]}
        onPress={() => setActiveTab("completed")}
      >
        <Text
          style={[
            styles.tabButtonText,
            activeTab === "completed" && styles.activeTabButtonText,
          ]}
        >
          Completed
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around", // Space out the tabs evenly
    backgroundColor: "#fff", // white background color
    borderRadius: 13, // Border radius for the tab container
    overflow: "hidden", // Clip the contents inside the rounded corners
    marginHorizontal: 12, // Add horizontal margin to the tab container
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 12, // Increase the vertical padding to increase the height of tabs
  },
  tabButtonText: {
    fontSize: 13,
    fontFamily: "SoraMedium",
    color: "black",
  },
  activeTabButton: {
    backgroundColor: "#f0f0f0", // White background color for the active tab
    borderRadius: 16, // Border radius for the active tab
    borderWidth: 2, // Add border width for the active tab
    borderColor: "#EF798A", // Border color for the active tab
    paddingHorizontal: 20, // Increase the horizontal padding to increase the width of the active tab
    paddingVertical: 8, // Reduce the vertical padding to reduce the height of the active tab
  },
  activeTabButtonText: {
    color: "#EF798A",
    //color: "#3f51b5",
  },
});
