import {
  View,
  Image,
  ScrollView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useState } from "react";
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

export default function NewHome() {
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

  // Sample data for goals and resources
  const goals = [
    {
      title: "Read 20 Pages",
      progress: 60,
      deadline: "Dec 15, 2024",
      isCompleted: false,
    },
    {
      title: "Write PMP Exam",
      progress: 10,
      deadline: "Dec 15, 2024",
      isCompleted: false,
    },
    {
      title: "Exercise for 30 mins",
      progress: 100,
      deadline: "Nov 23, 2024",
      isCompleted: true,
    },
  ];

  const goalsResource = [
    {
      id: 1,
      title: "Fitness",
      description:
        "Achieve better physical health through regular workouts and healthy habits.",
      resources: [
        {
          id: 1,
          title: "30-Minute Home Workout",
          description: "A beginner-friendly workout plan to get you started.",
          type: "Video",
          link: "https://www.example.com/workout-video",
        },
        {
          id: 2,
          title: "Healthy Eating Guide",
          description:
            "A guide to eating balanced meals to fuel your fitness journey.",
          type: "Article",
          link: "https://www.example.com/healthy-eating-guide",
        },
      ],
    },
    {
      id: 2,
      title: "Mindfulness",
      description:
        "Improve mental clarity and focus through daily mindfulness practices.",
      resources: [
        {
          id: 1,
          title: "Daily Meditation for Focus",
          description:
            "Guided meditations to help you stay focused throughout the day.",
          type: "Audio",
          link: "https://www.example.com/meditation-audio",
        },
        {
          id: 2,
          title: "Mindfulness for Stress Relief",
          description:
            "A set of practices to reduce stress and increase relaxation.",
          type: "Article",
          link: "https://www.example.com/mindfulness-stress-relief",
        },
      ],
    },
    {
      id: 3,
      title: "Productivity",
      description:
        "Boost your productivity through time management and goal-setting strategies.",
      resources: [
        {
          id: 1,
          title: "Pomodoro Technique for Focus",
          description:
            "A technique to manage time in focused intervals to boost productivity.",
          type: "Video",
          link: "https://www.example.com/pomodoro-technique",
        },
        {
          id: 2,
          title: "Time Blocking for Better Workflow",
          description:
            "Learn how to organize your day with time blocking to stay productive.",
          type: "Article",
          link: "https://www.example.com/time-blocking",
        },
      ],
    },
  ];

  //   const resources = [
  //     { title: 'How to Stay Focused', image: require('./assets/focused.png'), type: 'article' },
  //     { title: 'Meditation for Beginners', image: require('./assets/meditation.png'), type: 'video' },
  //   ];
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
  //   const startedResources = [
  //     { title: 'Mindfulness Techniques', image: require('./assets/mindfulness.png'), type: 'audio' },
  //     { title: 'Productivity Hacks', image: require('./assets/productivity.png'), type: 'article' },
  //   ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.safeArea}>
        {/* Greeting Section */}
        <Text style={styles.greetingText}>{getGreeting()}, welcome back!</Text>

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
          <View style={styles.cardContainer}>
            {goals.map((goal, index) => (
              <Card
                key={index}
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
                  {goal.isCompleted
                    ? `Completed on: ${goal.deadline}`
                    : `Deadline: ${goal.deadline}`}
                </Text>
                <Button style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View Goal</Text>
                </Button>
              </Card>
            ))}
          </View>
        </View>

        {/* Resources Section Tied to Goals */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Resources for Your Goals</Text>
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
        </View>

        {/* Started Resources Section */}
        <View style={styles.sectionContainerAlt}>
          <Text style={styles.sectionTitle}>
            Started Reading for Your Goals
          </Text>
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
        <View style={styles.journalCard}>
          <Text style={styles.journalTitle}>
            My Journey Towards Mindfulness
          </Text>
          <Button style={styles.viewButton}>
            <Text style={styles.viewButtonText}>Read Journal</Text>
          </Button>
        </View>
        <View style={styles.journalCard}>
          <Text style={styles.journalTitle}>
            Things I am Grateful For
          </Text>
          <Button style={styles.viewButton}>
            <Text style={styles.viewButtonText}>Read Moments</Text>
          </Button>
        </View>

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
    // backgroundColor: "#fff",
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    // borderRadius: 5,
    // alignSelf: "center",

    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  viewButtonText: {
    // fontSize: 14,
    // color: "#9D50BB",
    // textAlign: "center",
    // fontFamily: "PoppinsRegular",

    color: "#9D50BB", // Matching button color with card
    fontSize: 14,
    fontWeight: "600",
  },

  sectionContainerAlt: {
    marginVertical: 15,
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#fff5f8",
    //elevation: 5,
  },
  sectionContainer: {
    marginVertical: 15,
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#f0f8ff",
    //elevation: 3,
  },

  resourceCard: {
    // width: 250,
    // marginRight: 15,
    // borderRadius: 10,
    // elevation: 5,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",

    width: 220,
    height: 250, // Fixed height for uniformity
    marginRight: 15,
    borderRadius: 15,
    padding: 15,
    backgroundColor: "#fff",
    elevation: 5,
    justifyContent: "space-between", // Align content properly
    overflow: "hidden", // Prevent content overflow
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
    flexShrink: 1, // Prevent text overflow
  },
  horizontalScrollContainer: {
    marginBottom: 20,
  },
  horizontalScroll: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 3,
    paddingBottom: 5, // Adds space around cards
  },
  spacer: {
    width: 20, // Ensures the last card is fully visible
  },
  startedResourceCard: {
    // width: 200,
    // marginRight: 15,
    // borderRadius: 10,
    // elevation: 5,
    // backgroundColor: "#f0f0f0",
    // alignItems: "center",
    // justifyContent: "center",

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
    flexDirection: "row", // Horizontal layout
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
    borderRadius: 10, // Circular image
    marginRight: 12, // Space between image and text
  },

  meditationTextContainer: {
    flexShrink: 1, // Allow the text container to shrink if necessary
    justifyContent: "center", // Center text and button vertically
    minWidth: 150, // Ensure the text container has enough space for title and button
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
  //   ctaContainer: {
  //     marginTop: 30,
  //     alignItems: "center",
  //   },
  //   ctaButton: {
  //     backgroundColor: "#9D50BB",
  //     marginVertical: 10,
  //     paddingVertical: 15,
  //     paddingHorizontal: 30,
  //     borderRadius: 5,
  //   },
  //   ctaButtonText: {
  //     fontSize: 16,
  //     color: "#fff",
  //     fontFamily: "PoppinsRegular",
  //   },

  ctaContainer: {
    flexDirection: "row", // Row layout for buttons
    justifyContent: "space-between", // Space between buttons
    alignItems: "center", // Center items vertically
    marginVertical: 15,
    flexWrap: "wrap", // Allow wrapping for small screens
  },

  // Individual CTA Button Style
  ctaButton: {
    flexDirection: "row", // Icon and text in a row
    alignItems: "center", // Vertically align icon and text
    backgroundColor: "#3F72AF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5, // Space between buttons
    marginVertical: 5, // For wrapping behavior on smaller screens
    elevation: 5,
    flexGrow: 1, // Buttons share available space
    minWidth: "40%", // Ensures buttons don't shrink too small
  },

  // Text Style for CTA Buttons
  ctaButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10, // Space between icon and text
    fontFamily: "PoppinsRegular",
  },
});
