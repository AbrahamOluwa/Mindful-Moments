import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, {useState} from "react";
import { HStack, Stack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import GoalTabBar from "../components/goals/GoalTabBar";
import ThoughtCard from "../components/thoughts/ThoughtCard.js";

export default function GoalsList({navigation}) {

  const [activeTab, setActiveTab] = useState('all');

  const goals = [
    { id: 1, title: "Goal 1", description: "Description for Goal 1" },
    { id: 2, title: "Goal 2", description: "Description for Goal 2" },
    { id: 3, title: "Goal 3", description: "Description for Goal 3" },
  ];

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

        <GoalTabBar activeTab={activeTab} setActiveTab={setActiveTab}/>
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
