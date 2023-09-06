import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Picker } from "@react-native-picker/picker";
import DatePicker from "@react-native-community/datetimepicker";
import { Button, useToast, Box } from "native-base";
import { useRoute } from "@react-navigation/native";

export default function EditGoal() {
  const route = useRoute();
  const { title, description, dueDate } = route.params;

  const [goalTitle, setGoalTitle] = useState(title);
  const [goalDescription, setGoalDescription] = useState(description);
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [newDueDate, setNewDueDate] = useState(new Date(formatFirestoreTimestamp(dueDate)));
  const [showReminderDatePicker, setShowReminderDatePicker] = useState(false);
  const [reminderDate, setReminderDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  
  function formatFirestoreTimestamp(timestamp) {
    const jsDate = timestamp.toDate();
    const formattedDate = jsDate.toISOString().split("T")[0];

    return formattedDate;
  }
  

  const showDueDatePickerModal = () => {
    setShowDueDatePicker(true);
  };

  const showReminderDatePickerModal = () => {
    setShowReminderDatePicker(true);
  };

  const handleDueDatePickerChange = (event, date) => {
    setShowDueDatePicker(false);
    if (date !== undefined) {
      setNewDueDate(date);
    }
  };

  const handleReminderDatePickerChange = (event, date) => {
    setShowReminderDatePicker(false);
    if (date !== undefined) {
      setReminderDate(date);
    }
  };

  

  

  useEffect(() => {
  }, [])
  

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
            <Text style={styles.datePickerText}>{newDueDate.toDateString()}</Text>
          </TouchableOpacity>
          {showDueDatePicker && (
            <DatePicker
              value={newDueDate}
              mode="date"
              display="default"
              onChange={handleDueDatePickerChange}
            />
          )}
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
});
