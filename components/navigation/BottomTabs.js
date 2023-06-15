import { View, Text } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../../screens/Home";
import Meditations from "../../screens/Meditations";
import Goals from "../../screens/Goals";
import Thoughts from "../../screens/Thoughts";
import Settings from "../../screens/Settings";

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
        tabBarActiveTintColor: "#EF798A",  //e75874
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: { fontSize: 11.5, fontFamily: "SoraRegular" },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Meditate" component={Meditations} />
      <Tab.Screen name="Thoughts" component={Thoughts} />
      <Tab.Screen name="Goals" component={Goals} />
      <Tab.Screen name="Settings" component={Settings} />
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
