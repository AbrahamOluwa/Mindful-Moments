import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
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
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setUid(user.uid);
  //     if (user) {
  //       const isAnonymous = checkAnonymousSignIn();
  //       if (isAnonymous) {
  //         const userId = getUserId();
  //         // Do something with the user ID for the non-registered user
  //         console.log("Anonymous User ID:", userId);
  //       } else {
  //         // User is signed in with a registered account
  //         // You can access the user ID using currentUser.uid
  //         const userId = getUserId();
  //         // Do something with the registered user ID
  //         console.log("Registered User ID:", userId);
  //       }
  //     } else {
  //       // User is signed out
  //     }
  //   });

  //   // Clean up the listener when component unmounts
  //   return () => unsubscribe();
  // }, []);

  // ...

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleEditorRef = useRef();
  const noteEditorRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  const handleTitleChange = (text) => {
    setTitle(text);
  };

  const handleNoteChange = (text) => {
    setNote(text);
  };

  const handleInsertImage = () => {
    editorRef.current.insertImage("https://example.com/image.jpg");
  };

  // const saveJournalEntry = async () => {
  //   // const user = auth.currentUser;

  //   // if (user) {
  //   //   const isAnonymous = checkAnonymousSignIn();
  //   //   const userId = getUserId();

  //   //   if (isAnonymous) {
  //   //     // Save data for non-registered user
  //   //     console.log('annon')
  //   //     //saveJournalEntryForNonRegisteredUser(userId, journalEntryData);
  //   //   } else {
  //   //     // Save data for registered user
  //   //     //saveJournalEntryForRegisteredUser(userId, journalEntryData);

  //   //     console.log('not annon')
  //   //   }
  //   // }

  //   try {
  //     const journalData = {
  //       title: title,
  //       content: note,
  //       createdAt: serverTimestamp(),
  //     };

  //    // const userId = getUserId();
  //     const collectionRef = collection(db, "nonRegisteredUsers", uid, "journal_entries");

  //     await addDoc(collectionRef, journalData);
  //     console.log("Journal entry saved successfully!");

  //   } catch (error) {
  //     console.error('Error saving journal entry:', error);
  //   }

  //   // Clear the text input fields
  //   setTitle("");
  //   setNote("");

  //   navigation.navigate("AllJournalEntriesScreen");
  // };

  const saveJournalEntry = async () => {
    setIsSubmitting(true);
    try {
      // Step 1: Get the user ID
      const userId = await getUserId();

      // Step 2: Save the journal entry
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

        setTimeout(() => {
          navigation.navigate("AllJournalEntriesScreen");
        }, 2000);
      } catch (error) {
        setIsSubmitting(false);
        console.error("Error saving journal entry:", error);

        // Show an error toast
        toast.show({
          render: () => {
            return (
              <Box bg="red" px="4" py="3" rounded="sm" mb={5}>
                <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                  Error saving journal entry!
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
            <Box bg="red" px="4" py="3" rounded="sm" mb={5}>
              <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                Error saving journal entry!
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
              initialContentHTML={title}
              placeholder="Title..."
              androidHardwareAccelerationDisabled={true}
            />

            <RichEditor
              ref={noteEditorRef}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "gray",
                marginBottom: 1,
              }}
              onChange={handleNoteChange}
              initialContentHTML={note}
              placeholder="Notes..."
              androidHardwareAccelerationDisabled={true}
            />

            <RichToolbar
              getEditor={() => noteEditorRef.current}
              selectedIconTint="purple"
              iconTint="gray"
              onPressAddImage={handleInsertImage}
            />

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
          {/* <TouchableOpacity style={styles.saveButton} onPress={handleSaveEntry}>
          <Text style={styles.saveButtonText}>Save Entry</Text>
        </TouchableOpacity> */}
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
  input: {
    height: 200,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 10,
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
