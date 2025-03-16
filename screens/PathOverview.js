import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";


const PathOverview = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: "https://images.pexels.com/photos/7320648/pexels-photo-7320648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" }}
          style={styles.headerImage}
        />
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>Find Your Ground</Text>
        </View>
      </View>
      <TouchableOpacity style={[styles.section, styles.sectionWelcome]} activeOpacity={0.8}>
        <Text style={styles.title}>Welcome to "Find Your Ground"</Text>
        <Text style={styles.paragraph}>
          A journey to emotional stability & self-awareness
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.section, styles.sectionBlue]} activeOpacity={0.8}>
        <Text style={styles.subtitle}>Why This Path?</Text>
        <Text style={styles.paragraph}>
          Feeling lost, overwhelmed, or mentally scattered? This path will help
          you clear your mind, understand your emotions, and feel more in
          control—one small step at a time.
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.section, styles.sectionGreen]} activeOpacity={0.8}>
        <Text style={styles.subtitle}>What to Expect</Text>
        <Text style={styles.paragraph}>
          - Short, daily actions (2-5 min) to improve emotional balance
        </Text>
        <Text style={styles.paragraph}>
          - Interactive exercises, reflections, and habit-building
        </Text>
        <Text style={styles.paragraph}>
          - Bite-sized materials (articles, audios, and tools) to support you
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.section, styles.sectionPurple]} activeOpacity={0.8}>
        <Text style={styles.subtitle}>How It Works</Text>
        <Text style={styles.paragraph}>
          - Daily action → Immediate feedback → Small wins → Big transformation
        </Text>
        <Text style={styles.paragraph}>
          - No pressure! You go at your own pace, but consistency helps.
        </Text>
        <Text style={styles.paragraph}>
          - If a task feels off, you can swap or customize it.
        </Text>
      </TouchableOpacity>
      <View style={[styles.section, styles.sectionOrange]}>
        <Text style={styles.subtitle}>Roadmap</Text>
        <ScrollView horizontal contentContainerStyle={styles.roadmapContainer}>
          {[...Array(7)].map((_, i) => (
            <View key={i} style={styles.dayContainer}>
              <TouchableOpacity 
                style={styles.dayCard} 
                activeOpacity={0.8}
                onPress={() => navigation.navigate("DailyPathScreen", { day: i + 1 })}
              >
                <Text style={styles.dayLabel}>Day {i + 1}</Text>
                <Ionicons name="checkmark-circle-outline" size={24} color="#76c7c0" style={styles.cardIcon} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("WeekViewScreen")}
        >
          <Text style={styles.buttonText}>Start Path</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f7fa",
    padding: 20,
  },
  headerContainer: {
    width: "100%",
    height: 300, // Increased height
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 36, // Increased font size
    fontWeight: "bold",
    color: "#fff",
    textAlign: 'center',
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  section: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionWelcome: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  sectionBlue: {
    backgroundColor: "#e0f7fa",
  },
  sectionGreen: {
    backgroundColor: "#e0f2f1",
  },
  sectionPurple: {
    backgroundColor: "#f3e5f5",
  },
  sectionOrange: {
    backgroundColor: "#fff3e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    fontFamily: "PoppinsSemiBold",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    fontFamily: "PoppinsMedium",
  },
  paragraph: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    fontFamily: "PoppinsRegular",
  },
  roadmapContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dayContainer: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  dayCard: {
    width: 100,
    height: 100,
    borderRadius: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    padding: 10,
  },
  dayLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardIcon: {
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: "#76c7c0",
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "PoppinsSemiBold",
  },
});

export default PathOverview;