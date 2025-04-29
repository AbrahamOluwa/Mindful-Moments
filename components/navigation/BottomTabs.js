import { View, Text } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Home from "../../screens/Home";
import Home from "../../screens/NewHome";
//import Meditations from "../../screens/Meditations";
import Meditations from "../../screens/NewMeditation";
import Goals from "../../screens/Goals";
// import Thoughts from "../../screens/Thoughts";
import Thoughts from "../../screens/NewThoughts";
import Settings from "../../screens/Settings";
import Paths from "../../screens/Paths"
import TestProfile from "../../screens/TestProfile.js";

export default function BottomTabs() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Meditate") {
            iconName = focused ? "compass" : "compass-outline";
          } else if (route.name === "Thoughts") {
            iconName = focused ? "radio-outline" : "radio-outline";
          } else if (route.name === "Goals") {
            iconName = focused ? "magnet" : "magnet-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4DB6AC",// #EF798A"
        tabBarInactiveTintColor: "#78909C",  // "gray",
        tabBarLabelStyle: { fontSize: 11.5, fontFamily: "PoppinsRegular" },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Meditate" component={Meditations} />
      <Tab.Screen name="Thoughts" component={Thoughts} />
      <Tab.Screen name="Goals" component={Paths} />
      <Tab.Screen name="Settings" component={Settings} />
      {/* <Tab.Screen name="Settings" component={TestProfile} /> */}
    </Tab.Navigator>
  );

  return (
    <View
      style={{
        flexDirection: "row",
        margin: 10,
        marginHorizontal: 30,
        justifyContent: "space-between",
      }}
    >
      <Icon icon="home" text="Home" />
      <Icon icon="home" text="Meditation" />
      <Icon icon="home" text="Goals" />
    </View>
  );
}
