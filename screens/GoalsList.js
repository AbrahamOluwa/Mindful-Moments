import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import {
  HStack,
  Stack,
  useToast,
  Box,
  Modal,
  Center,
  Button,
} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import GoalTabBar from "../components/goals/GoalTabBar";
import ThoughtCard from "../components/thoughts/ThoughtCard.js";
import GoalListItem from "../components/goals/GoalListItem.js";
import { getUserId } from "../components/home/GetUserId";
import { useRoute } from "@react-navigation/native";

export default function GoalsList({ navigation }) {
  const route = useRoute();
  const goalsCreated = route.params;
  const [activeTab, setActiveTab] = useState("all");
  const [goals, setGoals] = useState([]);
  const [allGoals, setAllGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState();

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

  const screenHeight = Dimensions.get("window").height;
  const containerHeightPercentage = 82;

  const containerStyle = {
    height: (screenHeight * containerHeightPercentage) / 100,
  };

  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  function formatFirestoreTimestamp(timestamp) {
    // Check if the input is a valid Firestore Timestamp

    // Convert the Firestore Timestamp to a JavaScript Date
    const jsDate = timestamp.toDate();

    // Format the JavaScript Date to "yyyy-MM-dd"
    const formattedDate = jsDate.toISOString().split("T")[0];

    return formattedDate;
  }

  const fetchAllGoals = async () => {
    try {
      const userId = await getUserId();
      const collectionRef = collection(
        db,
        "nonRegisteredUsers",
        userId,
        "goals"
      );

      const q = query(collectionRef, orderBy("dueDate", "asc"));

      const querySnapshot = await getDocs(q);

      const goals = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const dueDateMonthYear = data.dueDate ? formatDate(data.dueDate) : null;

        return {
          id: doc.id,
          ...data,
          dueDateMonthYear: dueDateMonthYear,
        };
      });

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

  const groupGoalsByMonthYear = (goals) => {
    return goals.reduce((groups, goal) => {
      const dateRange = goal.dueDateMonthYear; // Use the formatted dueDateMonthYear
      if (!groups[dateRange]) {
        groups[dateRange] = [];
      }
      groups[dateRange].push(goal);
      return groups;
    }, {});
  };

  // Group the filtered goals by month and year
  const groupedGoals = groupGoalsByMonthYear(filteredGoals);

  const showDeleteConfirmationModal = (goalId) => {
    setGoalToDelete(goalId);
    setShowModal(true);
  };

  const handleDeleteGoal = async () => {
    try {
      const userId = await getUserId();
      const goalRef = doc(db, "nonRegisteredUsers", userId, "goals", goalToDelete);

      await deleteDoc(goalRef);

      // Update the local state to remove the deleted goal
      const updatedGoals = allGoals.filter((goal) => goal.id !== goalToDelete);
      setAllGoals(updatedGoals);
      setFilteredGoals(updatedGoals);
      setShowModal(false);

      toast.show({
        render: () => {
          return (
            <Box bg="emerald.500" px="4" py="3" rounded="sm" mb={5}>
              <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                Goal deleted successfully!
              </Text>
            </Box>
          );
        },
      });
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  useEffect(() => {
    fetchAllGoals();
  }, []);

  useEffect(() => {
    filterGoalsByStatus(activeTab);
  }, [activeTab]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
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

        <View style={containerStyle}>
          <FlatList
            data={Object.keys(groupedGoals)}
            keyExtractor={(dateRange) => dateRange.toString()} // Use a unique key
            renderItem={({ item: dateRange }) => (
              <View style={{ marginTop: 25 }}>
                <Text style={styles.dateRange}>Deadline: {dateRange} </Text>
                {groupedGoals[dateRange].map((goal) => (
                  <GoalListItem
                    key={goal.id}
                    id={goal.id}
                    title={goal.title}
                    description={goal.description}
                    numberOfTasks={goal.numberOfTasks}
                    completedTasks={goal.completedTasks}
                    dueDate={goal.dueDate}
                    navigation={navigation}
                    category={goal.category}
                    priority={goal.priority}
                    tasks={goal.tasks}
                    repeatOption={goal.reminderSettings.repeatOption}
                    selectedDays={goal.reminderSettings.selectedDays}
                    selectedTime={goal.reminderSettings.selectedTime}
                    selectedDateMY={goal.reminderSettings.selectedDate}
                    onDelete={() => showDeleteConfirmationModal(goal.id)}
                  />
                ))}
              </View>
            )}
          />
        </View>
      </View>

      <Center>
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          _backdrop={{
            _dark: {
              bg: "coolGray.800",
            },
            bg: "black",
          }}
        >
          <Modal.Content maxWidth="350" maxH="212">
            <Modal.CloseButton />
            <Modal.Header><Text style={{ fontFamily: "SoraSemiBold" , fontSize: 14}}>Confirm Delete</Text></Modal.Header>
            <Modal.Body><Text style={{ fontFamily: "SoraRegular" , fontSize: 13}}>Are you sure you want to delete this goal?</Text></Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setShowModal(false);
                  }}
                >
                  <Text style={{ fontFamily: "SoraRegular" , color: 'black'}}>Cancel</Text>
                </Button>
                <Button
                  onPress={() => {
                   // setShowModal(false);
                    handleDeleteGoal();
                  }}
                  style={{backgroundColor: '#ff0e0e'}}
                >
                  <Text style={{ fontFamily: "SoraRegular" , color: '#fff'}}>Delete</Text>
                  
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingHorizontal: 8,
    marginTop: -30,
  },
  title: {
    fontSize: 24,
    fontFamily: "SoraSemiBold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },

  dateRange: {
    backgroundColor: "#EF798A",
    color: "#FFFFFF",
    padding: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
    marginLeft: 15,
    fontFamily: "SoraRegular",
    fontSize: 12,
  },

  // goalItem: {
  //   backgroundColor: "#EECFD4",
  //   padding: 16,
  //   marginBottom: 12,
  //   borderRadius: 8,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 4,
  // },
  // goalTitle: {
  //   fontSize: 17,
  //   fontFamily: "SoraSemiBold",
  //   marginBottom: 8,
  //   color: "#333",
  // },
  // goalDescription: {
  //   fontSize: 15,
  //   color: "#666",
  //   fontFamily: "SoraRegular",
  // },
});
