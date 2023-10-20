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
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { useRoute } from "@react-navigation/native";
import { HStack, Stack, useToast, Box, Button } from "native-base";
import { auth, db } from "../firebaseConfig";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function EditGratitudeMoment({ navigation }) {
  const route = useRoute();
  const { id, title, moment } = route.params;
  const [selectedEntryId, setSelectedEntryId] = useState(id);
  const [gratitudeMomentTitle, setGratitudeMomentTitle] = useState(title);
  const [gratitudeMomentContent, setGratitudeMomentContent] = useState(moment);
  const titleEditorRef = useRef();
  const momentEditorRef = useRef();
  const toast = useToast();
  //const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (text) => {
    setGratitudeMomentTitle(text);
  };

  const handleMomentChange = (text) => {
    setGratitudeMomentContent(text);
  };

  const handleInsertImage = () => {
    editorRef.current.insertImage("https://example.com/image.jpg");
  };

  useEffect(() => {
    // Set the initial content of the rich text editor
    setGratitudeMomentTitle(title);
    setGratitudeMomentContent(moment);
    setSelectedEntryId(id);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 2000);
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

    const updatedTitle = gratitudeMomentTitle;
    const updatedContent = gratitudeMomentContent;

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

    const isUpdated = await updateGratitudeEntry(
      selectedEntryId,
      updatedTitle,
      updatedContent
    );
    if (isUpdated) {
      // Show a success message (e.g., using a toast or alert)
      setIsSubmitting(false);
      console.log("Gratitude moment updated successfully!");
    } else {
      // Show an error message (e.g., using a toast or alert)
      setIsSubmitting(false);
      console.log("Failed to update gratitude moment. Please try again.");
    }
  };

  const updateGratitudeEntry = async (
    id,
    updatedTitle,
    updatedContent
  ) => {
    try {
      const userId = await getUserId();

      const entryRef = doc(
        db,
        "nonRegisteredUsers",
        userId,
        "gratitude_moments",
        id
      );

      // Update the journal entry fields
      await updateDoc(entryRef, {
        title: updatedTitle,
        moment: updatedContent,
        updatedAt: serverTimestamp(),
      });

      console.log("Gratitude moment updated successfully!");
      // Show a success toast
      toast.show({
        render: () => {
          return (
            <Box bg="emerald.500" px="4" py="3" rounded="sm" mb={5}>
              <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                Gratitude moment updated successfully!
              </Text>
            </Box>
          );
        },
      });
      setTimeout(() => {
        navigation.navigate("AllGratitudeMomentsScreen");
      }, 1000);
      return true; // Return true to indicate successful update
    } catch (error) {
      console.error("Error updating gratitude moment:", error);
      // Show an error toast
      toast.show({
        render: () => {
          return (
            <Box bg="#ff0e0e" px="4" py="3" rounded="sm" mb={5}>
              <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                Error updating gratitude moment! Try again!
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
                onPress={() => navigation.navigate("AllGratitudeMomentsScreen")}
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
              <Text style={styles.header}>Gratitude Entries</Text>
            </Stack>
          </HStack>
         
            <View style={{ flex: 1 }}>
              <ScrollView>
                <TextInput
                  style={styles.titleInput}
                  placeholder="Enter title here..."
                  value={gratitudeMomentTitle}
                  onChangeText={handleTitleChange}
                  multiline={true}
                />

                <View style={styles.titleInputLine}></View>

                <TextInput
                  style={styles.notesInput}
                  placeholder="Enter moments here..."
                  value={gratitudeMomentContent}
                  onChangeText={handleMomentChange}
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
          
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontFamily: "SoraSemiBold",
    marginBottom: 20,
  },

  titleInput: {
    padding: 10,
    fontFamily: "SoraSemiBold",
    fontSize: 16,
    lineHeight: 24, 
    color: "#333", 
    textAlignVertical: "top",
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
  },
  saveButtonText: {
    fontFamily: "SoraMedium",
    color: "#FFFFFF",
    fontSize: 16,
  },
});
