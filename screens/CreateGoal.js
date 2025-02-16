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
import { Calendar } from "react-native-calendars";
import * as Animatable from "react-native-animatable";
import { useDispatch } from "react-redux";
import { addGoalsAction } from "../redux/actions/goalActions";
import { useAuth } from "../context/AuthContext";

export default function CreateGoal({ navigation }) {
  const { user } = useAuth();
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
  const [milestones, setMilestones] = useState([]);
  const [newMilestone, setNewMilestone] = useState("");

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

  const addMilestone = () => {
    if (newMilestone) {
      const newMilestoneObject = { text: newMilestone, completed: false };
      setMilestones([...milestones, newMilestoneObject]);
      setNewMilestone("");
    }
  };

  const removeMilestone = (index) => {
    const updatedMilestones = [...milestones];
    updatedMilestones.splice(index, 1);
    setMilestones(updatedMilestones);
  };

  const markMilestoneAsCompleted = (index) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index].completed = true;
    setMilestones(updatedMilestones);
  };

  const saveGoal = async () => {
    setIsSubmitting(true);
  
    try {
      if (!goalTitle || !goalDescription || !dueDate || !category || !priority || tasks.length === 0) {
        setIsSubmitting(false);
        toast.show({
          render: () => (
            <Box bg="#ff0e0e" px="4" py="3" rounded="sm" mb={5}>
              <Text style={{ fontFamily: "PoppinsMedium", color: "#fff" }}>
                Please ensure all mandatory fields are completed and include tasks and milestones in your goals.
              </Text>
            </Box>
          ),
        });
        console.log("Please ensure all mandatory fields are completed and include tasks and milestones in your goals.");
        return;
      }
  
      const userId = user?.uid;
      if (!userId) {
        toast.show({
          title: "Authentication Error",
          status: "error",
          description: "You must be logged in to save an entry.",
        });
        setIsSubmitting(false);
        return;
      }
  
      // Create a new goal object with the required fields
      const goalData = {
        title: goalTitle,
        description: goalDescription,
        dueDate: dueDate,
        category: category,
        priority: priority,
        createdAt: serverTimestamp(),
        reminderSettings: {
          repeatOption: repeatOption,
          selectedDays: selectedDays,
          selectedDate: repeatOption === "Monthly" || repeatOption === "Yearly" ? selectedDate : "",
          selectedTime: repeatOption === "Daily" ? selectedTime : "",
        },
        isGoalCompleted: false,
        status: "active",
      };
  
      // Save the main goal data
      const goalRef = await addDoc(collection(db, "users", userId, "goals"), goalData);
      console.log("Goal saved with ID:", goalRef.id);
  
      // Save milestones associated with the goal
      for (const milestone of milestones) {
        await addDoc(collection(db, "users", userId, "goals", goalRef.id, "milestones"), {
          ...milestone,
          createdAt: serverTimestamp(),
        });
      }
      console.log("Milestones saved successfully!");
  
      // Save tasks associated with the goal
      for (const task of tasks) {
        await addDoc(collection(db, "users", userId, "goals", goalRef.id, "tasks"), {
          ...task,
          createdAt: serverTimestamp(),
        });
      }
      console.log("Tasks saved successfully!");
  
      toast.show({
        render: () => (
          <Box bg="emerald.500" px="4" py="3" rounded="sm" mb={5}>
            <Text style={{ fontFamily: "PoppinsMedium", color: "#fff" }}>
              Goal saved successfully!
            </Text>
          </Box>
        ),
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
      setTasks([]);
      setNewTask("");
      setMilestones([]);
      setNewMilestone("");
      setReminderDate(new Date());
    } catch (error) {
      console.error("Error saving goal:", error);
    } finally {
      setIsSubmitting(false);
    }
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
    <View style={styles.headerContainer}>
      <Text style={styles.heading}>Set Goal</Text>
      <TouchableOpacity onPress={handleInfoIconPress}>
        <Animatable.View animation="bounce" iterationCount="infinite" easing="linear">
          <AntDesign style={styles.infoIcon} name="infocirlceo" size={24} color="blue" />
        </Animatable.View>
      </TouchableOpacity>
    </View>

    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.label}>
          Title <Text style={styles.requiredField}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Goal Title"
          value={goalTitle}
          onChangeText={setGoalTitle}
        />
      </View>

      <View>
        <Text style={styles.label}>
          Description <Text style={styles.requiredField}>*</Text>
        </Text>
        <TextInput
          style={styles.inputDescription}
          placeholder="Enter Goal Description"
          multiline
          value={goalDescription}
          onChangeText={setGoalDescription}
        />
      </View>

      <View>
        <Text style={styles.label}>
          Due Date <Text style={styles.requiredField}>*</Text>
        </Text>
        <TouchableOpacity style={styles.datePickerContainer} onPress={showDueDatePickerModal}>
          <AntDesign name="calendar" size={20} color="#888" />
          <Text style={styles.datePickerText}>{dueDate.toDateString()}</Text>
        </TouchableOpacity>
        {showDueDatePicker && (
          <DatePicker value={dueDate} mode="date" display="default" onChange={handleDueDatePickerChange} />
        )}
      </View>

      <View>
        <Text style={styles.label}>
          Category <Text style={styles.requiredField}>*</Text>
        </Text>
        <View style={styles.selectContainer}>
          <Select
            selectedValue={category}
            minWidth="200"
            accessibilityLabel="Choose Category"
            placeholder="Choose Category"
            _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size="5" /> }}
            variant="unstyled"
            mt={1}
            shadow={2}
            style={styles.select}
            onValueChange={setCategory}
          >
            <Select.Item label="General" value="General" />
            <Select.Item label="Health and Fitness" value="Health and Fitness" />
            <Select.Item label="Personal Development" value="Personal Development" />
            <Select.Item label="Career and Work" value="Career and Work" />
            <Select.Item label="Finance and Money" value="Finance and Money" />
            <Select.Item label="Education" value="Education" />
            <Select.Item label="Travel and Adventure" value="Travel and Adventure" />
            <Select.Item label="Relationships" value="Relationships" />
            <Select.Item label="Home and Lifestyle" value="Home and Lifestyle" />
            <Select.Item label="Community and Social Impact" value="Community and Social Impact" />
            <Select.Item label="Spirituality" value="Spirituality" />
          </Select>
        </View>
      </View>

      <View>
        <Text style={styles.label}>
          Priority <Text style={styles.requiredField}>*</Text>
        </Text>
        <View style={styles.selectContainer}>
          <Select
            selectedValue={priority}
            minWidth="200"
            accessibilityLabel="Choose Priority"
            placeholder="Choose Priority"
            _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size="5" /> }}
            variant="unstyled"
            mt={1}
            shadow={2}
            style={styles.select}
            onValueChange={setPriority}
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
          Set Reminder <Text style={styles.requiredField}>*</Text>
        </Text>
        <View style={styles.row}>
          {["Daily", "Weekly", "Monthly", "Yearly"].map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => toggleRepeatOption(option)}
              style={[
                styles.option,
                { backgroundColor: repeatOption === option ? "#EF798A" : "#F2F2F2" },
              ]}
            >
              <Text style={{ color: repeatOption === option ? "white" : "black", fontFamily: "PoppinsRegular" }}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {repeatOption === "Daily" && (
          <View style={{ marginTop: 15 }}>
            <Text style={styles.miniLabel}>Select Time</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <View style={styles.timePickerContainer}>
                <Text style={styles.timeText}>{formattedTime}</Text>
              </View>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker value={selectedTime} mode="time" display="clock" onChange={handleTimeChange} />
            )}
          </View>
        )}
        {repeatOption === "Weekly" && (
          <View style={{ marginTop: 15 }}>
            <Text style={[styles.miniLabel, { marginLeft: 10 }]}>Repeat On</Text>
            <View style={styles.row}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <TouchableOpacity
                  key={day}
                  onPress={() => toggleDay(day)}
                  style={[
                    styles.option,
                    { backgroundColor: selectedDays.includes(day) ? "#EF798A" : "#F2F2F2" },
                  ]}
                >
                  <Text style={{ color: selectedDays.includes(day) ? "white" : "black", fontFamily: "PoppinsRegular" }}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        {(repeatOption === "Monthly" || repeatOption === "Yearly") && (
          <View style={{ marginTop: 15 }}>
            <Text style={styles.miniLabel}>Select Date</Text>
            <Calendar
              current={selectedDate}
              onDayPress={(day) => onDatePress(day.dateString)}
              markedDates={selectedDate ? { [selectedDate]: { selected: true } } : {}}
            />
          </View>
        )}
      </View>

      {showReminderDatePicker && (
        <DatePicker value={reminderDate} mode="date" display="default" onChange={handleReminderDatePickerChange} />
      )}

      <Text style={styles.label}>Tasks</Text>
      <ScrollView style={styles.tasksContainer}>
        {tasks.map((task, index) => (
          <View key={index} style={styles.taskRow}>
            <Text style={styles.taskText}>{task.text}</Text>
            <TouchableOpacity onPress={() => removeTask(index)}>
              <AntDesign name="delete" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => markTaskAsCompleted(index)}>
              <AntDesign name="checkcircle" size={20} color="green" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

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

      {/* <Text style={styles.label}>Milestones</Text>
      <ScrollView style={styles.tasksContainer}>
        {milestones.map((milestone, index) => (
          <View key={index} style={styles.taskRow}>
            <Text style={styles.taskText}>{milestone.text}</Text>
            <TouchableOpacity onPress={() => removeMilestone(index)}>
              <AntDesign name="delete" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => markMilestoneAsCompleted(index)}>
              <AntDesign name="checkcircle" size={20} color="green" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.addTaskContainer}>
        <TextInput
          style={styles.addTaskInput}
          placeholder="Add Milestone"
          value={newMilestone}
          onChangeText={setNewMilestone}
        />
        <TouchableOpacity style={styles.addTaskButton} onPress={addMilestone}>
          <Text style={styles.addTaskButtonText}>Add Milestone</Text>
        </TouchableOpacity>
      </View> */}

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
              fontFamily: "PoppinsMedium",
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
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} _backdrop={{ _dark: { bg: "coolGray.800" }, bg: "warmGray.50" }} size="lg">
          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>
              <Text style={styles.guideTitle}>Creating and Using Goals</Text>
            </Modal.Header>
            <Modal.Body>
              <Text style={styles.guideStep}>1. Set a Clear Title:</Text>
              <Text style={styles.guideText}>Start by giving your goal a clear and concise title. For example, "Learn a New Language."</Text>

              <Text style={styles.guideStep}>2. Add a Description:</Text>
              <Text style={styles.guideText}>Provide a brief description that outlines what you want to achieve with this goal, such as "Conversational fluency in Spanish."</Text>

              <Text style={styles.guideStep}>3. Set a Due Date:</Text>
              <Text style={styles.guideText}>Choose a due date to set a target for achieving your goal. For learning a new language, you can set a due date of "6 months from today."</Text>

              <Text style={styles.guideStep}>4. Assign a Category:</Text>
              <Text style={styles.guideText}>Categorize your goal under a relevant category, like "Personal Development" or "Language Learning."</Text>

              <Text style={styles.guideStep}>5. Prioritize Your Goal:</Text>
              <Text style={styles.guideText}>Assign a priority level to highlight the importance of the goal. For our language learning goal, you can choose "Medium" to maintain a steady pace.</Text>

              <Text style={styles.guideStep}>6. Create a Reminder:</Text>
              <Text style={styles.guideText}>Set up reminders to receive notifications that keep you on track. You can create reminders like:</Text>
              <Text style={styles.guideTextBold}>- "Practice Spanish for 30 minutes today."</Text>
              <Text style={styles.guideTextBold}>- "Review vocabulary and practice speaking."</Text>

              <Text style={styles.guideStep}>7. Break It into Tasks:</Text>
              <Text style={styles.guideText}>Divide your language learning goal into smaller tasks to make it more manageable. Tasks might include:</Text>
              <Text style={styles.guideTextBold}>- "Learn 10 new words daily."</Text>
              <Text style={styles.guideTextBold}>- "Watch Spanish movies with subtitles for practice."</Text>
              <Text style={styles.guideTextBold}>- "Have a 15-minute conversation with a native speaker each week."</Text>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button style={styles.cancelButton} onPress={() => setShowModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
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
    backgroundColor: "#F4F8FB",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 24,
    fontFamily: "PoppinsSemiBold",
    marginBottom: 20,
  },
  infoIcon: {
    marginTop: -20,
  },
  label: {
    fontFamily: "PoppinsRegular",
    fontSize: 16,
    marginBottom: 10,
  },
  requiredField: {
    color: "red",
  },
  input: {
    height: 47,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#FFF",
    fontFamily: "PoppinsRegular",
  },
  inputDescription: {
    height: 120,
    padding: 10,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#FFF",
    fontFamily: "PoppinsRegular",
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
    fontFamily: "PoppinsRegular",
  },
  selectContainer: {
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 20,
  },
  select: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
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
  miniLabel: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 14,
    marginBottom: 10,
    color: "#222222",
  },
  timePickerContainer: {
    paddingVertical: 15,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  timeText: {
    fontFamily: "PoppinsSemiBold",
    color: "#613F75",
    fontSize: 20,
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
    fontFamily: "PoppinsRegular",
  },
  addTaskContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  addTaskInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    fontFamily: "PoppinsRegular",
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
    fontSize: 14,
    fontFamily: "PoppinsRegular",
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
    fontFamily: "PoppinsRegular",
  },
  guideTitle: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 16,
    marginBottom: 10,
  },
  guideStep: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 14,
    marginTop: 10,
  },
  guideText: {
    fontFamily: "PoppinsRegular",
    fontSize: 12,
    marginTop: 5,
  },
  guideTextBold: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 12,
    marginTop: 5,
  },
  cancelButton: {
    backgroundColor: "#5bc0de",
  },
  cancelButtonText: {
    fontFamily: "PoppinsRegular",
    color: "#fff",
  },
});
