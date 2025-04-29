import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { format, addDays, isToday } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

const items = [
  { day: 1, items: [{ text: "Welcome", completed: false }, { text: "Quick Read", completed: false }, { text: "Today's Action", completed: true }, { text: "Reflection", completed: true }] },
  { day: 2, items: [{ text: "Welcome", completed: true }, { text: "Quick Read", completed: false }, { text: "Today's Action", completed: false }, { text: "Reflection", completed: true }] },
  { day: 3, items: [{ text: "Welcome", completed: false }, { text: "Quick Read", completed: true }, { text: "Today's Action", completed: true }, { text: "Reflection", completed: false }] },
  { day: 4, items: [{ text: "Welcome", completed: false }, { text: "Quick Read", completed: false }, { text: "Today's Action", completed: true }, { text: "Reflection", completed: true }] },
  { day: 5, items: [{ text: "Welcome", completed: true }, { text: "Quick Read", completed: true }, { text: "Today's Action", completed: true }, { text: "Reflection", completed: true }] },
  { day: 6, items: [{ text: "Welcome", completed: false }, { text: "Quick Read", completed: false }, { text: "Today's Action", completed: true }, { text: "Reflection", completed: true }] },
//   { day: 7, items: [{ text: "Welcome", completed: false }, { text: "Quick Read", completed: false }, { text: "Today's Action", completed: true }, { text: "Reflection", completed: true }] },
//   { day: 2, items: [{ text: "Item 2.1", completed: true }, { text: "Item 2.2", completed: false }, { text: "Item 2.3", completed: false }] },
//   { day: 3, items: [{ text: "Item 3.1", completed: true }, { text: "Item 3.2", completed: true }, { text: "Item 3.3", completed: false }] },
//   { day: 4, items: [{ text: "Item 4.1", completed: false }, { text: "Item 4.2", completed: true }, { text: "Item 4.3", completed: false }] },
//   { day: 5, items: [{ text: "Item 5.1", completed: true }, { text: "Item 5.2", completed: true }, { text: "Item 5.3", completed: false }] },
//   { day: 6, items: [{ text: "Item 6.1", completed: false }, { text: "Item 6.2", completed: false }, { text: "Item 6.3", completed: true }] },
//   { day: 7, items: [{ text: "Item 7.1", completed: true }, { text: "Item 7.2", completed: false }, { text: "Item 7.3", completed: true }] },
];

const WeekView = ({ navigation }) => {
  const [activeDay, setActiveDay] = useState(0);
  const weekDays = [...Array(7)].map((_, i) => addDays(new Date(), i));

  const handleDayPress = (index) => {
    setActiveDay(index);
    //navigation.navigate("DailyPathScreen", { day: index + 1 });
  };

  const currentItems = items.find(item => item.day === activeDay + 1)?.items || [];

  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.weekContainer} showsHorizontalScrollIndicator={false}>
        {weekDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCard,
              activeDay === index && styles.activeDayCard,
              isToday(day) && styles.currentDayCard
            ]}
            onPress={() => handleDayPress(index)}
          >
            <Text style={styles.dayLabel}>Day {index + 1}</Text>
            <Text style={styles.dateLabel}>{format(day, "MMM d")}</Text>
            <Text style={styles.dayNameLabel}>{format(day, "EEE")}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.itemsContainer}>
        {currentItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.itemCard} onPress={() => navigation.navigate("ItemDetailScreen", { item })}>
            <Ionicons name={item.completed ? "checkmark-circle" : "ellipse-outline"} size={24} color={item.completed ? "green" : "gray"} />
            <Text style={[styles.itemText, item.completed && styles.completedItemText]}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   // flex: 1,
    backgroundColor: "#f5f7fa",
    paddingTop: 40, // Adding padding to avoid the notch
  },
  weekContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#f5f7fa", // Matching background color
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  dayCard: {
    width: 78,
    height: 83,
    borderRadius: 10,
    backgroundColor: "#E5E4E2",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 5,
    padding: 10,
    paddingTop: 13,
  },
  activeDayCard: {
    backgroundColor: "#a9a9a9", // Darker gray for the active day
  },
  currentDayCard: {
    backgroundColor: "#add8e6", // Light blue for the current day
  },
  dayLabel: {
    fontSize: 13,
    color: "#333",
    //fontWeight: "bold",
    marginBottom: 5,
    fontFamily: 'PoppinsSemiBold'
  },
  dateLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
    fontFamily: 'PoppinsMedium'
  },
  dayNameLabel: {
    fontSize: 11,
    color: "#999",
    fontFamily: 'PoppinsRegular'
  },
  itemsContainer: {
    paddingHorizontal: 20,
    backgroundColor: "#f5f7fa",
    marginTop: 25,
  },
  itemCard: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    fontFamily: 'PoppinsRegular',
    marginLeft: 10,
  },
  completedItemText: {
    textDecorationLine: "line-through",
    color: "green",
  },
});

export default WeekView;