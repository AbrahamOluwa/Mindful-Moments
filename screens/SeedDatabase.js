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

export default function SeedDatabase() {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to create a user
  async function createUser(userId, name, email) {
    await db.collection("users").doc(userId).set({
      name: name,
      email: email,
      profile_picture: "https://example.com/profile.jpg",
      created_at: serverTimestamp(),
    });
  }

  // Helper function to create a goal
  async function createGoal(userId, goalId, title, description) {
    await db
      .collection("users")
      .doc(userId)
      .collection("goals")
      .doc(goalId)
      .set({
        title: title,
        description: description,
        status: "active",
        deadline: admin.firestore.Timestamp.fromDate(new Date("2025-12-31")),
        created_at: serverTimestamp(),
      });
  }

  // Helper function to create a task for a goal
  async function createTask(userId, goalId, taskId, title, description) {
    await db
      .collection("users")
      .doc(userId)
      .collection("goals")
      .doc(goalId)
      .collection("tasks")
      .doc(taskId)
      .set({
        title: title,
        description: description,
        status: "not_started",
        due_date: admin.firestore.Timestamp.fromDate(new Date("2025-06-30")),
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  // Helper function to create a path
  async function createPath(pathId, title, description, isPublic) {
    await db.collection("paths").doc(pathId).set({
      title: title,
      description: description,
      is_public: isPublic,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Helper function to create a resource
  async function createResource(resourceId, type, title, contentUrl, category) {
    await db.collection("resources").doc(resourceId).set({
      type: type,
      title: title,
      content_url: contentUrl,
      category: category,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Helper function to create user progress
  async function createUserProgress(
    userId,
    progressId,
    pathId,
    goalId,
    status,
    progress
  ) {
    await db
      .collection("users")
      .doc(userId)
      .collection("progress")
      .doc(progressId)
      .set({
        path_id: pathId,
        goal_id: goalId,
        status: status,
        progress: progress,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  // Helper function to create feedback for a resource
  async function createFeedback(
    resourceId,
    feedbackId,
    userId,
    rating,
    comment
  ) {
    await db
      .collection("resources")
      .doc(resourceId)
      .collection("feedback")
      .doc(feedbackId)
      .set({
        user_id: userId,
        rating: rating,
        comment: comment,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  // Helper function to create a notification
  async function createNotification(
    userId,
    notificationId,
    title,
    content,
    type
  ) {
    await db
      .collection("users")
      .doc(userId)
      .collection("notifications")
      .doc(notificationId)
      .set({
        title: title,
        content: content,
        type: type,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  // Function to insert sample data
  async function createSampleData() {
    // Create users
    await createUser("user123", "John Doe", "john@example.com");
    await createUser("user456", "Jane Smith", "jane@example.com");

    // Create goals for users
    await createGoal(
      "user123",
      "goal123",
      "Learn JavaScript",
      "Complete the JavaScript basics course"
    );
    await createGoal(
      "user123",
      "goal124",
      "Build a Portfolio",
      "Create a personal portfolio website"
    );

    await createGoal(
      "user456",
      "goal125",
      "Learn Python",
      "Complete the Python basics course"
    );

    // Create tasks for goals
    await createTask(
      "user123",
      "goal123",
      "task123",
      "Complete Chapter 1",
      "Read and complete exercises from Chapter 1 of JavaScript Basics"
    );
    await createTask(
      "user123",
      "goal123",
      "task124",
      "Complete Chapter 2",
      "Read and complete exercises from Chapter 2 of JavaScript Basics"
    );

    // Create a path
    await createPath(
      "path001",
      "Web Development",
      "A roadmap to become a web developer",
      true
    );

    // Create resources
    await createResource(
      "resource001",
      "video",
      "Introduction to HTML",
      "https://example.com/html_intro",
      "web development"
    );
    await createResource(
      "resource002",
      "article",
      "Getting Started with CSS",
      "https://example.com/css_intro",
      "web development"
    );

    // Create user progress
    await createUserProgress(
      "user123",
      "progress123",
      "path001",
      "goal123",
      "in_progress",
      45
    );
    await createUserProgress(
      "user456",
      "progress124",
      "path001",
      "goal125",
      "not_started",
      0
    );

    // Create feedback for resources
    await createFeedback(
      "resource001",
      "feedback001",
      "user123",
      5,
      "Great introduction video!"
    );
    await createFeedback(
      "resource002",
      "feedback002",
      "user456",
      4,
      "Very helpful article."
    );

    // Create notifications for users
    await createNotification(
      "user123",
      "notification001",
      "New Milestone",
      "You have completed a milestone!",
      "milestone_update"
    );
    await createNotification(
      "user456",
      "notification002",
      "New Resource",
      "A new article on CSS is available.",
      "new_resource"
    );

    console.log("Sample data created successfully!");
  }

  // Import the Firebase Admin SDK
  const admin = require("firebase-admin");

  // Initialize Firebase with your credentials
  admin.initializeApp({
    credential: admin.credential.cert(
      "path/to/your/firebase-credentials-file.json"
    ),
  });

  const db = admin.firestore();

  // Helper function to create a user
  async function createUser(userId, name, email) {
    await db.collection("users").doc(userId).set({
      name: name,
      email: email,
      profile_picture: "https://example.com/profile.jpg",
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      last_login: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Helper function to create a goal
  async function createGoal(
    userId,
    goalId,
    title,
    description,
    status,
    deadline
  ) {
    await db
      .collection("users")
      .doc(userId)
      .collection("goals")
      .doc(goalId)
      .set({
        title: title,
        description: description,
        status: status,
        deadline: admin.firestore.Timestamp.fromDate(new Date(deadline)),
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  // Helper function to create a task for a goal
  async function createTask(
    userId,
    goalId,
    taskId,
    title,
    description,
    status,
    dueDate
  ) {
    await db
      .collection("users")
      .doc(userId)
      .collection("goals")
      .doc(goalId)
      .collection("tasks")
      .doc(taskId)
      .set({
        title: title,
        description: description,
        status: status,
        due_date: admin.firestore.Timestamp.fromDate(new Date(dueDate)),
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  // Helper function to create a path
  async function createPath(pathId, title, description, isPublic) {
    await db.collection("paths").doc(pathId).set({
      title: title,
      description: description,
      is_public: isPublic,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Helper function to create a resource
  async function createResource(resourceId, type, title, contentUrl, category) {
    await db.collection("resources").doc(resourceId).set({
      type: type,
      title: title,
      content_url: contentUrl,
      category: category,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Helper function to create user progress
  async function createUserProgress(
    userId,
    progressId,
    pathId,
    goalId,
    status,
    progress
  ) {
    await db
      .collection("users")
      .doc(userId)
      .collection("progress")
      .doc(progressId)
      .set({
        path_id: pathId,
        goal_id: goalId,
        status: status,
        progress: progress,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  // Helper function to create feedback for a resource
  async function createFeedback(
    resourceId,
    feedbackId,
    userId,
    rating,
    comment
  ) {
    await db
      .collection("resources")
      .doc(resourceId)
      .collection("feedback")
      .doc(feedbackId)
      .set({
        user_id: userId,
        rating: rating,
        comment: comment,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  // Helper function to create a notification
  async function createNotification(
    userId,
    notificationId,
    title,
    content,
    type
  ) {
    await db
      .collection("users")
      .doc(userId)
      .collection("notifications")
      .doc(notificationId)
      .set({
        title: title,
        content: content,
        type: type,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  // Function to insert sample data
  async function createSampleData() {
    // Create Users
    await createUser("user123", "John Doe", "john.doe@example.com");
    await createUser("user456", "Jane Smith", "jane.smith@example.com");

    // Create Goals for John Doe
    await createGoal(
      "user123",
      "goal123",
      "Learn JavaScript",
      "Complete the JavaScript basics course",
      "in_progress",
      "2025-12-31"
    );
    await createGoal(
      "user123",
      "goal124",
      "Build Portfolio",
      "Create a personal portfolio website",
      "not_started",
      "2025-06-30"
    );

    // Create Goals for Jane Smith
    await createGoal(
      "user456",
      "goal125",
      "Learn Python",
      "Complete Python basics and advanced topics",
      "not_started",
      "2025-10-15"
    );

    // Create Tasks for John's JavaScript Goal
    await createTask(
      "user123",
      "goal123",
      "task123",
      "Complete Chapter 1",
      "Complete exercises and notes from Chapter 1",
      "not_started",
      "2025-05-01"
    );
    await createTask(
      "user123",
      "goal123",
      "task124",
      "Complete Chapter 2",
      "Complete exercises and notes from Chapter 2",
      "not_started",
      "2025-06-01"
    );

    // Create a Learning Path
    await createPath(
      "path001",
      "Web Development",
      "Learn full-stack web development, starting from HTML and CSS",
      true
    );

    // Create Resources for the Web Development Path
    await createResource(
      "resource001",
      "video",
      "HTML Basics",
      "https://www.example.com/html-basics",
      "Web Development"
    );
    await createResource(
      "resource002",
      "article",
      "CSS for Beginners",
      "https://www.example.com/css-for-beginners",
      "Web Development"
    );

    // Create User Progress for John Doe
    await createUserProgress(
      "user123",
      "progress123",
      "path001",
      "goal123",
      "in_progress",
      30
    );

    // Create Feedback for HTML Basics Resource
    await createFeedback(
      "resource001",
      "feedback001",
      "user123",
      5,
      "Great introduction to HTML!"
    );

    // Create Notifications for John Doe
    await createNotification(
      "user123",
      "notification001",
      "Milestone Reached",
      "You’ve completed 30% of your JavaScript goal.",
      "milestone_update"
    );

    console.log("Sample data created successfully!");
  }

  // Import the Firebase Admin SDK
  const admin = require("firebase-admin");

  // Initialize Firebase with your credentials
  admin.initializeApp({
    credential: admin.credential.cert(
      "path/to/your/firebase-credentials-file.json"
    ),
  });

  const db = admin.firestore();

  // Helper function to create a user
  async function createUser(userId, name, email) {
    await db.collection("users").doc(userId).set({
      name: name,
      email: email,
      profile_picture: "https://example.com/profile.jpg",
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      last_login: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Helper function to create a goal
  async function createGoal(
    userId,
    goalId,
    title,
    description,
    status,
    deadline
  ) {
    await db
      .collection("users")
      .doc(userId)
      .collection("goals")
      .doc(goalId)
      .set({
        title: title,
        description: description,
        status: status,
        deadline: admin.firestore.Timestamp.fromDate(new Date(deadline)),
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  // Helper function to create a task for a goal
  async function createTask(
    userId,
    goalId,
    taskId,
    title,
    description,
    status,
    dueDate
  ) {
    await db
      .collection("users")
      .doc(userId)
      .collection("goals")
      .doc(goalId)
      .collection("tasks")
      .doc(taskId)
      .set({
        title: title,
        description: description,
        status: status,
        due_date: admin.firestore.Timestamp.fromDate(new Date(dueDate)),
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  // Helper function to create a path
  async function createPath(pathId, title, description, isPublic) {
    await db.collection("paths").doc(pathId).set({
      title: title,
      description: description,
      is_public: isPublic,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Helper function to create a path milestone
  async function createPathMilestone(
    pathId,
    milestoneId,
    title,
    description,
    dueDate
  ) {
    await db
      .collection("paths")
      .doc(pathId)
      .collection("milestones")
      .doc(milestoneId)
      .set({
        title: title,
        description: description,
        due_date: admin.firestore.Timestamp.fromDate(new Date(dueDate)),
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  // Helper function to create a path resource
  async function createPathResource(
    pathId,
    resourceId,
    type,
    title,
    contentUrl
  ) {
    await db
      .collection("paths")
      .doc(pathId)
      .collection("resources")
      .doc(resourceId)
      .set({
        type: type,
        title: title,
        content_url: contentUrl,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  // Helper function to create a journal entry
  async function createJournal(userId, journalId, entryDate, content) {
    await db
      .collection("users")
      .doc(userId)
      .collection("journals")
      .doc(journalId)
      .set({
        entry_date: admin.firestore.Timestamp.fromDate(new Date(entryDate)),
        content: content,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  // Helper function to create a gratitude moment
  async function createGratitudeMoment(
    userId,
    gratitudeId,
    momentDate,
    description
  ) {
    await db
      .collection("users")
      .doc(userId)
      .collection("gratitude")
      .doc(gratitudeId)
      .set({
        moment_date: admin.firestore.Timestamp.fromDate(new Date(momentDate)),
        description: description,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  // Helper function to create a meditation session
  async function createMeditation(
    userId,
    meditationId,
    sessionDate,
    duration,
    type
  ) {
    await db
      .collection("users")
      .doc(userId)
      .collection("meditations")
      .doc(meditationId)
      .set({
        session_date: admin.firestore.Timestamp.fromDate(new Date(sessionDate)),
        duration: duration,
        type: type, // e.g., "guided", "breathing", "silent"
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  // Function to insert sample data
  async function createSampleData() {
    // Create Users
    await createUser("user123", "John Doe", "john.doe@example.com");
    await createUser("user456", "Jane Smith", "jane.smith@example.com");

    // Create Goals for John Doe
    await createGoal(
      "user123",
      "goal123",
      "Learn JavaScript",
      "Complete the JavaScript basics course",
      "in_progress",
      "2025-12-31"
    );

    // Create Goals for Jane Smith
    await createGoal(
      "user456",
      "goal125",
      "Learn Python",
      "Complete Python basics and advanced topics",
      "not_started",
      "2025-10-15"
    );

    // Create Paths
    await createPath(
      "path001",
      "Web Development",
      "Learn full-stack web development, starting from HTML and CSS",
      true
    );

    // Create Path Milestones
    await createPathMilestone(
      "path001",
      "milestone001",
      "Complete HTML Basics",
      "Complete the HTML Basics course",
      "2025-06-01"
    );
    await createPathMilestone(
      "path001",
      "milestone002",
      "Complete CSS Basics",
      "Complete the CSS Basics course",
      "2025-07-01"
    );

    // Create Path Resources
    await createPathResource(
      "path001",
      "resource001",
      "video",
      "HTML Basics",
      "https://www.example.com/html-basics"
    );
    await createPathResource(
      "path001",
      "resource002",
      "article",
      "CSS for Beginners",
      "https://www.example.com/css-for-beginners"
    );

    // Create Journal for John
    await createJournal(
      "user123",
      "journal001",
      "2025-05-01",
      "Today I completed the first chapter of the JavaScript course."
    );

    // Create Gratitude Moment for John
    await createGratitudeMoment(
      "user123",
      "gratitude001",
      "2025-05-01",
      "I am grateful for the opportunity to learn something new today."
    );

    // Create Meditation Session for John
    await createMeditation(
      "user123",
      "meditation001",
      "2025-05-01",
      15,
      "breathing"
    );

    console.log("Sample data created successfully!");
  }

  // Call function to create sample data
  createSampleData().catch((error) => {
    console.error("Error creating sample data: ", error);
  });

  // Call function to create sample data
  createSampleData().catch((error) => {
    console.error("Error creating sample data: ", error);
  });

  // Call function to create sample data
  createSampleData().catch((error) => {
    console.error("Error creating sample data: ", error);
  });

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
