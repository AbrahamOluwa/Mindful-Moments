import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { HStack, Stack, Button, useToast, Box, Center, Modal } from "native-base";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable";
import { getUserId } from "../components/home/GetUserId";

export default function RecordGratitudeMoment({ navigation }) {
  const [title, setTitle] = useState("");
  const [moment, setMoment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);

  const handleTitleChange = (text) => {
    setTitle(text);
  };

  const handleMomentChange = (text) => {
    setMoment(text);
  };

  const saveGratitidueMoment = async () => {
    setIsSubmitting(true);
    try {
      const userId = await getUserId();

      if (!title || !moment) {
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
        //console.log('gData', gratitudeData);

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

        navigation.navigate("AllGratitudeMomentsScreen");

        // setTimeout(() => {
        //   navigation.navigate("AllGratitudeMomentsScreen");
        // }, 2000);
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
      <View style={styles.container}>
        {/* Header */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("GratitudeScreen")}
          >
            <AntDesign
              name="arrowleft"
              size={30}
              color="black"
              style={{ marginTop: -10 }}
            />
          </TouchableOpacity>

          <Text style={styles.header}>Gratitude Moments</Text>

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

            <View style={styles.notesInputContainer}>
              <TextInput
                style={styles.notesInput}
                placeholder="Enter moments here..."
                placeholderTextColor="#999"
                value={moment}
                onChangeText={handleMomentChange}
                multiline={true}
                // numberOfLines={50} // Set the initial number of lines for the input
                // scrollEnabled={true} // Enable scrolling for long text
              />
            </View>
          </ScrollView>

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
                  <Text style={styles.guideTitle}>
                    Gratitude Moments Guide
                  </Text>
                </Modal.Header>
                <Modal.Body>
                  <Text style={styles.guideText}>
                    Welcome to the Gratitude Moments feature in our app! This
                    feature is designed to help you express gratitude and
                    capture the moments in life that you're thankful for.
                    Whether it's a simple pleasure, a meaningful memory, or an
                    act of kindness, this feature allows you to acknowledge and
                    remember the good things in your life. Here's how to use it:
                  </Text>
                  <Text style={styles.guideStep}>
                    1. Create a Gratitude Moment:
                  </Text>
                  <Text style={styles.guideText}>
                    Start by creating a new gratitude moment. Choose a title
                    that reflects what you're grateful for. For example, "Family
                    Dinner," "Beautiful Sunrise," or "Acts of Kindness."
                  </Text>

                  <Text style={styles.guideStep}>2. Add Your Moments:</Text>
                  <Text style={styles.guideText}>
                    Use your gratitude moment to describe what you're grateful
                    for. Write about why it's important to you and how it makes
                    you feel. Express your appreciation for the moment and savor
                    the positive emotions associated with it.
                  </Text>

                  <Text style={styles.guideText}>
                    Remember, your gratitude moments are a personal space for
                    positivity, reflection, and appreciation. Use them in a way
                    that resonates with you, and enjoy the practice of
                    gratitude.
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
                      <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                        Cancel
                      </Text>
                    </Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </Center>
        )}
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
    fontSize: 22,
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

  notesInputContainer: {
    //flex: 1,
  },


  notesInput: {
    padding: 10,
    fontFamily: "SoraRegular",
    fontSize: 16, // Set the font size as desired
    lineHeight: 24, // Set the line height as desired
    color: "#333", // Set the text color as desired
    textAlignVertical: "top", // Start text from the top, not centered vertically
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
