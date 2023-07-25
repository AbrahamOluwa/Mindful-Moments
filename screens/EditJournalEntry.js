import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { useRoute } from "@react-navigation/native";
import { HStack, Stack, useToast, Box } from "native-base";
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
  const titleEditorRef = useRef();
  const noteEditorRef = useRef();
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  const handleTitleChange = (text) => {
    setJournalEntryTitle(text);
  };

  const handleNoteChange = (text) => {
    setJournalEntryContent(text);
  };

  const handleInsertImage = () => {
    editorRef.current.insertImage("https://example.com/image.jpg");
  };

  useEffect(() => {
    // Set the initial content of the rich text editor
    setJournalEntryTitle(title);
    setJournalEntryContent(content);
    setSelectedEntryId(entryId);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [content]);

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
                Journal entry saved successfully!
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
      return false; // Return false to indicate update failure
    }
  };

  const handleUpdateEntry = async () => {
    Keyboard.dismiss(); // Dismiss the keyboard

    const updatedTitle = journalEntryTitle;
    const updatedContent = journalEntryContent;

    if (!updatedTitle || !updatedContent) {
      console.log("Please fill in both title and content before updating.");
      return;
    }

    const isUpdated = await updateJournalEntry(
      selectedEntryId,
      updatedTitle,
      updatedContent
    );
    if (isUpdated) {
      // Show a success message (e.g., using a toast or alert)
      console.log("Journal entry updated successfully!");
    } else {
      // Show an error message (e.g., using a toast or alert)
      console.log("Failed to update journal entry. Please try again.");
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
            <View style={{flex: 1}}>
              <RichEditor
                ref={titleEditorRef}
                style={{
                  //flex: 1,
                  borderWidth: 1,
                  borderColor: "gray",
                  marginBottom: 10,
                  minHeight: 40,
                }}
                onChange={handleTitleChange}
                initialContentHTML={journalEntryTitle}
                androidHardwareAccelerationDisabled={true}
              />
              <ScrollView>
                <RichEditor
                  ref={noteEditorRef}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: "gray",
                    marginBottom: 1,
                    height: 300,
                  }}
                  onChange={handleNoteChange}
                  initialContentHTML={journalEntryContent}
                  androidHardwareAccelerationDisabled={true}
                />
              </ScrollView>
              <RichToolbar
                getEditor={() => noteEditorRef.current}
                selectedIconTint="purple"
                iconTint="gray"
                onPressAddImage={handleInsertImage}
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdateEntry}
              >
                <Text style={styles.saveButtonText}>Update Entry</Text>
              </TouchableOpacity>
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
  saveButton: {
    backgroundColor: "#EF798A",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  saveButtonText: {
    fontFamily: "SoraMedium",
    color: "#FFFFFF",
    fontSize: 16,
  },
});
