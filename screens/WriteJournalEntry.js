import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
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

export default function WriteJournalEntry({ navigation }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

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

  const getUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("nonRegisteredUserId");

      if (storedUserId) {
        // User is a non-registered user
        console.log(
          "Retrieved non-registered userId from AsyncStorage:",
          storedUserId
        );
        return storedUserId;
      } else {
        // User is a registered user

        onAuthStateChanged(auth, (user) => {
          if (user) {
            const userId = user.uid;
            console.log("Registered User ID:", userId);
            return userId;
          } else {
            // User is signed out

            console.log("User is signed out");
            // ...
          }
        });
      }
    } catch (error) {
      console.error("Error retrieving user ID:", error);
    }

    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <HStack space={15}>
            <Stack>
              <TouchableOpacity
                onPress={() => navigation.navigate("HomeScreen")}
              >
                <AntDesign
                  name="arrowleft"
                  size={30}
                  color="black"
                  style={{ marginTop: 5 }}
                />
              </TouchableOpacity>
            </Stack>

            <Stack>
              <Text style={styles.header}>Journal Entries</Text>
            </Stack>
          </HStack>

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
    fontSize: 24,
    fontFamily: "SoraSemiBold",
    marginBottom: 20,
  },

  // titleInput: {
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  //   borderRadius: 4,
  //   padding: 10,
  //   marginBottom: 20,
  //   fontFamily: "SoraRegular",
  // },

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

  // notesInput: {
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  //   borderRadius: 4,
  //   padding: 10,
  //   minHeight: 500,
  //   maxHeight: 500,
  //   fontFamily: "SoraRegular",
  // },

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
});
