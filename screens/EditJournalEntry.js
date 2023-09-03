import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { HStack, Stack, useToast, Box, Button } from "native-base";
import { auth, db } from "../firebaseConfig";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function EditJournalEntry({ navigation }) {
  const route = useRoute();
  const { entryId, title, content } = route.params;
  const [selectedEntryId, setSelectedEntryId] = useState(entryId);
  const [journalEntryTitle, setJournalEntryTitle] = useState(title);
  const [journalEntryContent, setJournalEntryContent] = useState(content);
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (text) => {
    setJournalEntryTitle(text);
  };

  const handleNoteChange = (text) => {
    setJournalEntryContent(text);
  };

  useEffect(() => {
    // Set the initial content of the rich text editor
    setJournalEntryTitle(title);
    setJournalEntryContent(content);
    setSelectedEntryId(entryId);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

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

  const handleUpdateEntry = async () => {
    Keyboard.dismiss(); // Dismiss the keyboard

    setIsSubmitting(true);

    const updatedTitle = journalEntryTitle;
    const updatedContent = journalEntryContent;

    if (!updatedTitle || !updatedContent) {
      console.log("Please fill in both title and content before updating.");
      setIsSubmitting(false);
      toast.show({
        render: () => {
          return (
            <Box bg="#ff0e0e" px="4" py="3" rounded="sm" mb={5}>
              <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                Please fill in both title and content before updating.
              </Text>
            </Box>
          );
        },
      });
      return;
    }

    const isUpdated = await updateJournalEntry(
      selectedEntryId,
      updatedTitle,
      updatedContent
    );
    if (isUpdated) {
      setIsSubmitting(false);
      // Show a success message (e.g., using a toast or alert)
      console.log("Journal entry updated successfully!");
    } else {
      setIsSubmitting(false);
      // Show an error message (e.g., using a toast or alert)
      console.log("Failed to update journal entry. Please try again.");
    }
  };

  const updateJournalEntry = async (entryId, updatedTitle, updatedContent) => {
    try {
      const userId = await getUserId();

      const entryRef = doc(
        db,
        "nonRegisteredUsers",
        userId,
        "journal_entries",
        entryId
      );

      // Update the journal entry fields
      await updateDoc(entryRef, {
        title: updatedTitle,
        content: updatedContent,
        updatedAt: serverTimestamp(), // Optional: Update the updatedAt field with the current timestamp
      });

      console.log("Journal entry updated successfully!");
      // Show a success toast
      toast.show({
        render: () => {
          return (
            <Box bg="emerald.500" px="4" py="3" rounded="sm" mb={5}>
              <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                Journal entry updated successfully!
              </Text>
            </Box>
          );
        },
      });
      setTimeout(() => {
        navigation.navigate("AllJournalEntriesScreen");
      }, 2000);
      return true; // Return true to indicate successful update
    } catch (error) {
      console.error("Error updating journal entry:", error);
      // Show an error toast
      toast.show({
        render: () => {
          return (
            <Box bg="#ff0e0e" px="4" py="3" rounded="sm" mb={5}>
              <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                Error updating journal entry! Try again!
              </Text>
            </Box>
          );
        },
      });
      return false; // Return false to indicate update failure
    }
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
                onPress={() => navigation.navigate("AllJournalEntriesScreen")}
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
          {loading ? (
            // Show the loader component while loading is true
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#EF798A" />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <ScrollView>
                <TextInput
                  style={styles.titleInput}
                  value={journalEntryTitle}
                  onChangeText={handleTitleChange}
                  multiline={true}
                />

                <View style={styles.titleInputLine}></View>

                <TextInput
                  style={styles.notesInput}
                  value={journalEntryContent}
                  onChangeText={handleNoteChange}
                  multiline={true}
                />
              </ScrollView>

              {!isSubmitting && (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleUpdateEntry}
                >
                  <Text style={styles.saveButtonText}>Update Entry</Text>
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
                  isLoadingText="Updating Entry"
                >
                  Button
                </Button>
              )}
            </View>
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
