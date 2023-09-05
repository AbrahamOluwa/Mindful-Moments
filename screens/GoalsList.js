import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { HStack, Stack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import GoalTabBar from "../components/goals/GoalTabBar";
import ThoughtCard from "../components/thoughts/ThoughtCard.js";
import GoalListItem from "../components/goals/GoalListItem.js";
import { getUserId } from "../components/home/GetUserId";

export default function GoalsList({ navigation }) {
  const [activeTab, setActiveTab] = useState("all");
  const [goals, setGoals] = useState([]);
  const [allGoals, setAllGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);

  // const fetchGoalsByStatus = async (status) => {
  //   try {
  //     const userId = await getUserId();
  //     const collectionRef = collection(db, "nonRegisteredUsers", userId, "goals");
  
  //     let querySnapshot;
  
  //     if (status === "") {
  //       querySnapshot = await getDocs(collectionRef);
  //     } else {
  //       const q = query(collectionRef, where("status", "==", status));
  //       querySnapshot = await getDocs(q);
  //     }
  
  //     const goals = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setGoals(goals);
  //     console.log(goals);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   if (activeTab === "all") {
  //     fetchGoalsByStatus("");
  //   } else if (activeTab === "active") {
  //     fetchGoalsByStatus("active");
  //   } else if (activeTab === "completed") {
  //     fetchGoalsByStatus("completed");
  //   }
  // }, [activeTab]);

  const fetchAllGoals = async () => {
    try {
      const userId = await getUserId();
      const collectionRef = collection(db, "nonRegisteredUsers", userId, "goals");
      const querySnapshot = await getDocs(collectionRef);
      const goals = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllGoals(goals);
      // Initially set the filtered goals to all goals
      setFilteredGoals(goals);
    } catch (error) {
      console.error(error);
    }
  };
  
  // Function to filter goals based on activeTab
  const filterGoalsByStatus = (status) => {
    if (status === "all") {
      // Show all goals
      setFilteredGoals(allGoals);
    } else {
      // Filter goals by status
      const filtered = allGoals.filter((goal) => goal.status === status);
      setFilteredGoals(filtered);
    }
  };
  
  // Effect to fetch all goals when the component mounts
  useEffect(() => {
    fetchAllGoals();
  }, []);
  
  // Effect to filter goals when activeTab changes
  useEffect(() => {
    filterGoalsByStatus(activeTab);
  }, [activeTab]);

  return (
    <SafeAreaView>
      <View>
        <HStack space={70} p={4}>
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
            <Text style={styles.title}>All Goals</Text>
          </Stack>
        </HStack>

        <GoalTabBar activeTab={activeTab} setActiveTab={setActiveTab} />

        <ScrollView>
          {filteredGoals.map((goal) => (
            <View key={goal.id} style={{ marginTop: 25 }}>
              {/* <Text>{goal.title}</Text>
              <Text>{goal.description}</Text>
              <Text>{goal.status}</Text> */}
              <GoalListItem
                title={goal.title}
                description={goal.description}
                numberOfTasks={goal.numberOfTasks}
              />
            </View>
          ))}

          {/* <View style={{ marginTop: 25 }}>
            <View style={{ padding: 15 }}>
              <Text style={{ fontSize: 15, fontFamily: "SoraMedium" }}>
                Mar 2020 - May 2022
              </Text>
            </View>
            <GoalListItem />
            <GoalListItem />
            <GoalListItem />
          </View> */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    marginTop: -30,
    //paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "SoraSemiBold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  goalItem: {
    backgroundColor: "#EECFD4",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  goalTitle: {
    fontSize: 18,
    fontFamily: "SoraSemiBold",
    marginBottom: 8,
    color: "#333",
  },
  goalDescription: {
    fontSize: 16,
    color: "#666",
    fontFamily: "SoraRegular",
  },
});
