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

  // const goals = [
  //   { id: 1, title: "Goal 1", description: "Description for Goal 1" },
  //   { id: 2, title: "Goal 2", description: "Description for Goal 2" },
  //   { id: 3, title: "Goal 3", description: "Description for Goal 3" },
  // ];

  //const userId = getUserId();

  const fetchGoalsByStatus = async (status) => {
    try {
      const userId = await getUserId();
 
      const querySnapshot = await getDocs(
        collection(db, "nonRegisteredUsers", userId, "goals"),
        where("status", "==", status)
      );

      console.log(status);

      const goals = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(goals);
      // setLoading(false);
    } catch (error) {
      console.error(error);
      // setLoading(false); 
    }
  };

  useEffect(() => {
    if (activeTab === "all") {
      fetchGoalsByStatus(""); 
    } else if (activeTab === "active") {
      fetchGoalsByStatus("active");
    } else if (activeTab === "completed") {
      fetchGoalsByStatus("completed");
    }
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
        {/* <ScrollView>
          <View style={styles.container}>
            {goals.map((goal) => (

              <ThoughtCard key={goal.id} />
            ))}
          </View>
        </ScrollView> */}

        <GoalTabBar activeTab={activeTab} setActiveTab={setActiveTab} />

        <ScrollView>
          {goals.map((goal) => (
            <View key={goal.id} style={{ marginTop: 25 }}>
              {/* <Text>{goal.title}</Text>
              <Text>{goal.description}</Text>
              <Text>{goal.status}</Text> */}
              <GoalListItem title={goal.title} description={goal.description} numberOfTasks={goal.numberOfTasks} />
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
