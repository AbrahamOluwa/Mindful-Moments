import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  HStack,
  Stack,
  Button,
  Modal,
  Center,
  useToast,
  Box,
} from "native-base";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, currentUser, getAuth } from "firebase/auth";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable";
import { getUserId } from "../components/home/GetUserId";

export default function WriteJournalEntry({ navigation }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);

  const handleTitleChange = (text) => {
    setTitle(text);
  };

  const handleNoteChange = (text) => {
    setNote(text);
  };

  const saveJournalEntry = async () => {
    setIsSubmitting(true);
    try {
      const userId = await getUserId();

      if (!title || !note) {
        setIsSubmitting(false);
        toast.show({
          render: () => {
            return (
              <Box bg="#ff0e0e" px="4" py="3" rounded="sm" mb={5}>
                <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                  Please fill in both Title and Notes before continuing.
                </Text>
              </Box>
            );
          },
        });
        return;
      }

      try {
        const journalData = {
          title: title,
          content: note,
          createdAt: serverTimestamp(),
        };

        // const userId = getUserId();
        const collectionRef = collection(
          db,
          "nonRegisteredUsers",
          userId,
          "journal_entries"
        );

        await addDoc(collectionRef, journalData);
        console.log("Journal entry saved successfully!", collectionRef.id);

        setIsSubmitting(false);

        // Clear the text input fields
        setTitle("");
        setNote("");

        // Show a success toast
        toast.show({
          render: () => {
            return (
              <Box bg="emerald.500" px="4" py="3" rounded="sm" mb={5}>
                <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                  Journal entry saved successfully!
                </Text>
              </Box>
            );
          },
        });

        navigation.navigate("AllJournalEntriesScreen");
      } catch (error) {
        setIsSubmitting(false);
        console.error("Error saving journal entry:", error);

        // Show an error toast
        toast.show({
          render: () => {
            return (
              <Box bg="#ff0e0e" px="4" py="3" rounded="sm" mb={5}>
                <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                  Error saving journal entry! Try again!
                </Text>
              </Box>
            );
          },
        });
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error saving journal entry:", error);
      // Show an error toast
      toast.show({
        render: () => {
          return (
            <Box bg="#ff0e0e" px="4" py="3" rounded="sm" mb={5}>
              <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                Error saving journal entry! Try again!
              </Text>
            </Box>
          );
        },
      });
    }
  };


  const handleInfoIconPress = () => {
    setShowModal(true);
    AsyncStorage.setItem("modalShown", "true");
  };

  useEffect(() => {
    // Check if the modal has been shown before
    AsyncStorage.getItem("modalShown").then((value) => {
      if (value !== "true") {
        setShowModal(true); // Modal hasn't been shown, display it
      }
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("JournalScreen")}
            >
              <AntDesign
                name="arrowleft"
                size={30}
                color="black"
                style={{ marginTop: -10 }}
              />
            </TouchableOpacity>

            <Text style={styles.header}>Journal Entries</Text>

            <TouchableOpacity onPress={handleInfoIconPress}>
              <Animatable.View
                animation="bounce"
                iterationCount="infinite"
                easing="linear"
              >
                <AntDesign
                  style={{ marginTop: -20 }}
                  name="infocirlceo"
                  size={24}
                  color="blue"
                />
              </Animatable.View>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            <ScrollView>
              <TextInput
                style={styles.titleInput}
                placeholder="Enter title here..."
                placeholderTextColor="#999"
                value={title}
                onChangeText={handleTitleChange}
                multiline={true}
              />

              <View style={styles.titleInputLine}></View>

              <TextInput
                style={styles.notesInput}
                placeholder="Enter notes/journal here..."
                placeholderTextColor="#999"
                value={note}
                onChangeText={handleNoteChange}
                multiline={true}
              />
            </ScrollView>

            {!isSubmitting && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveJournalEntry}
              >
                <Text style={styles.saveButtonText}>Save Entry</Text>
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
                isLoadingText="Saving Entry"
              >
                Button
              </Button>
            )}
          </View>

          {showModal && (
            <Center>
              <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                _backdrop={{
                  _dark: {
                    bg: "coolGray.800",
                  },
                  bg: "warmGray.50",
                }}
                size="lg"
              >
                <Modal.Content maxWidth="350">
                  <Modal.CloseButton />
                  <Modal.Header>
                    <Text style={styles.guideTitle}>Journal Feature Guide</Text>
                  </Modal.Header>
                  <Modal.Body>
                    <Text style={styles.guideText}>
                      Welcome to the Journal feature in our app! This powerful
                      tool allows you to document your thoughts, experiences,
                      and moments in one place. Whether you're keeping a diary
                      or capturing memorable events, our journal feature makes
                      it easy.
                    </Text>
                    <Text style={styles.guideStep}>
                      1. Create Your Journal:
                    </Text>
                    <Text style={styles.guideText}>
                      Start by creating a new journal. Give it a unique title
                      that reflects its purpose. For example, "Travel
                      Adventures," "Daily Thoughts," or "Gratitude Journal."
                    </Text>

                    <Text style={styles.guideStep}>2. Add Your Notes:</Text>
                    <Text style={styles.guideText}>
                      Use your journal to capture important moments in your
                      life. Write about your experiences, thoughts, and
                      feelings. Include details that matter to you.
                    </Text>

                    <Text style={styles.guideText}>
                      Remember, your journal is a personal space to express
                      yourself, so feel free to use it in the way that works
                      best for you. Happy journaling!
                    </Text>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button.Group space={2}>
                      <Button
                        style={{ backgroundColor: "#5bc0de" }}
                        onPress={() => {
                          setShowModal(false);
                        }}
                      >
                        <Text
                          style={{ fontFamily: "SoraMedium", color: "#fff" }}
                        >
                          Close
                        </Text>
                      </Button>
                    </Button.Group>
                  </Modal.Footer>
                </Modal.Content>
              </Modal>
            </Center>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    //backgroundColor: "#FFFFFF",
  },
  header: {
    fontSize: 22,
    fontFamily: "SoraSemiBold",
    marginBottom: 20,
  },

  titleInput: {
    padding: 10,
    fontFamily: "SoraSemiBold",
    fontSize: 16, // Set the font size as desired
    lineHeight: 24, // Set the line height as desired
    color: "#333", // Set the text color as desired
    textAlignVertical: "top", // Start text from the top, not centered vertically
  },

  titleInputLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#333", // Customize the line color
  },

  notesInput: {
    padding: 10,
    fontFamily: "SoraRegular",
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    textAlignVertical: "top",
  },

  saveButton: {
    backgroundColor: "#EF798A",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    fontFamily: "SoraMedium",
    color: "#FFFFFF",
    fontSize: 16,
  },
  guideTitle: {
    fontFamily: "SoraSemiBold",
    fontSize: 16,
    marginBottom: 10,
    // textAlign: "center",
  },
  guideStep: {
    fontFamily: "SoraSemiBold",
    fontSize: 14,
    marginTop: 10,
  },
  guideText: {
    fontFamily: "SoraRegular",
    fontSize: 12,
    marginTop: 5,
  },
  guideTextBold: {
    fontFamily: "SoraSemiBold",
    fontSize: 12,
    marginTop: 5,
  },
});
