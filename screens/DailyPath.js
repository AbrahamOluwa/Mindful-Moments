import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput, Image } from "react-native";

const DailyPath = ({ navigation, route }) => {
  //const { day } = route.params;
  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: "https://images.pexels.com/photos/7320648/pexels-photo-7320648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" }}
          style={styles.headerImage}
        />
        <Text style={styles.headerTitle}>Day 1: Clear the Mental Clutter</Text>
        {/* <Text style={styles.headerTitle}>Day {day}: Clear the Mental Clutter</Text> */}
      </View> 
      {step === 1 && (
        <View style={styles.section}>
          <Text style={styles.title}>Welcome to Your First Step!</Text>
          <Text style={styles.paragraph}>
            Right now, your mind might feel like a web of tangled thoughts. Today,
            we’ll start by clearing space in your mind so you can feel lighter and more in control.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleNextStep}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
      {step === 2 && (
        <View style={[styles.section, styles.sectionBlue]}>
          <Text style={styles.subtitle}>Quick Read (2 min)</Text>
          <Text style={styles.paragraph}>
            Your mind is like a cluttered room—when there's too much stuff, you can’t move freely. 
            The same goes for your thoughts. The first step to emotional stability is simple: get 
            your thoughts out of your head and onto paper.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleNextStep}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
      {step === 3 && (
        <View style={[styles.section, styles.sectionGreen]}>
          <Text style={styles.subtitle}>Today’s Action: The Brain Dump</Text>
          <Text style={styles.paragraph}>1️⃣ Set a timer for 3 minutes.</Text>
          <Text style={styles.paragraph}>
            2️⃣ Write everything on your mind—worries, ideas, random thoughts. No filtering. Just let it flow.
          </Text>
          <Text style={styles.paragraph}>
            3️⃣ When the timer stops, look at what you wrote. Any patterns? Any thoughts repeating often?
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleNextStep}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
      {step === 4 && (
        <View style={[styles.section, styles.sectionPurple]}>
          <Text style={styles.subtitle}>Why this works:</Text>
          <Text style={styles.paragraph}>Frees up mental space 💡</Text>
          <Text style={styles.paragraph}>Helps you notice recurring stressors 🔄</Text>
          <Text style={styles.paragraph}>Lowers emotional overwhelm 🌊</Text>
          <TouchableOpacity style={styles.button} onPress={handleNextStep}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
      {step === 5 && (
        <View style={[styles.section, styles.sectionBlue]}>
          <Text style={styles.subtitle}>Quick Reflection:</Text>
          <TextInput
            style={styles.input}
            placeholder="Write one word that describes how you feel after doing this exercise."
          />
          <TouchableOpacity style={styles.button} onPress={handleNextStep}>
            <Text style={styles.buttonText}>Complete Today's Action</Text>
          </TouchableOpacity>
        </View>
      )}
      {step === 6 && (
        <View style={[styles.section, styles.sectionOrange]}>
          <Text style={styles.subtitle}>Instant Reward: You Did It! 🎉</Text>
          <Text style={styles.paragraph}>
            Congratulations! You just took control of your mind instead of letting it control you.
          </Text>
          <Text style={styles.paragraph}>
            Your Brain Dump Badge: 📝✨ (Small progress leads to big changes!)
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Finish</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f7fa",
    padding: 20,
    alignItems: "center",
  },
  headerContainer: {
    width: "100%",
    height: 250,
    overflow: "hidden",
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerTitle: {
    position: "absolute",
    bottom: 20,
    left: 20,
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  section: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  sectionBlue: {
    backgroundColor: "#e0f7fa",
  },
  sectionGreen: {
    backgroundColor: "#e0f2f1",
  },
  sectionPurple: {
    backgroundColor: "#f3e5f5",
  },
  sectionOrange: {
    backgroundColor: "#fff3e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: "#76c7c0",
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default DailyPath;