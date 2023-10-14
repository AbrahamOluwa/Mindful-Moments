import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
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

export default function UploadArticles() {
  // Example article data
  const articleData = {
    title:
      "The Power of Mindfulness Meditation: Cultivating Compassion and Authenticity",
    introduction:
      "In the hustle and bustle of our modern lives, finding peace and staying true to ourselves can be a challenge...",
    sections: [
      {
        title: "The Essence of Mindfulness",
        content:
          "Mindfulness is about being fully present in the moment, acknowledging our thoughts and feelings without judgment, and cultivating awareness of the world around us.",
        subSections: [
          {
            title: "Present Moment Awareness",
            content:
              "Imagine this: It's a beautiful morning, and you're sipping your morning coffee or tea. Instead of scrolling through your phone or planning your day mentally, you take a moment to truly savor the warmth and aroma of the coffee, the play of sunlight through the window, and the gentle hum of life around you. This is present moment awareness, and it's at the heart of mindfulness meditation.",
          },
          {
            title: "Non-Judgmental Acceptance",
            content:
              "Meet Sarah, a young professional who struggled with self-criticism.Through mindfulness, she learned to observe her inner critic without judgment. She realized that it was just a voice born out of past experiences. By embracing non-judgmental acceptance, she began to treat herself with kindness and self-compassion.\n Practice observing your thoughts without judgment. Imagine them as passing clouds, allowing them to come and go without attaching labels of good or bad.",
          },
        ],
      },
      {
        title: "Section 2: Compassion Through Mindfulness",
        content: "Our journey into mindfulness often uncovers a deep well of compassion, both for ourselves and others.",
        subSections: [
          {
            title: "2.1: Self-Compassion",
            content: "Sarah's journey continued as she discovered self-compassion. By practicing mindfulness, she learned to be as kind to herself as she was to her friends. She forgave herself for past mistakes and found strength in self-love. Consider this actionable step: the next time you face a challenge, speak to yourself with the same kindness you'd offer a friend. Embrace self-compassion as a cornerstone of mindfulness.",
          },
          {
            title: "2.2: Compassion for Others",
            content: "As Sarah's self-compassion grew, so did her capacity for compassion toward others. She began to understand that everyone carries their own burdens and struggles. By being present and compassionate, she deepened her relationships and created a positive ripple effect in her community. Extend your compassion beyond yourself. Set a goal to perform one act of kindness each day, whether it's a small gesture or a heartfelt conversation."
          }
        ]
      }
      // Repeat similar structure for other sections
    ],
    howToPractice: [
      "Find a Quiet Space: Choose a peaceful location where you won't be disturbed.",
      "Focus on Your Breath: Pay attention to your breath as it enters and leaves your body.",
      "Acknowledge Thoughts: When your mind wanders, gently bring your focus back to your breath without judgment.",
      "Start Small: Begin with short sessions and gradually increase the duration.",
    ],

    quotesAndInsights:
      '"Mindfulness gives you time. Time gives you choices. Choices, skillfully made, lead to freedom." - Bhante Henepola Gunaratana',
    exercises:
      "Exercise 1: Loving-Kindness Meditation\n1. Sit comfortably and close your eyes...\nExercise 2: Mindful Walking\n1. Take a walk in a peaceful place...",
    goalIdeas:
      "Here are some goal ideas to consider: Daily Meditation, Journaling, Compassion Project, Authentic Living",
    summary:
      "Mindfulness meditation is more than a practice; it's a journey toward self-discovery, compassion, and authenticity...",
    keyTakeaways:
      "Mindfulness leads to present moment awareness and non-judgmental acceptance...\nAuthenticity emerges through self-discovery and living in alignment with our values.",
    relatedContent:
      "[Link to 'Mindful Living: A Beginner's Guide']\n[Link to 'The Science of Compassion']\n...",
    commentsAndDiscussion:
      "How has mindfulness meditation impacted your life? Share your experiences and insights in the comments below.",
    socialSharing:
      "[Include social media sharing buttons to encourage readers to share the article.]",
    ratingAndFeedback:
      "[Allow users to rate the article and provide feedback.]",
  };

  // Add the article to the Firestore collection
  db.collection("articles")
    .add(articleData)
    .then((docRef) => {
      console.log("Article document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding article document: ", error);
    });

  return (
    <View>
      <Text>UploadArticles</Text>
    </View>
  );
}
