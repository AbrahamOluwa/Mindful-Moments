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
        topic_id: doc(db, "article_topics", "2GQEzcT45vSeSVXpZrDI"),
        shortQuote: "Authenticity is not something we have or don't have. It's a practice, a conscious choice of how we want to live. - Brené Brown",
        title:
          "Living Authentically: Embracing Your True Self",
        introduction:
          "In a world where conformity often takes center stage, living authentically stands as a beacon of self-discovery and fulfillment. In this article, we'll explore the transformative journey of authentic living, highlighting the value of authenticity and the role of mindfulness in embracing your true self.",
        sections: [
          {
            title: "The Essence of Authenticity",
            content:
              "",
            subSections: [
              {
                title: "Why Authenticity Matters",
                content:
                  "Authentic living is the art of being true to yourself, acknowledging your values, desires, and beliefs without pretense or fear of judgment.\n\nMeet Lisa, who spent years trying to meet societal expectations. She felt unfulfilled until she embarked on a journey of self-discovery, embracing her true passions, and living authentically.",
              },
              {
                title: "The Connection Between Authenticity and Mindfulness",
                content:
                  "Authenticity thrives in a mindful environment. Mindfulness, with its focus on present-moment awareness, serves as a powerful tool to unveil authenticity.",
              },
            ],
          },
          {
            title: "Mindfulness and Authenticity",
            content:
              "",
            subSections: [
              {
                title: "Practice Self-Reflection",
                content:
                  "Mindfulness begins with self-reflection. Take moments each day to pause, breathe, and reflect on your thoughts and feelings. This practice allows you to understand yourself better, leading to a more authentic life.",
              },
              {
                title: "Practice Embracing Imperfections",
                content:
                  "Mindfulness teaches us to embrace imperfections. Instead of striving for an idealized self, accept yourself as you are in this moment. Authenticity blossoms when you let go of the need for perfection.\n\nJohn, a high-achieving executive, learned the value of imperfection through mindfulness. By acknowledging his vulnerabilities, he developed more authentic leadership skills, fostering a more open and collaborative workplace.",
              },
            ],
          },
          {
            title: "Living Authentically",
            content:
              "Embracing authenticity means aligning your actions with your values and beliefs. It involves the courage to be vulnerable and true to yourself.",
            subSections: [
              {
                title: "Practice Mindful Decision-Making",
                content:
                  "Mindfulness aids in making conscious decisions. By staying present and attuned to your values, you can make choices that resonate with your authentic self, leading to a more purposeful life.",
              },
              {
                title: "Practice Vulnerability and Connection",
                content:
                  "Brené Brown's research highlights the link between vulnerability and authenticity. Be open about your feelings, fears, and desires in your relationships. Authentic connections flourish when you allow yourself to be vulnerable. \n\nDavid, a reserved introvert, discovered the power of vulnerability through mindfulness. By opening up to his close friends about his true feelings, he strengthened his relationships and lived a more authentic and fulfilling life.",
              },
            ],
          },
          // Repeat similar structure for other sections
        ],
        howToPractice: {
          header: "How to Practice Authenticity and Mindfulness",
          content: "To start your journey towards authentic living, consider the following steps:",
          steps: [
            "Self-Reflection: Set aside time each day for self-reflection. Journal your thoughts and feelings, exploring what truly matters to you.",
            "Embrace Imperfections: Practice self-compassion by acknowledging your imperfections and treating yourself with kindness and understanding",
            "Mindful Decision-Making: Before making important decisions, pause and reflect. Consider whether the choice aligns with your authentic values and desires.",
            "Vulnerability: In your relationships, practice openness and vulnerability by sharing your thoughts and feelings authentically.",
          ]
        },

        quotesAndInsights:
          '"To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment." - Ralph Waldo Emerson',

        exercises: [
          "Practice daily self-reflection for at least 5 minutes.",
          "Write in a journal about your authentic desires and values.",
          "Engage in mindful decision-making by pausing to reflect before making choices.",
        ],

        goalIdeas: {
          content: "Here are some goal ideas to consider:",
          ideas: [
            "Commit to living authentically in one specific aspect of your life, whether in your career, relationships, or personal growth.",
            "Embrace vulnerability by opening up to someone you trust about your authentic self.",
            "Establish a daily mindfulness meditation routine to enhance your self-awareness.",
          ],
        },
        summary:
          "Living authentically is a profound journey of self-discovery and alignment with your true self. By incorporating mindfulness practices into your life, you embark on a transformative path toward a more fulfilling and authentic existence.",

        keyTakeaways: [
          "Authenticity is the practice of embracing your true self without pretense.",
          "Mindfulness fosters self-reflection and helps you make authentic choices.",
          "Vulnerability is a gateway to authentic connections and a more fulfilling life.",
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
