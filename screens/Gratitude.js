import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground,
  ActivityIndicator
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack, Stack, Button, Icon } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Gratitude({ navigation }) {
  const { width } = Dimensions.get("screen");
  const [hasGratitudeMoments, setHasGratitudeMoments] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const getUserId = async () => {
    const storedUserId = await AsyncStorage.getItem("nonRegisteredUserId");
    if (storedUserId) {
      console.log(
        "Retrieved non-registered userId from AsyncStorage:",
        storedUserId
      );
      return storedUserId;
    } else {
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            resolve(user.uid);
          } else {
            reject(new Error("User is not signed in."));
          }
          unsubscribe();
        });
      });
    }
  };

  useEffect(() => {
    // Check if the user has any gratitude moments in the database
    const checkGratitudeMoments = async () => {
      try {
        const userId = await getUserId(); // Replace this with your function to get the user ID
        const gratitudeMomentsRef = collection(
          db,
          "nonRegisteredUsers",
          userId,
          '"gratitude_moments"'
        );
        const querySnapshot = await getDocs(gratitudeMomentsRef);

        if (querySnapshot.empty) {
          console.log("Document data exist");
          setIsFetching(false);
          setHasGratitudeMoments(true);
        } else {
          console.log("No such document!");
          setIsFetching(false);
          setHasGratitudeMoments(false);
        }

        // setHasGratitudeMoments(!querySnapshot.empty); // Check if the query returned any documents
      } catch (error) {
        console.error("Error fetching gratitude moments:", error);
      }
    };

    checkGratitudeMoments();
    // console.log(hasGratitudeMoments);
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <ImageBackground
          source={require("../assets/images/gratitude_1.png")}
          style={{
            width: width,
            height: 500,
          }}
          resizeMode="contain"
        >
          <HStack space={15} p={2}>
            <Stack>
              <TouchableOpacity
                onPress={() => navigation.navigate("HomeScreen")}
              >
                <AntDesign name="arrowleft" size={30} color="black" />
              </TouchableOpacity>
            </Stack>
          </HStack>
        </ImageBackground>

        <View
          style={{
            marginTop: -30,
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "SoraSemiBold",
          }}
        >
          <Text style={styles.header}>Gratitude Moments</Text>
          {isFetching ? (
            // Show the loader component while loading is true
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20
              }}
            >
              <ActivityIndicator size="large" color="#EF798A" />
            </View>
          ) : (
            <View>
              {hasGratitudeMoments ? (
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() =>
                    navigation.navigate("AllGratitudeMomentsScreen")
                  }
                >
                  <Text style={styles.viewButtonText}>View All Moments</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <Text style={styles.description}>
                    Oops... No entries yet!
                  </Text>
                  <Text style={styles.description}>Tap to Start Writing</Text>
                </>
              )}

              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 30,
                }}
              >
                <Button
                  leftIcon={<Icon as={FontAwesome} name="plus" size="md" />}
                  style={{
                    backgroundColor: "#EF798A",
                    borderRadius: 8,
                    width: 180,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("RecordGratitudeMomentScreen")
                    }
                    //onPress={() => navigation.navigate("AllGratitudeMomentsScreen")}
                  >
                    <Text
                      style={{
                        fontFamily: "SoraMedium",
                        color: "#fff",
                        fontSize: 15,
                      }}
                    >
                      Add new
                    </Text>
                  </TouchableOpacity>
                </Button>
              </View>
            </View>
          )}
        </View>

        {/* <View
          style={{
            marginTop: -30,
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "SoraSemiBold",
          }}
        >
          <Text style={styles.header}>Gratitude Moments</Text>
          <Text style={styles.description}>Oops... No entries yet!</Text>
          <Text style={styles.description}>Tap to Start Writing</Text>
        </View> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontFamily: "SoraSemiBold",
    fontSize: 28,
    marginBottom: 15,
  },

  description: {
    fontFamily: "SoraSemiBold",
    color: "gray",
    fontSize: 15,
  },

  viewButtonText: {
    fontFamily: "SoraMedium",
    color: "white",
    fontSize: 15,
  },

  viewButton: {
    backgroundColor: "#613F75",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 10,
    borderRadius: 8,
  },
});
