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
        topic_id: doc(db, "article_topics", "gTdZvXc1n3TQsWDWgWkK"),
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
            title: "The Art of Goal Setting",
            content:
              "",
            subSections: [
              {
                title: "S.M.A.R.T. Goals",
                content:
                  "Goal setting becomes more effective when you use the S.M.A.R.T. criteria as a guideline. S.M.A.R.T. stands for Specific, Measurable, Achievable, Relevant, and Time-bound. Let's break down what each component means and provide examples to help you start setting meaningful goals:",
                  examples: [
                    {
                      title: 'Specific',
                      content:
                        'Your goal should be clear and specific, leaving no room for ambiguity. It answers the questions: What, why, and how?\n\nExample: Instead of "I want to get fit," make it "I want to lose 15 pounds by following a balanced diet and exercising regularly to improve my overall health."',
                    },
                    {
                      title: 'Measurable',
                      content:
                        'A measurable goal allows you to track your progress and know when you\'ve achieved it. It includes quantifiable criteria.\n\nExample: Instead of "I want to save money," make it "I want to save $1,000 by the end of six months by setting aside $167 per month."',
                    },
                    {
                      title: 'Achievable',
                      content:
                        'An achievable goal is realistic and attainable. While it should stretch your abilities, it should still be possible to reach.\n\nExample: If you\'re starting a new fitness routine, it\'s more achievable to aim for a 5% increase in strength in three months rather than aiming to become a bodybuilder.',
                    },
                    {
                      title: 'Relevant',
                      content:
                        'Your goal should be relevant to your values, desires, and long-term objectives. It should make sense in the broader context of your life.\n\nExample: If you\'re passionate about environmental conservation, a relevant goal might be "I want to reduce my household waste by 50% within six months by practicing recycling and composting."',
                    },
                    {
                      title: 'Time-bound',
                      content:
                        'A time-bound goal has a set timeframe for completion. This adds urgency and helps prevent procrastination.\n\nExample: Instead of "I want to write a book," make it "I want to complete the first draft of my novel within one year by writing at least 500 words every day."',
                    },
                  ],
              },
              {
                title: "Embracing Resilience",
                content:
                  "Goal pursuit often involves setbacks and obstacles. Resilience, the ability to bounce back from adversity, is a valuable trait cultivated through goal setting.",
              },
            ],
          },
          {
            title: "Achieving Your Goals",
            content:
              "",
            subSections: [
              {
                title: "Break It Down",
                content:
                  "Mindfulness aids in making conscious decisions. By staying present and attuned to your values, you can make choices that resonate with your authentic self, leading to a more purposeful life.",
                  examples: [
                    {
                      title: 'Example: Goal - To write and publish a book within one year.',
                      content:
                        'Breaking It Down:',
                        steps: [
                          "Outline Your Book (Month 1): Start by outlining your book's chapters, main ideas, and structure. Set a deadline to complete the outline within the first month.",
                          "Set Writing Targets (Months 2-11): Divide the writing process into monthly or weekly targets. For instance, aim to write 10,000 words each month, or 2,500 words per week. Adjust these targets based on your writing pace and other commitments.",
                          "Edit and Revise (Months 9-12): Allocate the last few months for thorough editing and revision. Review each chapter, seek feedback from beta readers, and polish your manuscript.",
                          "Design and Formatting (Month 11-12): Plan the book's cover design and interior formatting. You might hire professionals or do it yourself if you have design skills.",
                          "Publish and Promote (Month 12): Publish your book through a self-publishing platform or seek a publisher. Promote your book through social media, author websites, or book launches."

                        ]
                    },
                    // {
                    //   title: 'Example 2: Goal - To run a marathon in six months.',
                    //   content:
                    //     'Breaking It Down:\n1. Assess Current Fitness (Week 1): Begin with assessing your current fitness level. Measure your endurance, pace, and any existing injuries...\n2. Create a Training Plan (Week 2): Develop a six-month training plan...',
                    // },
                  ],
              },
              
            ],
          },
          // Repeat similar structure for other sections
        ],
        howToPractice: {
          header: "How to Start Goal Setting for Personal Growth",
          content: "To embark on your journey of goal setting for growth, self-awareness, and resilience, follow these steps:",
          steps: [
            "Self-Reflection: Assess your values, desires, and priorities to identify meaningful goals.",
            "S.M.A.R.T. Goals: Apply the S.M.A.R.T. framework to make your goals specific, measurable, achievable, relevant, and time-bound.",
            "Growth-Oriented Goals: Select goals that challenge you and align with your personal growth aspirations.",
            "Resilience Building: Embrace setbacks as opportunities for growth and resilience development.",
            "Progress Tracking: Break your goals into manageable steps and monitor your progress regularly.",
          ]
        },

        quotesAndInsights:
          '"Setting goals is the first step in turning the invisible into the visible." - Tony Robbins',

        exercises: [
          "Goal Journal: Start a journal to record your goals, progress, and setbacks.",
          "Self-Reflection: Spend time in self-reflection to understand your values and desires, guiding your goal setting.",
          "S.M.A.R.T. Goal Setting: Practice setting S.M.A.R.T. goals for various aspects of your life.",
        ],

        goalIdeas: {
          content: "Here are some goal ideas to consider:",
          ideas: [
            "Skill Mastery for Career Advancement: Acquire a new skill or certification to advance in your career. For instance, you can set a goal like, I will obtain a professional certification within the next year to advance in my career.",
            "Continuous Learning for Personal Growth: Commit to lifelong learning and personal development through a goal like, I will read one non-fiction book every month to broaden my knowledge and perspective.",
            "Strengthening Relationships: Focus on enhancing your relationships and social connections with a goal like, I will spend quality time with my loved ones by organizing a monthly family night.",
            "Self-Reflection and Gratitude Practice: Cultivate self-awareness and gratitude by setting a goal like, I will journal about my thoughts and feelings for 20 minutes each day to gain insight into my inner self and practice gratitude."
          ],
        },
        summary:
          "This article provides insights into the importance of goal setting and achievement in personal development, emphasizing values like growth, self-awareness, and resilience. It includes relatable stories, practical exercises, and guidance on how to start setting meaningful goals, ultimately serving as a roadmap to becoming your best self.",

        keyTakeaways: [
          "Goals serve as milestones in personal growth, fostering self-awareness and resilience.",
          "S.M.A.R.T. goals ensure clarity and attainability in goal setting",
          "Embracing setbacks and celebrating progress are integral to goal achievement.",
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
