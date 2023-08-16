import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, {useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../firebaseConfig";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Button, useToast, Box } from "native-base";

export default function UploadCourses() {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadCourse = async () => {
    try {
      setIsSubmitting(true);
      const data = {
        category_id: "/course_category/9bnN6kM1ltEqSNeK8eZ4",
        title: "The Basics of Mindfulness",
        introduction:
          "Welcome to The Basics of Mindfulness course! In this transformative journey, you'll explore the art of mindfulness – a practice that can revolutionize the way you perceive and engage with the world around you. Whether you're new to mindfulness or seeking to deepen your understanding, this course will provide you with essential insights, practical techniques, and resources to cultivate mindfulness in your everyday life.",
        story: {
          title: "Emily's Journey to Mindfulness",
          content:
            "Meet Emily, a young professional who juggles a demanding job, social commitments, and personal aspirations. Despite her achievements, she often feels overwhelmed and disconnected. One day, during a walk in the park, Emily encounters a wise old woman who introduces her to the power of mindfulness. The old woman shares her own journey of self-discovery through mindfulness. She describes how, in the midst of life's chaos, she learned to pause and observe her thoughts and feelings without judgment. As Emily listens, she realizes that her own struggles are not unique and that there is a way to find balance and peace within herself. <br>Intrigued by the old woman's words, Emily decides to give mindfulness a chance. She starts with simple practices – paying attention to her breath, savoring the taste of her morning tea, and taking moments to appreciate the beauty around her. Slowly but surely, Emily notices a shift. The incessant chatter in her mind begins to quiet, and a sense of clarity emerges. <br> As Emily continues to explore mindfulness, she finds that she can navigate challenges with a newfound resilience. The pressure at work becomes manageable, and she handles difficult conversations with grace. More importantly, she learns to be present with herself, embracing her strengths and acknowledging her imperfections. <br> Through their conversations, Emily discovers that the key to finding peace and meaning lies within herself – in the present moment. She learns that mindfulness isn't about escaping life's demands but about fully engaging with them. And as she walks alongside the old woman, Emily realizes that her journey towards self-discovery has just begun.",
        },
        parable: {
          title: "The Stream in the Forest",
          content:
            "Imagine a traveler lost in a dense forest. Frustration mounts as they struggle to find their way. Suddenly, they encounter a serene stream. The gentle sound of water soothes their mind, and they sit by the stream, focusing solely on its flow. As they do, worries fade, and clarity emerges. Just as the stream remains unperturbed by the forest chaos, mindfulness allows us to find stillness within life's challenges.",
        },
        key_takeaways: [
          "Mindfulness is the practice of being fully present and non-judgmentally aware.",
          "It offers a way to reconnect with yourself and the world around you.",
          "Non-judgmental observation allows for self-compassion and acceptance.",
          "Engaging the senses can anchor you in the present moment.",
          "Mindfulness enhances emotional regulation and reduces stress.",
        ],
        practical_tips: [
          "Mindful Breathing: Spend a few minutes daily focusing on your breath, gently bringing your attention back when it wanders.",
          "Body Scan Meditation: Gradually shift your awareness through each part of your body, noticing sensations without judgment.",
          "Mindful Eating: Savor each bite of a meal, appreciating flavors and textures.",
          "Mindful Walking: Engage your senses during a walk, focusing on each step and the environment.",
          "Digital Detox: Set aside device-free time to be fully present with activities and loved ones.",
        ],
        goals: [
          "Daily Mindfulness Practice: Dedicate 10 minutes each day to mindfulness meditation.",
          " Daily Mindfulness Practice: Dedicate 10 minutes each day to mindfulness meditation. Set a specific time for your practice and track your progress over the next 30 days.",
          " Non-Judgmental Observation: Catch yourself in self-criticism, and replace it with self-compassion. Keep a journal of instances where you practice self-acceptance and monitor your progress weekly.",
          "Mindful Communication: Engage fully in conversations, listening without distraction. In your next five interactions, make a conscious effort to give your complete attention to the speaker.",
          "Mindful Breaks: Take short breaks during work to reset and focus on your breath. Schedule three short breaks throughout your workday to practice a two-minute breathing exercise.",
          "Gratitude Journaling: Write down three things you're grateful for every evening. Commit to journaling before bedtime for the next two weeks, focusing on specific experiences each day.",
        ],
        subtopics: [
          {
            title: "Understanding Mindfulness",
            content: "Exploring the concept of mindfulness and its benefits.",
          },
          {
            title: "Present-Moment Awareness",
            content:
              "Embracing the power of now and detaching from past and future.",
          },
          {
            title: "Non-Judgmental Observation",
            content: "Cultivating self-awareness without self-criticism.",
          },
          {
            title: "Non-Judgmental Observation",
            content: "Cultivating self-awareness without self-criticism.",
          },
          // ... other subtopics
        ],
        mindfulness_in_challenges: [
          {
            title: "Mindful Stress Management",
            content:
              "Techniques to remain calm and centered during stressful situations.",
          },
          {
            title: "Mindful Communication",
            content:
              "Applying mindfulness to improve communication and resolve conflicts.",
          },
          // ... other challenges
        ],
        additional_resources: [
          {
            title: "Books",
            resources: [
              "The Miracle of Mindfulness by Thich Nhat Hanh",
              "Wherever You Go, There You Are by Jon Kabat-Zinn",
            ],
          },
          {
            title: "Apps",
            resources: [
              "Headspace: Guided meditation and mindfulness exercises.",
              "Insight Timer: Timer, guided meditations, and community support.",
            ],
          },
          // ... other resource categories
        ],
        conclusion:
          "Embark on this transformative journey with an open heart and a curious mind. Through mindfulness, you'll learn to find calm amidst chaos, to see beauty in simplicity, and to discover a deeper connection to yourself and the world. Let's begin this exploration of The Basics of Mindfulness and empower ourselves to live more fully in the present moment.",
      };

      const collectionRef = collection(db, "course_topics");

      await addDoc(collectionRef, data);

      console.log(
        "Course Uploaded successfully! Document ID:",
        collectionRef.id
      );

      setIsSubmitting(false);

      toast.show({
        render: () => {
          return (
            <Box bg="emerald.500" px="4" py="3" rounded="sm" mb={5}>
              <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                Course uploaded successfully!
              </Text>
            </Box>
          );
        },
      });
    } catch (error) {
      console.error("Error uploading course:", error);
      setIsSubmitting(false);
      toast.show({
        render: () => {
          return (
            <Box bg="#ff0e0e" px="4" py="3" rounded="sm" mb={5}>
              <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                Error uploading course Try again! {error};
              </Text>
            </Box>
          );
        },
      });
    }
  };


  // Upload Course Content to Firestore
  // db.collection("courses").add({
  //     category_id: "YOUR_CATEGORY_ID", // Replace with the actual category ID
  //     title: "The Basics of Mindfulness",
  //     introduction: "Welcome to",
  //     story: "Meet Emily, a young professional...",
  //     parable: "Imagine a traveler lost in a dense forest...",
  //     key_takeaways: ["Mindfulness is the practice of being fully present and non-judgmentally aware.",],
  //     practical_tips: ["Mindful Breathing: Spend a few minutes daily focusing on your breath...",],
  //     goals: ["Daily Mindfulness Practice: Dedicate 10 minutes each day to mindfulness meditation.",],
  //     subtopics: [
  //       {
  //         title: "Understanding Mindfulness",
  //         content: "Exploring the concept of mindfulness and its benefits."
  //       },
  //       {
  //         title: "Present-Moment Awareness",
  //         content: "Embracing the power of now and detaching from past and future."
  //       },
  //       // ... other subtopics
  //     ],
  //     mindfulness_in_challenges: [
  //       {
  //         title: "Mindful Stress Management",
  //         content: "Techniques to remain calm and centered during stressful situations."
  //       },
  //       {
  //         title: "Mindful Communication",
  //         content: "Applying mindfulness to improve communication and resolve conflicts."
  //       },
  //       // ... other challenges
  //     ],
  //     additional_resources: [
  //       {
  //         title: "Books",
  //         resources: [
  //           "The Miracle of Mindfulness by Thich Nhat Hanh",
  //           "Wherever You Go, There You Are by Jon Kabat-Zinn"
  //         ]
  //       },
  //       {
  //         title: "Apps",
  //         resources: [
  //           "Headspace: Guided meditation and mindfulness exercises.",
  //           "Insight Timer: Timer, guided meditations, and community support."
  //         ]
  //       },
  //       // ... other resource categories
  //     ],
  //     conclusion: "Embark on this transformative journey with an open heart...",
  //   })
  //   .then((docRef) => {
  //       console.log("Course document written with ID: ", docRef.id);
  //   })
  //   .catch((error) => {
  //       console.error("Error adding course document: ", error);
  //   });

  return (
    <SafeAreaView>
      <Text>UploadCourses</Text>

      {!isSubmitting && (
        <TouchableOpacity style={styles.saveButton} onPress={uploadCourse}>
          <Text style={styles.saveButtonText}>Upload Course</Text>
        </TouchableOpacity>
      )}

      {isSubmitting && (
        <Button
          isLoading
          _loading={{
            bg: "#EF798A",
            _text: {
              color: "coolGray.700",
              fontFamily: "SoraMedium",
              fontSize: 15,
            },
          }}
          _spinner={{
            color: "white",
          }}
          isLoadingText="Uploading Course"
        >
          Button
        </Button>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: "#613F75",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "SoraSemiBold",
  },
});
