import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Picker } from "@react-native-picker/picker";
import DatePicker from "@react-native-community/datetimepicker";

export default function SetGoals({navigation}) {
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

  const addTask = () => {
    if (newTask) {
      setTasks([...tasks, newTask]);
      setNewTask("");
    }
  };

  const removeTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const saveGoal = () => {
    // Implement the logic to save the goal and its associated tasks
    // You can also perform form validation here before saving

    navigation.navigate("GoalsListScreen")
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.heading}>Set Goal</Text>

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

          {/* <TextInput
          style={styles.input}
          placeholder="Due Date"
          value={dueDate}
          onChangeText={(text) => setDueDate(text)}
        /> */}

          <Text style={styles.label}>
            Due Date <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.datePickerContainer}
            onPress={showDueDatePickerModal}
          >
            <AntDesign name="calendar" size={20} color="#888" />
            <Text style={styles.datePickerText}>{dueDate.toDateString()}</Text>
          </TouchableOpacity>
          {showDueDatePicker && (
            <DatePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={handleDueDatePickerChange}
            />
          )}

          <Text style={styles.label}>
            Category <Text style={{ color: "red" }}>*</Text>
          </Text>

          <Picker
            style={styles.dropdown}
            selectedValue={category}
            onValueChange={(value) => setCategory(value)}
          >
            <Picker.Item label="Category 1" value="category1" style={styles.pickerItemStyle} />
            <Picker.Item label="Category 2" value="category2" style={styles.pickerItemStyle} />
            <Picker.Item label="Category 3" value="category3" style={styles.pickerItemStyle}/>
          </Picker>

          <Text style={styles.label}>
            Priority <Text style={{ color: "red" }}>*</Text>
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Priority"
            value={priority}
            onChangeText={(text) => setPriority(text)}
          />

          {/* <TextInput
          style={styles.input}
          placeholder="Reminder Date"
          value={reminderDate}
          onChangeText={(text) => setReminderDate(text)}
        /> */}

          <Text style={styles.label}>
            Reminder Date <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.datePickerContainer}
            onPress={showReminderDatePickerModal}
          >
            <AntDesign name="calendar" size={20} color="#888" />
            <Text style={styles.datePickerText}>
              {reminderDate.toDateString()}
            </Text>
          </TouchableOpacity>
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
                <Text style={styles.taskText}>{task}</Text>
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

          <TouchableOpacity style={styles.saveButton} onPress={saveGoal}>
            <Text style={styles.saveButtonText}>Save Goal</Text>
          </TouchableOpacity>
        </ScrollView>
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
    fontFamily: 'SoraMedium'
  },
  input2: {
    height: 120,
    padding: 10,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#FFF",
    fontFamily: 'SoraMedium'
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
    fontFamily: 'SoraMedium',
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
    fontFamily: 'SoraMedium'
  },
  tasksContainer: {
    maxHeight: 150,
    marginBottom: 20,
  },
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#EFB9CB',
    padding: 10,
  },
  taskText: {
    flex: 1,
    fontSize: 15,
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
    fontFamily: "SoraMedium"
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
});
