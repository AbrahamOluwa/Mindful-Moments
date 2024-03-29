import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Picker } from "@react-native-picker/picker";
import DatePicker from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import {
  Button,
  useToast,
  Box,
  Select,
  CheckIcon,
  Center,
  Modal,
} from "native-base";
import { getUserId } from "../components/home/GetUserId";
import { Calendar } from "react-native-calendars";
import * as Animatable from "react-native-animatable";
import { useDispatch } from "react-redux";
import { addGoalsAction } from "../redux/actions/goalActions";

export default function SetGoals({ navigation }) {
  const dispatch = useDispatch();
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [showReminderDatePicker, setShowReminderDatePicker] = useState(false);
  const [reminderDate, setReminderDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  // const [selectedDays, setSelectedDays] = useState({});
  // const [selectedTime, setSelectedTime] = useState("");
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [repeatOption, setRepeatOption] = useState("Daily"); // Default to Daily
  const [selectedDays, setSelectedDays] = useState([]); // Selected days for Weekly
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString()); // Selected date for Monthly and Yearly
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [goalsAlreadyCreated, setGoalsAlreadyCreated] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleTimeChange = (event, selected) => {
    if (event.type === "set") {
      setSelectedTime(selected || selectedTime);
    }
    setShowTimePicker(Platform.OS === "ios");
  };

  const formattedTime = selectedTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const showDueDatePickerModal = () => {
    setShowDueDatePicker(true);
  };

  const showReminderDatePickerModal = () => {
    setShowReminderDatePicker(true);
  };

  const handleDueDatePickerChange = (event, date) => {
    setShowDueDatePicker(false);
    if (date !== undefined) {
      setDueDate(date);
    }
  };

  const handleReminderDatePickerChange = (event, date) => {
    setShowReminderDatePicker(false);
    if (date !== undefined) {
      setReminderDate(date);
    }
  };

  // const addTask = () => {
  //   if (newTask) {
  //     setTasks([...tasks, newTask]);
  //     setNewTask("");
  //   }
  // };

  const addTask = () => {
    if (newTask) {
      const newTaskObject = { text: newTask, completed: false };
      setTasks([...tasks, newTaskObject]);
      setNewTask("");
    }
  };

  const removeTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  // Function to mark a task as completed
  const markTaskAsCompleted = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = true;
    setTasks(updatedTasks);
  };

  const saveGoal = async () => {
    setIsSubmitting(true);

    try {
      if (
        !goalTitle ||
        !goalDescription ||
        !dueDate ||
        !reminderDate ||
        !category ||
        !priority ||
        tasks.length === 0
      ) {
        setIsSubmitting(false);
        toast.show({
          render: () => {
            return (
              <Box bg="#ff0e0e" px="4" py="3" rounded="sm" mb={5}>
                <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                  Please ensure all mandatory fields are completed and include
                  tasks in your goals.
                </Text>
              </Box>
            );
          },
        });
        console.log(
          "Please ensure all mandatory fields are completed and include tasks in your goals."
        );
        return;
      }

      const userId = await getUserId();

      // Create a new goal object with the required fields
      const goalData = {
        title: goalTitle,
        description: goalDescription,
        dueDate: dueDate,
        category: category,
        priority: priority,
        dueDate: dueDate,
        // reminderDate: reminderDate,
        tasks: tasks,
        numberOfTasks: tasks.length,
        completedTasks: tasks.filter((task) => task.completed === true).length,
        isCompleted: false,
        status: "active",
        createdAt: serverTimestamp(),
        reminderSettings: {
          repeatOption: repeatOption, // "Daily", "Weekly", "Monthly", "Yearly"
          selectedDays: selectedDays, // Array of selected days (for Weekly)
          selectedDate:
            repeatOption === "Monthly" || repeatOption === "Yearly"
              ? selectedDate
              : "", // Array of selected dates (for Monthly and Yearly)
          selectedTime: repeatOption === "Daily" ? selectedTime : "", // Time selected by the user (for Daily)
        },
      };

      const collectionRef = collection(
        db,
        "nonRegisteredUsers",
        userId,
        "goals"
      );

      await addDoc(collectionRef, goalData);

      console.log("Goal saved successfully! Document ID:", collectionRef.id);

      //dispatch(addGoalsAction(goals));

      //setIsSubmitting(false);

      toast.show({
        render: () => {
          return (
            <Box bg="emerald.500" px="4" py="3" rounded="sm" mb={5}>
              <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                Goal saved successfully!
              </Text>
            </Box>
          );
        },
      });

      setTimeout(() => {
        navigation.navigate("GoalsListScreen");
      }, 2000);

      // Reset the form fields after saving
      setGoalTitle("");
      setGoalDescription("");
      setDueDate(new Date());
      setCategory("");
      setPriority("");
      setReminderDate(new Date());
      setTasks([]);
      setNewTask("");
    } catch (error) {
      console.error("Error saving goal:", error);
    } finally {
      setIsSubmitting(false); // This is placed in the finally block
    }

    // console.log(goalTitle);
    // console.log(goalDescription);
    // console.log(category);
    // console.log(priority);
    // console.log(tasks);
    // console.log(dueDate);
    // console.log(repeatOption);
    // console.log(selectedDays)
    // console.log(repeatOption === 'Monthly' || repeatOption === 'Yearly' ? selectedDate : '',)
    // console.log(repeatOption === 'Daily' ? selectedTime : '')

    //setIsSubmitting(false)
  };

  const onDayPress = (day) => {
    // Clone the current selectedDays state to avoid mutating it directly
    const newSelectedDays = { ...selectedDays };

    if (newSelectedDays[day.dateString]) {
      // Deselect the day if it's already selected
      delete newSelectedDays[day.dateString];
    } else {
      // Select the day if it's not already selected
      newSelectedDays[day.dateString] = {
        selected: true,
        marked: true,
        selectedColor: "blue", // You can customize the selected day's appearance
      };
    }

    setSelectedDays(newSelectedDays);
  };

  const toggleRepeatOption = (option) => {
    setRepeatOption(option);
  };

  const toggleDay = (day) => {
    // Toggle the selected state of a day for Weekly reminders
    if (selectedDays.includes(day)) {
      setSelectedDays(
        selectedDays.filter((selectedDay) => selectedDay !== day)
      );
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const onDatePress = (date) => {
    // Handle date selection for Monthly and Yearly
    setSelectedDate(date);
  };

  useEffect(() => {
    // Check if the modal has been shown before
    AsyncStorage.getItem("modalShown").then((value) => {
      if (value !== "true") {
        setShowModal(true); // Modal hasn't been shown, display it
      }
    });
  }, []);

  const handleInfoIconPress = () => {
    setShowModal(true);
    AsyncStorage.setItem("modalShown", "true");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.heading}>Set Goal</Text>
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

        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
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
          </View>

          <View>
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
          </View>

          <View>
            <Text style={styles.label}>
              Due Date <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.datePickerContainer}
              onPress={showDueDatePickerModal}
            >
              <AntDesign name="calendar" size={20} color="#888" />
              <Text style={styles.datePickerText}>
                {dueDate.toDateString()}
              </Text>
            </TouchableOpacity>
            {showDueDatePicker && (
              <DatePicker
                value={dueDate}
                mode="date"
                display="default"
                onChange={handleDueDatePickerChange}
              />
            )}
          </View>

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
                selectedValue={category}
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
                onValueChange={(itemValue) => setCategory(itemValue)}
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
                selectedValue={priority}
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
                onValueChange={(itemValue) => setPriority(itemValue)}
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
                        repeatOption === option ? "#EF798A" : "#F2F2F2",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: repeatOption === option ? "white" : "black",
                      fontFamily: "SoraLight",
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {repeatOption === "Daily" && (
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
                    value={selectedTime}
                    mode="time"
                    //is24Hour={true}
                    display="clock"
                    onChange={handleTimeChange}
                  />
                )}
              </View>
            )}
            {repeatOption === "Weekly" && (
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
                            backgroundColor: selectedDays.includes(day)
                              ? "#EF798A"
                              : "#F2F2F2",
                          },
                        ]}
                      >
                        <Text
                          style={{
                            color: selectedDays.includes(day)
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
            {(repeatOption === "Monthly" || repeatOption === "Yearly") && (
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

          {showReminderDatePicker && (
            <DatePicker
              value={reminderDate}
              mode="date"
              display="default"
              onChange={handleReminderDatePickerChange}
            />
          )}

          <ScrollView style={styles.tasksContainer}>
            {tasks.map((task, index) => (
              <View key={index} style={styles.taskRow}>
                <Text style={styles.taskText}>{task.text}</Text>
                <TouchableOpacity onPress={() => removeTask(index)}>
                  <AntDesign name="delete" size={20} color="black" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

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
            <TouchableOpacity style={styles.saveButton} onPress={saveGoal}>
              <Text style={styles.saveButtonText}>Save Goal</Text>
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
              isLoadingText="Saving Goal"
            >
              Button
            </Button>
          )}
        </ScrollView>

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
                    Creating and Using Goals
                  </Text>
                </Modal.Header>
                <Modal.Body>
                  <Text style={styles.guideStep}>1. Set a Clear Title:</Text>
                  <Text style={styles.guideText}>
                    Start by giving your goal a clear and concise title. For
                    example, "Learn a New Language."
                  </Text>

                  <Text style={styles.guideStep}>2. Add a Description:</Text>
                  <Text style={styles.guideText}>
                    Provide a brief description that outlines what you want to
                    achieve with this goal, such as "Conversational fluency in
                    Spanish."
                  </Text>

                  <Text style={styles.guideStep}>3. Set a Due Date:</Text>
                  <Text style={styles.guideText}>
                    Choose a due date to set a target for achieving your goal.
                    For learning a new language, you can set a due date of "6
                    months from today."
                  </Text>

                  <Text style={styles.guideStep}>4. Assign a Category:</Text>
                  <Text style={styles.guideText}>
                    Categorize your goal under a relevant category, like
                    "Personal Development" or "Language Learning."
                  </Text>

                  <Text style={styles.guideStep}>5. Prioritize Your Goal:</Text>
                  <Text style={styles.guideText}>
                    Assign a priority level to highlight the importance of the
                    goal. For our language learning goal, you can choose
                    "Medium" to maintain a steady pace.
                  </Text>

                  <Text style={styles.guideStep}>6. Create a Reminder:</Text>
                  <Text style={styles.guideText}>
                    Set up reminders to receive notifications that keep you on
                    track. You can create reminders like:
                  </Text>
                  <Text style={styles.guideTextBold}>
                    - "Practice Spanish for 30 minutes today."
                  </Text>
                  <Text style={styles.guideTextBold}>
                    - "Review vocabulary and practice speaking."
                  </Text>

                  <Text style={styles.guideStep}>7. Break It into Tasks:</Text>
                  <Text style={styles.guideText}>
                    Divide your language learning goal into smaller tasks to
                    make it more manageable. Tasks might include:
                  </Text>
                  <Text style={styles.guideTextBold}>
                    - "Learn 10 new words daily."
                  </Text>
                  <Text style={styles.guideTextBold}>
                    - "Watch Spanish movies with subtitles for practice."
                  </Text>
                  <Text style={styles.guideTextBold}>
                    - "Have a 15-minute conversation with a native speaker each
                    week."
                  </Text>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    {/* <Button
                    variant="ghost"
                    colorScheme="blueGray"
                    onPress={() => {
                      setShowModal(false);
                    }}
                  >
                    Cancel
                  </Button> */}
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
    //borderWidth: 1,
    //borderColor: "white",
    //borderRadius: 5,
    padding: 10,
    // marginBottom: 20,

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
    maxHeight: 210,
    marginBottom: 20,
    marginTop: 15,
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
