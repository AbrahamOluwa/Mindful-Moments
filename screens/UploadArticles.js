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
    category_id: db.collection('article_topics').doc('76bLzYPw8EFTJdmMy6WD'),
    title:
      "The Power of Mindfulness Meditation: Cultivating Compassion and Authenticity",
    introduction:
      "In the hustle and bustle of our modern lives, finding peace and staying true to ourselves can be a challenge. Enter mindfulness meditation – a practice that not only grounds us in the present but also fosters compassion and authenticity. Join me on a journey through the transformative world of mindfulness, where we'll explore its core values through relatable stories, actionable steps, goal ideas, and practical exercises.",
    sections: [
      {
        title: "Section 1: The Essence of Mindfulness",
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
            title: "Self-Compassion",
            content: "Sarah's journey continued as she discovered self-compassion. By practicing mindfulness, she learned to be as kind to herself as she was to her friends. She forgave herself for past mistakes and found strength in self-love. \n Consider this actionable step: the next time you face a challenge, speak to yourself with the same kindness you'd offer a friend. Embrace self-compassion as a cornerstone of mindfulness.",
          },
          {
            title: "2.2: Compassion for Others",
            content: "As Sarah's self-compassion grew, so did her capacity for compassion toward others. She began to understand that everyone carries their own burdens and struggles. By being present and compassionate, she deepened her relationships and created a positive ripple effect in her community. \n Extend your compassion beyond yourself. Set a goal to perform one act of kindness each day, whether it's a small gesture or a heartfelt conversation."
          },
        ]
      },
      {
        title: "Section 3: Authenticity in Mindfulness",
        content: "Authenticity is the practice of aligning our actions with our true values and beliefs, and mindfulness helps us discover and express our authentic selves.",
        subSections: [
          {
            title: "Self-Discovery",
            content: "David, a corporate executive, found his authentic self through mindfulness. He used to chase external success, but mindfulness allowed him to pause and reflect. He realized his true passion lay in helping others, and he made a career change that aligned with his values.",
          },
          {
            title: "Living in Alignment",
            content: "By practicing mindfulness meditation, David now lives in alignment with his authentic self. He doesn't pretend to be someone he's not to fit in with corporate culture. He brings his true self to work, inspiring his team and fostering a more authentic workplace. \n As a goal, strive to make choices that align with your values. This might involve setting boundaries, saying no when necessary, and embracing your unique journey."
          },
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

    exercises: [
      "Sit comfortably and close your eyes.",
      "Repeat these phrases silently or aloud: May I be happy. May I be healthy. May I live with ease.",
      "Extend these wishes to others: May [name] be happy. May [name] be healthy. May [name] live with ease.",
      "Gradually include friends, family, acquaintances, and even those you have conflicts with.",
      "Breathe deeply and radiate compassion to all beings.",
      "Take a walk in a peaceful place.",
    	"Pay attention to each step and the sensations in your feet.",
      "Observe your surroundings—the sights, sounds, and smells.",
      "Be fully present in the act of walking.",
      "Take a few minutes each day to write down things you're grateful for. This practice shifts your focus to positive aspects of life, fostering mindfulness and appreciation."
    ],
      
    goalIdeas: {
      content: 'Here are some goal ideas to consider:',
      ideas: [
       "Daily Meditation: Commit to a daily mindfulness meditation practice, starting with 5 minutes and gradually increasing.",
       "Journaling: Begin a gratitude journal to foster a positive outlook.",
       "Compassion Project: Engage in a volunteer or community service project to cultivate compassion.",
       "Authentic Living: Set a goal to align your actions with your values in one specific area of your life."
      ]
    },
    summary:
      "Mindfulness meditation is more than a practice; it's a journey toward self-discovery, compassion, and authenticity. Through relatable stories, actionable steps, goal ideas, and practical exercises, we can embark on this transformative path together.",
  
    keyTakeaways: [
      "Mindfulness leads to present moment awareness and non-judgmental acceptance.",
      "Compassion arises from self-compassion and extends to others",
      "Authenticity emerges through self-discovery and living in alignment with our values."
    ],
      ratings: {
        totalRatings: 0,  // Initialize the total number of ratings to 0
        averageRating: 0,  // Initialize the average rating to 0
      },
      userFeedback: [],
    relatedContent: []
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