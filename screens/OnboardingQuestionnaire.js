import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const OnboardingQuestionnaire = ({ navigation, route }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { userId } = route.params;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionnairesRef = collection(db, "onboarding_questionnaire");

        // Create a query with orderBy
        const q = query(questionnairesRef, orderBy("createdAt", "asc")); // "asc" for earliest first

        const querySnapshot = await getDocs(q); // Use the query

        const questionList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setQuestions(questionList);
      } catch (error) {
        console.error("Error fetching questions: ", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleSelect = (questionId, option) => {
    setAnswers({
      ...answers,
      [questionId]: option,
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answersRef = await addDoc(
        collection(db, "users", userId, "onboarding_answers"),
        answers
      );

      console.log("User Answers saved:", answers);
      navigation.navigate("HomeScreen"); // Replace with your desired screen
    } catch (error) {
      console.error("Error saving answers: ", error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#ff69b4" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.card, styles.firstCard]}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.paragraph}>
          Please answer the following questions to help us understand your
          personal development needs.
        </Text>
      </View>

      {questions.map((q) => (
        <View style={styles.card} key={q.id}>
          <Text style={styles.question}>{q.question}</Text>
          {q.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                answers[q.id] === option && styles.selectedOption,
              ]}
              onPress={() => handleSelect(q.id, option)}
            >
              <Text
                style={
                  answers[q.id] === option
                    ? styles.selectedOptionText
                    : styles.optionText
                }
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? "Submitting..." : "Submit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe4e1",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  firstCard: {
    marginTop: 30,
  },
  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    fontFamily: "PoppinsSemiBold",
  },
  paragraph: {
    fontSize: 15,
    color: "#666",
    fontFamily: "PoppinsMedium",
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
    color: "#333",
    fontFamily: "PoppinsSemiBold",
  },
  option: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
    // alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: "#ff69b4",
    borderColor: "#ff69b4",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "PoppinsMedium",
  },
  selectedOptionText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "PoppinsMedium",
  },
  button: {
    margin: 20,
    backgroundColor: "#ff69b4",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "PoppinsMedium",
  },
});

export default OnboardingQuestionnaire;
