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
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadArticleContent = async () => {
    try {
      setIsSubmitting(true);
      // Example article data
      const articleData = {
        topic_id: doc(db, "article_topics", "4ii0IxaAh7DteHUaC9qu"),
        shortQuote: '"Confidence is not "They will like me." Confidence is "I will be fine if they dont." - Unknown',
        title:
          "Building Self-Confidence: The Path to Growth, Self-Awareness, and Resilience",
        introduction:
          "Self-confidence is the cornerstone of personal development, enabling you to embrace challenges, express your true self, and navigate life with resilience. In this article, we delve into the art of building self-confidence, emphasizing the values of growth, self-awareness, and resilience. Discover how fostering self-confidence can be your key to personal transformation.",
        sections: [
          {
            title: "The Significance of Self-Confidence",
            content:
              "",
            subSections: [
              {
                title: "Fostering Growth",
                content:
                   "Self-confidence is a catalyst for personal growth. It empowers you to step out of your comfort zone, take risks, and continuously improve yourself.\n\nMeet Chris, who once struggled with public speaking. Through self-confidence-building practices, he transformed into a fearless and influential speaker."
              },
              {
                title: "Deepening Self-Awareness",
                content:
                  "Building self-confidence requires self-awareness. Understanding your strengths and areas for growth is essential for developing authentic confidence.",
              },
            ],
          },
          {
            title: "Strategies for Building Self-Confidence",
            content:
              "",
            subSections: [
              {
                title: "Set Achievable Goals",
                content:
                  "Begin by setting small, achievable goals. As you accomplish them, your confidence grows. Gradually challenge yourself with more significant goals."
              },
              {
                title: "Cultivate Self-Compassion",
                content:
                  "Practice self-compassion by treating yourself with the same kindness and understanding you offer to a friend facing challenges.",
              },
            ],
          },
          {
            title: "The Resilience of Self-Confidence",
            content:
              "",
            subSections: [
              {
                title: "Facing Rejection",
                content:
                  "Self-confident individuals are more resilient in the face of rejection. They view rejection as a stepping stone to growth rather than a personal failure."
              },
              {
                title: "Navigating Challenges",
                content:
                  "Confidence equips you to tackle life's challenges with resilience. You're more likely to persevere, adapt, and bounce back from setbacks.\n\nSarah faced numerous setbacks in her career. Her unwavering self-confidence and belief in her abilities eventually led her to success.",
              },
            ],
          },
        
          
          // Repeat similar structure for other sections
        ],
        howToPractice: {
          header: "How to Start Building Self-Confidence",
          content: "To begin your journey of building self-confidence, follow these steps:",
          steps: [
            "Positive Affirmations: Start your day with positive affirmations to set a confident tone.",
            "Self-Reflection: Reflect on your strengths and areas for growth.",
            "Set Achievable Goals: Start with small goals and gradually challenge yourself.",
            "Practice Self-Compassion: Treat yourself with kindness and understanding.",
            "Resilience Building: Embrace setbacks as opportunities for growth and resilience development.",
          ]
        },

        quotesAndInsights:
          '"The way to develop self-confidence is to do the thing you fear and get a record of successful experiences behind you." - William Jennings Bryan',

        exercises: [
          "Positive Affirmation Routine: Incorporate positive affirmations into your daily routine.",
          "Incremental Goal Setting: Set and achieve small goals regularly to build confidence.",
          "Failure Reflection: Analyze setbacks, extract lessons, and use them as opportunities for growth.",
        ],

        goalIdeas: {
          content: "Here are some goal ideas to consider:",
          ideas: [
            "Public Speaking: Set a goal to speak in public, whether it's a small group or a larger audience.",
            "Skill Development: Choose a skill you've always wanted to learn, and set milestones for mastering it.",
            "Networking: Challenge yourself to expand your professional network by attending events or reaching out to new contacts.",
            "Fitness Achievement: Set a fitness goal that challenges you physically, such as running a certain distance or mastering a new workout routine.",
            "Creative Expression: Explore a creative endeavor, whether it's writing, painting, or playing a musical instrument. Share your creations with others."
          ],
        },
        summary:
          "Building self-confidence is a transformative journey that aligns with personal growth, self-awareness, and resilience. By setting achievable goals, and practicing self-compassion, you unlock the door to authentic self-confidence and personal development.",

        keyTakeaways: [
          "Self-confidence fosters personal growth and resilience.",
          "Building self-confidence involves setting achievable goals, and practicing self-compassion.",
          "Confident individuals view rejection as a growth opportunity.",
        ],
        userFeedback: [],
        relatedContent: [],
        createdAt: serverTimestamp(),
      };

      const collectionRef = collection(db, "article_contents");

      await addDoc(collectionRef, articleData);

      console.log(
        "Article Content Uploaded successfully! Document ID:",
        collectionRef.id
      );

     

      setIsSubmitting(false);

      toast.show({
        render: () => {
          return (
            <Box bg="emerald.500" px="4" py="3" rounded="sm" mb={5}>
              <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                Article content uploaded successfully!
              </Text>
            </Box>
          );
        },
      });
    } catch (error) {
      console.error("Error uploading article content:", error);
      setIsSubmitting(false);
      toast.show({
        render: () => {
          return (
            <Box bg="#ff0e0e" px="4" py="3" rounded="sm" mb={5}>
              <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                Error uploading article content Try again! {error.message};
              </Text>
            </Box>
          );
        },
      });
    }
  };

  // db.collection("articles")
  //   .add(articleData)
  //   .then((docRef) => {
  //     console.log("Article document written with ID: ", docRef.id);
  //   })
  //   .catch((error) => {
  //     console.error("Error adding article document: ", error);
  //   });

  return (
    <SafeAreaView>
      <Text>UploadCourses</Text>

      {!isSubmitting && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={uploadArticleContent}
        >
          <Text style={styles.saveButtonText}>Upload Article Content</Text>
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

// // Assuming a user gave a rating of 4 and provided feedback
// const userRating = 4;
// const userComment = "Great article! Very informative.";

// // Update total ratings count
// articleData.ratings.totalRatings += 1;

// // Update average rating
// articleData.ratings.averageRating = (articleData.ratings.averageRating + userRating) / articleData.ratings.totalRatings;

// // Add user feedback to the array
// articleData.userFeedback.push(userComment);

// Comment Document

// {
//   "articleId": "article123", // Links the comment to a specific article
//   "text": "Great article! I found it very inspiring.",
//   "author": "Alice Smith",
//   "timestamp": "2023-10-26T15:45:00Z",
//   // ... other comment-specific fields
// }

// Categories Collection:

// Document 1:
// Category name: "Personal Development"
// Description: "Articles related to personal growth."
// Topics Collection:

// Document 1:
// Topic name: "Mindfulness"
// Description: "Mindfulness-related articles"
// Category: (Reference to Category 1)
// Articles Collection:

// Document 1:
// Title: "Mindfulness"
// Content: "An article on the practice of mindfulness..."
// Author: "Jane Smith"
// Topics: (Reference to Topic 1 in the "Topics Collection")

// Certainly, here's an example of database fields for articles or topics in your Firestore database. These fields will help you track criteria for categorizing articles as "Hot" or "Trending":

// For Articles or Topics:

// title: The title of the article or topic.
// content: The main content or body of the article or topic.
// category: A reference to the category that the article or topic belongs to.
// viewCount: A counter for the number of times the article has been viewed.
// likeCount: A counter for the number of likes or upvotes.
// commentCount: A counter for the number of comments.
// shareCount: A counter for the number of times the article has been shared.
// createdAt: A timestamp indicating when the article was created.
// These fields can store important data for each article or topic. When you want to categorize them as "Hot" or "Trending," you can run queries to identify the ones with the highest view counts, most likes, most comments, or based on the criteria you've defined.

// For example, to find "Hot" articles, you can run a query that sorts articles by viewCount in descending order to identify those with the most views. To identify "Trending" articles, you might look at the most recent comments or the number of shares.

// Your database schema should be flexible enough to allow you to track these criteria, and your application logic will determine how you identify and display "Hot" and "Trending" content based on these fields.

// For Articles or Topics:

// title: The title of the article or topic.
// content: The main content or body of the article or topic.
// category: A reference to the category that the article or topic belongs to.
// viewCount: A counter for the number of times the article has been viewed.
// ratings: A field to store user ratings. You might use a numerical rating system, such as 1 to 5, where users can rate articles or topics.
// commentCount: A counter for the number of comments.
// shareCount: A counter for the number of times the article has been shared.
// createdAt: A timestamp indicating when the article was created.
// By using ratings, you can capture a more nuanced understanding of how users perceive the quality of your content. This can help you identify highly-rated articles or topics and showcase them as "Hot" or "Trending" content on your platform.

// When implementing your application, you can calculate an overall rating for each article based on user ratings, and then sort or filter articles based on these ratings to determine what's considered "Hot" or "Trending." This approach provides a richer and more informative way to categorize and display content.
