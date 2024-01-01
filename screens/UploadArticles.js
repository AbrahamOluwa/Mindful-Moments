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
        topic_id: doc(db, "article_topics", "GOPlzziUYnPW6YkMs5PP"),
        shortQuote: '"Success is not about climbing up the ladder; it is about how satisfied you feel at each step." - Sheryl Sandberg',
        title:
          "Work-Life Balance Tips: Cultivating Efficiency, Harmony, and Integrity",
        introduction:
          "In a world that never sleeps, achieving work-life balance is an art worth mastering. This article explores valuable tips to foster work-life balance, highlighting the significance of efficiency, balance, and integrity in creating a fulfilling and sustainable lifestyle.",
        sections: [
          {
            title: "The Essence of Work-Life Balance",
            content:
              "",
            subSections: [
              {
                title: "Embracing Efficiency",
                content:
                   "Work-life balance begins with efficiency. Streamlining your work processes allows you to achieve more in less time, providing space for personal pursuits.\n\nMeet Alex, a professional juggling a demanding job and family life. By implementing efficient time management strategies, he transformed stress into a sense of balance."
              },
              {
                title: "Nurturing Harmony",
                content:
                  "Harmony is the key to work-life balance. It involves integrating professional and personal elements seamlessly, allowing each to enhance the other.",
              },
            ],
          },
          {
            title: "Strategies for Work-Life Balance",
            content:
              "",
            subSections: [
              {
                title: "Set Clear Boundaries",
                content:
                  "Define clear boundaries between work and personal time. Establish specific work hours and adhere to them to prevent work from encroaching on your personal life."
              },
              {
                title: "Prioritize Self-Care",
                content:
                  "Make self-care a non-negotiable priority. Allocate time for activities that nourish your well-being, such as exercise, relaxation, and hobbies.\n\nEmily, a professional feeling overwhelmed, rediscovered her passion for painting. Integrating art into her routine became a cornerstone of her work-life balance.",
              },
              {
                title: "Leverage Technology Mindfully",
                content:
                  "While technology can enhance efficiency, use it mindfully. Set designated times for checking emails and messages to avoid constant digital interruptions.",
              },
            ],
          },
          {
            title: "The Integrity of Work-Life Balance",
            content:
              "",
            subSections: [
              {
                title: "Aligning with Values",
                content:
                  "Work-life balance is not just about time management; it's about aligning your actions with your values. Integrity in balancing work and life leads to a more meaningful existence."
              },
              {
                title: "Communicate Effectively",
                content:
                  "Maintain open communication with colleagues and family members. Clearly express your boundaries and expectations to foster understanding and support.\n\nSarah, a dedicated professional and mother, emphasized open communication with her team and family. This transparency allowed her to navigate responsibilities with integrity.",
              },
              {
                title: "Uphold Professional Integrity",
                content:
                  "Maintain integrity in your professional life by delivering quality work, meeting commitments, and communicating transparently with colleagues.",
              },
              {
                title: "Personal Integrity",
                content:
                  "Honor personal commitments and uphold the promises you make to yourself and others. This builds trust and contributes to a fulfilling life.\n\nEmily, a professional with a busy schedule, emphasized personal integrity by keeping promises to her family, fostering a strong bond",
              },
            ],
          },
        
          
          // Repeat similar structure for other sections
        ],
        howToPractice: {
          header: "How to Start with Work-Life Balance",
          content: "To initiate a journey toward work-life balance, consider the following:",
          steps: [
            "Efficiency Audit: Evaluate your work processes and identify areas for improvement.",
            "Mindful Boundaries: Set clear boundaries for work and personal time.",
            "Values Alignment: Reflect on your core values and ensure your actions align with them.",
          ]
        },

        quotesAndInsights:
          '"Balance, peace, and joy are the fruit of a successful life. It starts with recognizing your talents and finding ways to serve others by using them." - Thomas Kinkade',

        exercises: [
          "Prioritization Exercise: Identify three high-priority tasks for the day.",
          "Time Blocking Activity: Plan your day using time blocks for various activities.",
          "Goal Setting: Set a realistic and achievable goal for the week.",
          "Integrity Reflection: Reflect on how your work aligns with your values. Identify areas for improvement.",
        ],

        goalIdeas: {
          content: "Here are some goal ideas to consider:",
          ideas: [
            "Digital Detox Day: Dedicate a day to disconnect from electronic devices and focus on analog activities for a rejuvenating break.",
            "Mindful Breaks: Incorporate short mindfulness breaks throughout the day to refresh your mind and maintain focus.",
            "Single-Tasking Challenge: Choose a day to focus on one task at a time, avoiding multitasking to enhance efficiency.",
            "Weekend Unplugging: Designate weekends for a digital detox, allowing yourself to recharge and enjoy offline activities.",
            "Delegate Responsibilities: Identify tasks that can be delegated to others, promoting a more balanced workload.",
          ],
        },
        summary:
          "Stress-free productivity is not about doing more; it's about doing what matters with efficiency, balance, and integrity. By implementing strategies like task prioritization, time blocking, and setting realistic goals, you can navigate life with a sense of ease and accomplishment.",

        keyTakeaways: [
          "Stress-free productivity emphasizes efficiency, balance, and integrity.",
          "Prioritization, time blocking, and realistic goal-setting are key strategies for stress-free productivity.",
          "Maintaining integrity involves being honest with commitments and avoiding overcommitment.",
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
