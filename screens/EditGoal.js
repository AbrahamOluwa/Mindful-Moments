import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Picker } from "@react-native-picker/picker";
import DatePicker from "@react-native-community/datetimepicker";
import {
  Button,
  useToast,
  Select,
  CheckIcon,
  Center,
  VStack,
  HStack,
  CloseIcon,
  Box,
  IconButton,
  Alert,
} from "native-base";
import { useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getUserId } from "../components/home/GetUserId";
import { Calendar } from "react-native-calendars";
import Checkbox from "expo-checkbox";

export default function EditGoal() {
  const route = useRoute();
  const {
    id,
    title,
    description,
    dueDate,
    category,
    priority,
    repeatOption,
    selectedDays,
    selectedTime,
    selectedDateMY,
    tasks,
  } = route.params;

  const [goalId, setGoalId] = useState(id);
  const [goalTitle, setGoalTitle] = useState(title);
  const [goalDescription, setGoalDescription] = useState(description);
  const [goalCategory, setGoalCategory] = useState(category);
  const [goalPriority, setGoalPriority] = useState(priority);
  const [newTask, setNewTask] = useState("");
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [newDueDate, setNewDueDate] = useState(
    new Date(formatFirestoreTimestamp(dueDate))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const [goalSelectedTime, setGoalSelectedTime] = useState(
    selectedTime ? selectedTime.toDate() : new Date()
  );

  const [goalRepeatOption, setGoalRepeatOption] = useState(repeatOption); // Default to Daily
  const [goalSelectedDays, setGoalSelectedDays] = useState(selectedDays); // Selected days for Weekly
  const [selectedDate, setSelectedDate] = useState(selectedDateMY); // Selected date for Monthly and Yearly
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [goalTasks, setGoalTasks] = useState(tasks);
  const [goalSaved, setGoalSaved] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  function formatFirestoreTimestamp(timestamp) {
    const jsDate = timestamp.toDate();
    const formattedDate = jsDate.toISOString().split("T")[0];
    return formattedDate;
  }

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
    // Toggle the selected state of a day for Weekly reminders
    if (goalSelectedDays.includes(day)) {
      setGoalSelectedDays(
        goalSelectedDays.filter((selectedDay) => selectedDay !== day)
      );
    } else {
      setGoalSelectedDays([...selectedDays, day]);
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
      if (
        !goalTitle ||
        !goalDescription ||
        !newDueDate ||
        !goalCategory ||
        !goalPriority
      ) {
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
        console.log("Please fill all the required fields.");
        return;
      }

      const userId = await getUserId();

      const goalData = {
        title: goalTitle,
        description: goalDescription,
        dueDate: newDueDate,
        category: goalCategory,
        priority: goalPriority,
        // reminderDate: reminderDate,
        tasks: goalTasks,
        numberOfTasks: goalTasks.length,
        completedTasks: goalTasks.filter((task) => task.completed === true)
          .length,
        isCompleted:
          goalTasks.length ===
          goalTasks.filter((task) => task.completed === true).length
            ? true
            : false,
        status:
          goalTasks.length ===
          goalTasks.filter((task) => task.completed === true).length
            ? "completed"
            : "active",
        reminderSettings: {
          repeatOption: goalRepeatOption,
          selectedDays: goalSelectedDays,
          selectedDate:
            goalRepeatOption === "Monthly" || goalRepeatOption === "Yearly"
              ? selectedDate
              : "",
          selectedTime: goalRepeatOption === "Daily" ? goalSelectedTime : "", // Time selected by the user (for Daily)
        },
      };

      console.log(goalData);

      const collectionRef = doc(
        db,
        "nonRegisteredUsers",
        userId,
        "goals",
        goalId
      );

      await updateDoc(collectionRef, goalData);

      console.log("Goal updated successfully! Document ID:", collectionRef.id);

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error saving goal:", error);
    }

    const tasksThatHasBeenMarkedAsComplete = goalTasks.filter(
      (task) => task.completed === true
    ).length;

    if (goalTasks.length === tasksThatHasBeenMarkedAsComplete) {
      console.log("This goal has been achieved");
      setGoalSaved(true);

      // render: () => {
      //   return (
      //     <Center>
      //       <VStack space={5} maxW="400">
      //         <Alert w="100%" status="success">
      //           <VStack space={2} flexShrink={1} w="100%">
      //             <HStack
      //               flexShrink={1}
      //               space={1}
      //               alignItems="center"
      //               justifyContent="space-between"
      //             >
      //               <HStack space={2} flexShrink={1} alignItems="center">
      //                 <Alert.Icon />
      //                 <Text
      //                   fontSize="md"
      //                   fontWeight="medium"
      //                   _dark={{
      //                     color: "coolGray.800",
      //                   }}
      //                 >
      //                   Application received!
      //                 </Text>
      //               </HStack>
      //               <IconButton
      //                 variant="unstyled"
      //                 _focus={{
      //                   borderWidth: 0,
      //                 }}
      //                 icon={<CloseIcon size="3" />}
      //                 _icon={{
      //                   color: "coolGray.600",
      //                 }}
      //               />
      //             </HStack>
      //             <Box
      //               pl="6"
      //               _dark={{
      //                 _text: {
      //                   color: "coolGray.600",
      //                 },
      //               }}
      //             >
      //               Your application has been received. We will review your
      //               application and respond within the next 48 hours.
      //             </Box>
      //           </VStack>
      //         </Alert>
      //         <Alert w="100%" status="success">
      //           <VStack space={1} flexShrink={1} w="100%" alignItems="center">
      //             <Alert.Icon size="md" />
      //             <Text
      //               fontSize="md"
      //               fontWeight="medium"
      //               _dark={{
      //                 color: "coolGray.800",
      //               }}
      //             >
      //               Goal Completed
      //             </Text>

      //             <Box
      //               _text={{
      //                 textAlign: "center",
      //               }}
      //               _dark={{
      //                 _text: {
      //                   color: "coolGray.600",
      //                 },
      //               }}
      //             >
      //               Congratulations! 🎉 You have achieved your goal. Keep up the
      //               great work and set new goals to conquer!
      //             </Box>
      //           </VStack>
      //         </Alert>
      //       </VStack>
      //     </Center>
      //   );
      // };

      // <Center>
      //   <VStack space={5} maxW="400">
      //     <Alert w="100%" status="success">
      //     <VStack space={2} flexShrink={1} w="100%">
      //       <HStack
      //         flexShrink={1}
      //         space={1}
      //         alignItems="center"
      //         justifyContent="space-between"
      //       >
      //         <HStack space={2} flexShrink={1} alignItems="center">
      //           <Alert.Icon />
      //           <Text
      //             fontSize="md"
      //             fontWeight="medium"
      //             _dark={{
      //               color: "coolGray.800",
      //             }}
      //           >
      //             Application received!
      //           </Text>
      //         </HStack>
      //         <IconButton
      //           variant="unstyled"
      //           _focus={{
      //             borderWidth: 0,
      //           }}
      //           icon={<CloseIcon size="3" />}
      //           _icon={{
      //             color: "coolGray.600",
      //           }}
      //         />
      //       </HStack>
      //       <Box
      //         pl="6"
      //         _dark={{
      //           _text: {
      //             color: "coolGray.600",
      //           },
      //         }}
      //       >
      //         Your application has been received. We will review your
      //         application and respond within the next 48 hours.
      //       </Box>
      //     </VStack>
      //   </Alert>
      //     <Alert w="100%" status="success">
      //       <VStack space={1} flexShrink={1} w="100%" alignItems="center">
      //         <Alert.Icon size="md" />
      //         <Text
      //           fontSize="md"
      //           fontWeight="medium"
      //           _dark={{
      //             color: "coolGray.800",
      //           }}
      //         >
      //           Goal Completed
      //         </Text>

      //         <Box
      //           _text={{
      //             textAlign: "center",
      //           }}
      //           _dark={{
      //             _text: {
      //               color: "coolGray.600",
      //             },
      //           }}
      //         >
      //           Congratulations! 🎉 You have achieved your goal. Keep up the
      //           great work and set new goals to conquer!
      //         </Box>
      //       </VStack>
      //     </Alert>
      //   </VStack>
      // </Center>
    } else {
      toast.show({
        render: () => {
          return (
            <Box bg="emerald.500" px="4" py="3" rounded="sm" mb={5}>
              <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                Goal uploaded successfully!
              </Text>
            </Box>
          );
        },
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
            onChangeText={(text) => setGoalTitle(text)}
          />

          <Text style={styles.label}>
            Description <Text style={{ color: "red" }}>*</Text>
          </Text>

          <TextInput
            style={styles.input2}
            placeholder="Enter Goal Description"
            multiline
            value={goalDescription}
            onChangeText={(text) => setGoalDescription(text)}
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
            <DatePicker
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
                borderColor: "#fff",
                borderWidth: 2,
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
                style={{ fontSize: 14, fontFamily: "SoraMedium" }}
                onValueChange={(itemValue) => setGoalCategory(itemValue)}
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
                borderColor: "#fff",
                borderWidth: 2,
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
                style={{ fontSize: 14, fontFamily: "SoraMedium" }}
                onValueChange={(itemValue) => setGoalPriority(itemValue)}
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
                        goalRepeatOption === option ? "#EF798A" : "#F2F2F2",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: goalRepeatOption === option ? "white" : "black",
                      fontFamily: "SoraLight",
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
                        fontFamily: "SoraSemiBold",
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
                    //is24Hour={true}
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
                              ? "#EF798A"
                              : "#F2F2F2",
                          },
                        ]}
                      >
                        <Text
                          style={{
                            color: goalSelectedDays.includes(day)
                              ? "white"
                              : "black",
                            fontFamily: "SoraLight",
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
                  color={task.completed ? "#198754" : undefined}
                />

                <Text style={styles.taskText}>{task.text}</Text>

                <TouchableOpacity onPress={() => removeTask(index)}>
                  <AntDesign name="delete" size={20} color="#DC3545" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.addTaskContainer}>
            <TextInput
              style={styles.addTaskInput}
              placeholder="Add Task"
              value={newTask}
              onChangeText={(text) => setNewTask(text)}
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
              isLoadingText="Updating Goal"
            >
              Button
            </Button>
          )}
        </ScrollView>
      </View>
      {goalSaved && (
        <Center>
          {/* <VStack space={5} maxW="400">
            <Alert w="100%" status="success">
              <VStack space={1} flexShrink={1} w="100%" alignItems="center">
                <Alert.Icon size="md" />
                <Text
                  fontSize="md"
                  fontWeight="medium"
                  _dark={{
                    color: "coolGray.800",
                  }}
                >
                  Goal Completed
                </Text>

                <Box
                  _text={{
                    textAlign: "center",
                  }}
                  _dark={{
                    _text: {
                      color: "coolGray.600",
                    },
                  }}
                >
                  <Text>
                    Congratulations! 🎉 You have achieved your goal. Keep up the
                    great work and set new goals to conquer!
                  </Text>
                </Box>
              </VStack>
            </Alert>
          </VStack> */}

          <VStack space={5} maxW="400">
            <Alert w="100%" status="success">
              <VStack space={2} flexShrink={1} w="100%">
                <HStack
                  flexShrink={1}
                  space={1}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <HStack space={2} flexShrink={1} alignItems="center">
                    <Alert.Icon />
                    <Text
                      fontSize="md"
                      fontWeight="medium"
                      _dark={{
                        color: "coolGray.800",
                      }}
                    >
                      Goal Completed
                    </Text>
                  </HStack>
                  <IconButton
                    variant="unstyled"
                    _focus={{
                      borderWidth: 0,
                    }}
                    icon={<CloseIcon size="5" />}
                    _icon={{
                      color: "coolGray.600",
                    }} onPress={() => setShowAlert(!showAlert)}
                  /> 
                </HStack>
                <Box
                  pl="6"
                  _dark={{
                    _text: {
                      color: "coolGray.600",
                    },
                  }}
                >
                   <Text>
                    Congratulations! 🎉 You have achieved your goal. Keep up the
                    great work and set new goals to conquer!
                  </Text>
                </Box>
              </VStack>
            </Alert>
          </VStack>
        </Center>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontFamily: "SoraSemiBold",
    marginBottom: 20,
  },
  label: {
    fontFamily: "SoraMedium",
    fontSize: 16,
    marginBottom: 10,
  },
  miniLabel: {
    fontFamily: "SoraSemiBold",
    fontSize: 14,
    marginBottom: 10,
    color: "#222222",
  },
  input: {
    height: 45,
    padding: 10,

    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#FFF",
    fontFamily: "SoraMedium",
  },
  input2: {
    height: 120,
    padding: 10,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#FFF",
    fontFamily: "SoraMedium",
  },
  dropdown: {
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#FFF",
    fontFamily: "SoraMedium",
  },
  pickerItemStyle: {
    fontFamily: "SoraMedium",
  },
  datePicker: {
    marginBottom: 16,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  datePickerText: {
    marginLeft: 10,
    fontFamily: "SoraMedium",
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
    backgroundColor: "#EFB9CB",
    padding: 10,
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "SoraRegular",
    // color: '#fff'
  },
  addTaskContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  addTaskInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    fontFamily: "SoraMedium",
  },
  addTaskButton: {
    backgroundColor: "#988B8E",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  addTaskButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "SoraSemiBold",
  },
  saveButton: {
    backgroundColor: "#613F75",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "SoraSemiBold",
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
    fontFamily: "SoraRegular",
  },
});
