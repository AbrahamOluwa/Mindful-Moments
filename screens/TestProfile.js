import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Card, Icon, Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export default function TestProfile() {
  const navigation = useNavigation();

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  const progressData = [
    { label: "Goals", progress: 3, total: 5, color: "#FF5722" },
    { label: "Topics", progress: 4, total: 6, color: "#2196F3" },
    { label: "Meditation", progress: 5, total: 7, color: "#4CAF50" },
  ];

  const renderProgressBar = (label, progress, total, color) => {
    const progressBarWidth = (progress / total) * 100;

    return (
      <View style={styles.progressContainer}>
        <Text style={styles.label}>{label}</Text>
        <View
          style={[
            styles.progressBar,
            { width: `${progressBarWidth}%`, backgroundColor: color },
          ]}
        />
        <Text style={styles.progressText}>{`${progress}/${total}`}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Image
          source={require("../assets/images/lion_avatar.png")}
          style={styles.avatar}
        />
        <Text style={styles.headerText}>Guest</Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.cardContainer}>
        <Card title="Profile" containerStyle={styles.card}>
          <TouchableOpacity onPress={() => handleNavigation("CreateAccount")}>
            <View style={styles.itemRow}>
              <Icon name="ios-arrow-forward" type="ionicon" size={20} />
              <Text style={styles.itemText}>Create Account</Text>
            </View>
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity onPress={() => handleNavigation("SetReminders")}>
            <View style={styles.itemRow}>
              <Icon name="ios-arrow-forward" type="ionicon" size={20} />
              <Text style={styles.itemText}>Set Reminders</Text>
              <Icon name="ios-arrow-forward" type="ionicon" size={20} />
            </View>
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity onPress={() => handleNavigation("SetReminders")}>
            <View style={styles.itemRow}>
              <Icon name="ios-arrow-forward" type="ionicon" size={20} />
              <Text style={styles.itemText}>Set Reminders</Text>
            </View>
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity onPress={() => handleNavigation("SetReminders")}>
            <View style={styles.itemRow}>
              <Icon name="ios-arrow-forward" type="ionicon" size={20} />
              <Text style={styles.itemText}>Set Reminders</Text>
            </View>
          </TouchableOpacity>
          {/* Rest of the items */}
        </Card>
      </View>
      {/* Rest of the code */}

      <View style={styles.progressContainer}>
        <Text style={styles.title}>Progress</Text>
        {progressData.map((item, index) => (
          <View key={index}>
            {renderProgressBar(
              item.label,
              item.progress,
              item.total,
              item.color
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    //backgroundColor: "#fff",
  },
  cardContainer: {
    width: "100%",
    alignItems: "center",
  },
  card: {
    width: "90%",
    // Add any other styling properties for the card
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    // Add any other styling properties for the avatar image
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    // Add any other styling properties for the header text
  },
  divider: {
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemText: {
    marginLeft: 10,
    fontSize: 14,
    // Add any other styling properties for the item text
  },
  progressContainer: {
    //padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  progressContainer: {
    //flexDirection: "row",
    //alignItems: "center",
    marginBottom: 10,
  },
  label: {
    marginRight: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  progressText: {
    marginLeft: 10,
  },
});
