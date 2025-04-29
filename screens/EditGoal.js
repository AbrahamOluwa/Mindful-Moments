import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { doc, updateDoc, collection, addDoc, getDocs, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useRoute, useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import {
  CheckIcon,
  Select,
  useToast,
  Box,
  Button,
  Modal,
  Center,
  VStack,
} from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "react-native-calendars";
import Checkbox from "expo-checkbox";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function EditGoal() {
  const route = useRoute();
  const navigation = useNavigation();
  const { goal, userId } = route.params;

  const [goalTitle, setGoalTitle] = useState(goal.title);
  const [goalDescription, setGoalDescription] = useState(goal.description);
  const [goalCategory, setGoalCategory] = useState(goal.category);
  const [goalPriority, setGoalPriority] = useState(goal.priority);
  const [newTask, setNewTask] = useState("");
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [newDueDate, setNewDueDate] = useState(new Date(goal.dueDate.toDate()));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const [goalSelectedTime, setGoalSelectedTime] = useState(
    new Date(
      goal.reminderSettings.selectedTime
        ? goal.reminderSettings.selectedTime.toDate()
        : new Date()
    )
  );
  const [goalRepeatOption, setGoalRepeatOption] = useState(
    goal.reminderSettings.repeatOption
  );
  const [goalSelectedDays, setGoalSelectedDays] = useState(
    goal.reminderSettings.selectedDays
  );
  const [selectedDate, setSelectedDate] = useState(
    goal.reminderSettings.selectedDate
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [goalTasks, setGoalTasks] = useState(goal.tasks);
  const [goalMilestones, setGoalMilestones] = useState(goal.milestones);
  const [showModal, setShowModal] = useState(false);

  const showDueDatePickerModal = () => {
    setShowDueDatePicker(true);
  };

  const handleDueDatePickerChange = (event, date) => {
    setShowDueDatePicker(false);
    if (date !== undefined) {
      setNewDueDate(date);
    }
  };

  const toggleRepeatOption = (option) => {
    setGoalRepeatOption(option);
  };

  const toggleDay = (day) => {
    if (goalSelectedDays.includes(day)) {
      setGoalSelectedDays(
        goalSelectedDays.filter((selectedDay) => selectedDay !== day)
      );
    } else {
      setGoalSelectedDays([...goalSelectedDays, day]);
    }
  };

  const handleTimeChange = (event, selected) => {
    if (event.type === "set") {
      setGoalSelectedTime(selected || goalSelectedTime);
    }
    setShowTimePicker(Platform.OS === "ios");
  };

  const formattedTime = goalSelectedTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const onDatePress = (date) => {
    setSelectedDate(date);
  };

  const addTask = () => {
    if (newTask) {
      const newTaskObject = { text: newTask, completed: false };
      setGoalTasks([...goalTasks, newTaskObject]);
      setNewTask("");
    }
  };

  const removeTask = (index) => {
    const updatedGoalTasks = [...goalTasks];
    updatedGoalTasks.splice(index, 1);
    setGoalTasks(updatedGoalTasks);
  };

  const updateGoal = async () => {
    setIsSubmitting(true);

    try {
      if (!goalTitle || !goalDescription || !newDueDate || !goalCategory || !goalPriority) {
        setIsSubmitting(false);
        toast.show({
          render: () => {
            return (
              <Box bg="#ff0e0e" px="4" py="3" rounded="sm" mb={5}>
                <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                  Please fill all the required fields.
                </Text>
              </Box>
            );
          },
        });
        return;
      }

      const goalData = {
        title: goalTitle,
        description: goalDescription,
        dueDate: newDueDate,
        category: goalCategory,
        priority: goalPriority,
        isGoalCompleted: goalTasks.length === goalTasks.filter((task) => task.completed === true).length,
        status: goalTasks.length === goalTasks.filter((task) => task.completed === true).length ? "completed" : "active",
        reminderSettings: {
          repeatOption: goalRepeatOption,
          selectedDays: goalSelectedDays,
          selectedDate: goalRepeatOption === "Monthly" || goalRepeatOption === "Yearly" ? selectedDate : "",
          selectedTime: goalRepeatOption === "Daily" ? goalSelectedTime : "", // Time selected by the user (for Daily)
        },
      };

      const goalRef = doc(db, "users", userId, "goals", goal.id);
      await updateDoc(goalRef, goalData);

      // Fetch existing tasks from Firestore
      const existingTasksSnapshot = await getDocs(collection(db, "users", userId, "goals", goal.id, "tasks"));
      const existingTasks = existingTasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Update existing tasks and add new tasks
      for (const task of goalTasks) {
        if (task.id) {
          // Update existing task
          const taskRef = doc(db, "users", userId, "goals", goal.id, "tasks", task.id);
          await updateDoc(taskRef, { text: task.text, completed: task.completed });
        } else {
          // Add new task
          await addDoc(collection(db, "users", userId, "goals", goal.id, "tasks"), {
            text: task.text,
            completed: task.completed,
            createdAt: serverTimestamp(),
          });
        }
      }

      // Remove tasks that are no longer in the updated goalTasks
      for (const existingTask of existingTasks) {
        if (!goalTasks.find((task) => task.id === existingTask.id)) {
          const taskRef = doc(db, "users", userId, "goals", goal.id, "tasks", existingTask.id);
          await deleteDoc(taskRef);
        }
      }

      setIsSubmitting(false);

      const tasksThatHasBeenMarkedAsComplete = goalTasks.filter((task) => task.completed === true).length;

      if (goalTasks.length === tasksThatHasBeenMarkedAsComplete) {
        setShowModal(true);
      } else {
        toast.show({
          render: () => {
            return (
              <Box bg="emerald.500" px="4" py="3" rounded="sm" mb={5}>
                <Text style={{ fontFamily: "PoppinsMedium", color: "#fff" }}>
                  Goal updated successfully!
                </Text>
              </Box>
            );
          },
        });

        setTimeout(() => {
          navigation.navigate("GoalDetailsScreen", { goalId: goal.id, userId });
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating goal:", error);
      Alert.alert(
        "Error",
        "There was an error updating the goal. Please try again."
      );
      setIsSubmitting(false);
    }
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View></View>
      <Text style={styles.heading}>Edit Goal</Text>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>
            Title <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Goal Title"
            value={goalTitle}
            onChangeText={setGoalTitle}
          />

          <Text style={styles.label}>
            Description <Text style={{ color: "red" }}>*</Text>
          </Text>

          <TextInput
            style={styles.input2}
            placeholder="Enter Goal Description"
            multiline
            value={goalDescription}
            onChangeText={setGoalDescription}
          />

          <Text style={styles.label}>
            Due Date <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.datePickerContainer}
            onPress={showDueDatePickerModal}
          >
            <AntDesign name="calendar" size={20} color="#888" />
            <Text style={styles.datePickerText}>
              {newDueDate.toDateString()}
            </Text>
          </TouchableOpacity>
          {showDueDatePicker && (
            <DateTimePicker
              value={newDueDate}
              mode="date"
              display="default"
              onChange={handleDueDatePickerChange}
            />
          )}

          <View>
            <Text style={styles.label}>
              Category <Text style={{ color: "red" }}>*</Text>
            </Text>

            <View
              style={{
                backgroundColor: "#fff",
                borderColor: "#D7CCC8",
                borderWidth: 1,
                borderRadius: 8,
                marginBottom: 20,
              }}
            >
              <Select
                selectedValue={goalCategory}
                minWidth="200"
                accessibilityLabel="Choose Category"
                placeholder="Choose Category"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                variant="unstyled"
                mt={1}
                shadow={2}
                style={{ fontSize: 14, fontFamily: "PoppinsMedium" }}
                onValueChange={setGoalCategory}
              >
                <Select.Item label="General" value="General" />
                <Select.Item
                  label="Health and Fitness"
                  value="Health and Fitness"
                />
                <Select.Item
                  label="Personal Development"
                  value="Personal Development"
                />
                <Select.Item label="Career and Work" value="Career and Work" />
                <Select.Item
                  label="Finance and Money"
                  value="Finance and Money"
                />
                <Select.Item label="Education" value="Education" />
                <Select.Item
                  label="Travel and Adventure"
                  value="Travel and Adventure"
                />
                <Select.Item label="Relationships" value="Relationships" />
                <Select.Item
                  label="Home and Lifestyle"
                  value="Home and Lifestyle"
                />
                <Select.Item
                  label="Community and Social Impact"
                  value="Community and Social Impact"
                />
                <Select.Item label="Spirituality" value="Spirituality" />
              </Select>
            </View>
          </View>

          <View>
            <Text style={styles.label}>
              Priority <Text style={{ color: "red" }}>*</Text>
            </Text>

            <View
              style={{
                backgroundColor: "#fff",
                borderColor: "#D7CCC8",
                borderWidth: 1,
                borderRadius: 8,
                marginBottom: 20,
              }}
            >
              <Select
                selectedValue={goalPriority}
                minWidth="200"
                accessibilityLabel="Choose Priority"
                placeholder="Choose Priority"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                variant="unstyled"
                mt={1}
                shadow={2}
                style={{ fontSize: 13, fontFamily: "PoppinsMedium" }}
                onValueChange={setGoalPriority}
              >
                <Select.Item label="Critical" value="Critical" />
                <Select.Item label="High" value="High" />
                <Select.Item label="Medium" value="Medium" />
                <Select.Item label="Low" value="Low" />
              </Select>
            </View>
          </View>

          <View>
            <Text style={styles.label}>
              Set Reminder <Text style={{ color: "red" }}>*</Text>
            </Text>
            <View style={[styles.row]}>
              {["Daily", "Weekly", "Monthly", "Yearly"].map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => toggleRepeatOption(option)}
                  style={[
                    styles.option,
                    {
                      backgroundColor:
                        goalRepeatOption === option ? "#4DB6AC" : "#F2F2F2",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: goalRepeatOption === option ? "white" : "black",
                      fontFamily: "PoppinsMedium",
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {goalRepeatOption === "Daily" && (
              <View style={{ marginTop: 15 }}>
                <Text style={styles.miniLabel}>Select Time</Text>

                <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                  <View
                    style={{
                      paddingVertical: 15,
                      backgroundColor: "#fff",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "PoppinsSemiBold",
                        color: "#613F75",
                        fontSize: 20,
                      }}
                    >
                      {formattedTime}
                    </Text>
                  </View>
                </TouchableOpacity>

                {showTimePicker && (
                  <DateTimePicker
                    value={goalSelectedTime}
                    mode="time"
                    display="clock"
                    onChange={handleTimeChange}
                  />
                )}
              </View>
            )}
            {goalRepeatOption === "Weekly" && (
              <View style={{ marginTop: 15 }}>
                <Text style={[styles.miniLabel, { marginLeft: 10 }]}>
                  Repeat On
                </Text>
                <View style={styles.row}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <TouchableOpacity
                        key={day}
                        onPress={() => toggleDay(day)}
                        style={[
                          styles.option,
                          {
                            backgroundColor: goalSelectedDays.includes(day)
                              ? "#4DB6AC"
                              : "#F2F2F2",
                          },
                        ]}
                      >
                        <Text
                          style={{
                            color: goalSelectedDays.includes(day)
                              ? "white"
                              : "black",
                            fontFamily: "PoppinsRegular",
                          }}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
            )}
            {(goalRepeatOption === "Monthly" ||
              goalRepeatOption === "Yearly") && (
              <View style={{ marginTop: 15 }}>
                <Text style={styles.miniLabel}>Select Date</Text>
                <Calendar
                  current={selectedDate}
                  onDayPress={(day) => onDatePress(day.dateString)}
                  markedDates={
                    selectedDate ? { [selectedDate]: { selected: true } } : {}
                  }
                />
              </View>
            )}
          </View>

          <View style={{ marginTop: 25 }}>
            <Text style={styles.miniLabel}>Tasks Created</Text>
            {goalTasks.map((task, index) => (
              <View key={index} style={styles.taskRow}>
                <Checkbox
                  style={{ marginRight: 7, marginTop: 4 }}
                  value={task.completed}
                  onValueChange={() => {
                    const updatedTasks = [...goalTasks]; // Create a copy of the tasks array
                    updatedTasks[index].completed = !task.completed; // Toggle the completed property
                    setGoalTasks(updatedTasks); // Update the state with the new tasks array
                  }}
                  color={task.completed ? "#A5D6A7" : undefined}
                />

                <Text style={styles.taskText}>{task.text}</Text>

                <TouchableOpacity onPress={() => removeTask(index)}>
                  <AntDesign name="delete" size={20} color="#263238" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.addTaskContainer}>
            <TextInput
              style={styles.addTaskInput}
              placeholder="Add Task"
              value={newTask}
              onChangeText={setNewTask}
            />
            <TouchableOpacity style={styles.addTaskButton} onPress={addTask}>
              <Text style={styles.addTaskButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>

          {!isSubmitting && (
            <TouchableOpacity style={styles.saveButton} onPress={updateGoal}>
              <Text style={styles.saveButtonText}>Update Goal</Text>
            </TouchableOpacity>
          )}

          {isSubmitting && (
            <Button
              isLoading
              _loading={{
                bg: "#F48FB1",
                _text: {
                  color: "coolGray.700",
                  fontFamily: "PoppinsMedium",
                  fontSize: 14,
                },
              }}
              _spinner={{
                color: "white",
              }}
              isLoadingText="Updating Goal"
            >
              Button
            </Button>
          )}
        </ScrollView>
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
          <Modal.Content maxWidth="350" maxH="250">
            <Modal.CloseButton />
            <VStack alignItems="center" style={{ marginTop: 10 }}>
              <MaterialCommunityIcons
                name="party-popper"
                size={45}
                color="#FF007F"
              />
            </VStack>
            <Modal.Body>
              <Text style={{ fontFamily: "PoppinsRegular", fontSize: 12 }}>
                Congratulations! 🎉 You have achieved your goal. Keep up the
                great work and set new goals to conquer!
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onPress={() => {
                  setShowModal(false);
                  setTimeout(() => {
                    navigation.goBack();
                  }, 2000);
                }}
              >
                <Text style={{ fontFamily: "PoppinsRegular", color: "#fff" }}>
                  Close
                </Text>
              </Button>
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
    padding: 20,
    backgroundColor: "#FAFAFA",
  },
  heading: {
    fontSize: 24,
    fontFamily: "PoppinsSemiBold",
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 10,
  },
  label: {
    fontFamily: "PoppinsMedium",
    fontSize: 16,
    marginBottom: 10,
  },
  miniLabel: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 14,
    marginBottom: 10,
    color: "#222222",
  },
  input: {
    height: 45,
    padding: 10,
    borderWidth: 1,
    borderColor: "#D7CCC8",
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#FFF",
    fontFamily: "PoppinsMedium",
  },
  input2: {
    height: 120,
    padding: 10,
    borderWidth: 1,
    borderColor: "#D7CCC8",
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#FFF",
    fontFamily: "PoppinsMedium",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#D7CCC8",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#FFF",
    fontFamily: "PoppinsMedium",
  },
  pickerItemStyle: {
    fontFamily: "PoppinsMedium",
  },
  datePicker: {
    marginBottom: 16,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D7CCC8",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  datePickerText: {
    marginLeft: 10,
    fontFamily: "PoppinsMedium",
  },
  tasksContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    borderColor: "#D7CCC8",
    borderWidth: 1, 
  },
  taskText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "PoppinsMedium",
    color: '#263238',
    fontWeight: "bold",
  },
  addTaskContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  addTaskInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: "#D7CCC8",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    fontFamily: "PoppinsMedium",
  },
  addTaskButton: {
    backgroundColor: "#F48FB1",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  addTaskButtonText: {
    color: "white",
    fontSize: 15,
    fontFamily: "PoppinsSemiBold",
  },
  saveButton: {
    backgroundColor: "#F48FB1",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  option: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    fontFamily: "PoppinsRegular",
  },
});
