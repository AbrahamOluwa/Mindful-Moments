import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { getUserId } from "../components/home/GetUserId";
import { getDocs, collection, query, limit } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Goals({ navigation }) {
  const { width } = Dimensions.get("screen");

  const [hasGoals, setHasGoals] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [goalsAlreadyCreated, setGoalsAlreadyCreated] = useState();


  useEffect(() => {
    const checkGoals = async () => {
      try {
        const userId = await getUserId();
        const collectionRef = collection(
          db,
          "nonRegisteredUsers",
          userId,
          "goals"
        );

        const q = query(collectionRef, limit(1));

        const querySnapshot = await getDocs(q);
        const hasGoals = !querySnapshot.empty;

        if (hasGoals) {
          console.log("Document data exist");
          setIsFetching(false);
          setHasGoals(true);
        } else {
          console.log("No such document!");
          setIsFetching(false);
          setHasGoals(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkGoals();
  }, []);

  // useEffect(() => {
  //   // Check if the user has any gratitude moments in the database
  //   const checkGoals = async () => {
  //     try {
  //       const userId = await getUserId();
  //       const collectionRef = collection(
  //         db,
  //         "nonRegisteredUsers",
  //         userId,
  //         "goals"
  //       );

  //       const querySnapshot = await getDocs(collectionRef);

  //       if (!querySnapshot.empty) {
  //         console.log("Document data exist");
  //         setIsFetching(false);
  //         setHasGoals(true);
  //         const goals = querySnapshot.docs.map((doc) => {
  //           const data = doc.data();
  //           const dueDateMonthYear = data.dueDate
  //             ? formatDate(data.dueDate)
  //             : null;

  //           return {
  //             id: doc.id,
  //             ...data,
  //             dueDateMonthYear: dueDateMonthYear,
  //           };
  //         });

  //         setGoalsAlreadyCreated(goals);
  //       } else {
  //         console.log("No such document!");
  //         setIsFetching(false);
  //         setHasGoals(false);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   checkGoals();
  //   // console.log(hasGratitudeMoments);
  // }, []);

  return (
    <SafeAreaView style={{}}>
      <View style={{ marginTop: 10, marginLeft: 10 }}>
        <Text style={{ fontFamily: "SoraSemiBold", fontSize: 28 }}>Goals</Text>
      </View>

      <Image
        source={require("../assets/images/g3.png")}
        style={{
          width: width,
          height: 350,
        }}
        resizeMode="contain"
      />

      {isFetching ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <ActivityIndicator size="large" color="#EF798A" />
        </View>
      ) : (
        <View>
          <View
            style={{
              marginTop: 25,
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "SoraSemiBold",
            }}
          >
            {hasGoals ? (
              <View>
                <View>
                  <Text style={styles.description}>
                    Impressive! You're on your way to achieving your goals. Feel
                    free to review your progress and manage all your existing
                    goals right here. Ready to set new milestones? Click the
                    button to add more goals.
                  </Text>
                </View>

                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() =>
                      navigation.navigate("GoalsListScreen", {
                        goalsAlreadyCreated,
                      })
                    }
                  >
                    <Text style={styles.viewButtonText}>View All Goals</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <Text style={styles.description}>
                  You're ready to start your journey towards success! Begin by
                  setting your very first goal. Don't worry; we're here to help
                  you achieve your dreams.
                </Text>
              </>
            )}
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 50,
            }}
          >
            <Button
              leftIcon={<Icon as={FontAwesome} name="plus" size="sm" />}
              style={{ backgroundColor: "#EF798A", borderRadius: 22 }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SetGoalsScreen");
                  //navigation.navigate("GoalsListScreen");
                }}
              >
                <Text
                  style={{
                    fontFamily: "SoraMedium",
                    color: "#fff",
                    fontSize: 13,
                  }}
                >
                  Add New Goal
                </Text>
              </TouchableOpacity>
            </Button>
          </View>
        </View>
      )}

      {/* <TouchableOpacity>
          
          <View style={{alignItems: "center", justifyContent: "center",borderRadius: 8, backgroundColor: '#407BFF'}}>
              <Text 
                  style={{
                      alignSelf: "center", 
                      color: "#fff", 
                      fontSize: 15, 
                      padding:12,
                      fontFamily: "SoraRegular",
                  }}
              >
                    Create an account
              </Text>
          </View>
    
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  description: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
    paddingHorizontal: 20,
    fontFamily: "SoraRegular",
  },
  // description: {
  //   fontFamily: "SoraSemiBold",
  //   color: "gray",
  //   fontSize: 15,
  // },

  viewButtonText: {
    fontFamily: "SoraMedium",
    color: "white",
    fontSize: 13,
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
