import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  HStack,
  Stack,
  Button,
  useToast,
  Box,
} from "native-base";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RecordGratitudeMoment({ navigation }) {
  const [title, setTitle] = useState("");
  const [moment, setMoment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleEditorRef = useRef();
  const momentEditorRef = useRef();
  const toast = useToast();

  const handleTitleChange = (text) => {
    setTitle(text);
  };

  const handleMomentChange = (text) => {
    setMoment(text);
  };

  const handleInsertImage = () => {
    editorRef.current.insertImage("https://example.com/image.jpg");
  };

  const saveGratitidueMoment1 = () => {
    // Save the journal entry using the title and note values
    // You can perform any required operations here, such as storing in a database
    console.log("Title:", title);
    console.log("Moment:", moment);

    // Clear the text input fields
    setTitle("");
    setMoment("");

    navigation.navigate("AllGratitudeMomentsScreen");
  };

  const saveGratitidueMoment = async () => {
    setIsSubmitting(true);
    try {
    
      const userId = await getUserId();

      if(!title || !moment ) {
        setIsSubmitting(false);
        toast.show({
          render: () => {
            return (
              <Box bg="#ff0e0e" px="4" py="3" rounded="sm" mb={5}>
                <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                  Please fill in both Title and Moments before continuing.
                </Text>
              </Box>
            );
          },
        });
        return;
      }

      try {
        const gratitudeData = {
          title: title,
          moment: moment,
          createdAt: serverTimestamp(),
        };

        const collectionRef = collection(
          db,
          "nonRegisteredUsers",
          userId,
          "gratitude_moments"
        );

        await addDoc(collectionRef, gratitudeData);
        console.log("Gratitude moment saved successfully!", collectionRef.id);

        setIsSubmitting(false);

        setTitle("");
        setMoment("");

        // Show a success toast
        toast.show({
          render: () => {
            return (
              <Box bg="emerald.500" px="4" py="3" rounded="sm" mb={5}>
                <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                  Gratitude moment saved successfully!
                </Text>
              </Box>
            );
          },
        });

        setTimeout(() => {
          navigation.navigate("AllGratitudeMomentsScreen");
        }, 2000);
      } catch (error) {
        setIsSubmitting(false);
        console.error("Error saving gratitude moment:", error);

        // Show an error toast
        toast.show({
          render: () => {
            return (
              <Box bg="#ff0e0e" px="4" py="3" rounded="sm" mb={5}>
                <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                  Error saving gratitude moment! Try again!
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
                Error saving gratitude moment! Try again!
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
      <View style={styles.container}>
        {/* Header */}

        <HStack space={15}>
          <Stack>
            <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
              <AntDesign
                name="arrowleft"
                size={30}
                color="black"
                style={{ marginTop: 5 }}
              />
            </TouchableOpacity>
          </Stack>

          <Stack>
            <Text style={styles.header}>Gratitude Moments</Text>
          </Stack>
        </HStack>
        {/* <Text style={styles.header}>Gratitude Moments</Text> */}

        <View style={{ flex: 1 }}>
          <RichEditor
            ref={titleEditorRef}
            style={{
              borderWidth: 1,
              borderColor: "gray",
              marginBottom: 10,
              minHeight: 40,
            }}
            containerStyle={{ backgroundColor: "transparent" }}
            onChange={handleTitleChange}
            initialContentHTML={title}
            placeholder="Title..."
            androidHardwareAccelerationDisabled={true}
          />
          <RichEditor
            ref={momentEditorRef}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "gray",
              marginBottom: 10,
            }}
            containerStyle={{ backgroundColor: "transparent" }}
            onChange={handleMomentChange}
            initialContentHTML={moment}
            placeholder="Moments..."
            androidHardwareAccelerationDisabled={true}
          />
          <RichToolbar
            getEditor={() => momentEditorRef.current}
            selectedIconTint="purple"
            iconTint="gray"
            onPressAddImage={handleInsertImage}
          />

          {!isSubmitting && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveGratitidueMoment}
            >
              <Text style={styles.saveButtonText}>Save Moment</Text>
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
              isLoadingText="Saving Moment"
            >
              Button
            </Button>
          )}

         
        </View>
      </View>
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
