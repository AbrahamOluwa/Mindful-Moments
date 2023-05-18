import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Animated,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { TabView, SceneMap } from "react-native-tab-view";
import { Box, Center, useColorModeValue } from "native-base";
import Constants from "expo-constants";
import Quotes from "../../screens/Quotes";
import { SafeAreaView } from "react-native-safe-area-context";

const FirstRoute = () => (
  <Center flex={1} my="7">
    <Quotes />
  </Center>
);

const SecondRoute = () => (
  <Center flex={1} my="4">
    This is Tab 2
  </Center>
);

const ThirdRoute = () => (
  <Center flex={1} my="4">
    This is Tab 3
  </Center>
);

const FourthRoute = () => (
  <Center flex={1} my="4">
    This is Tab 4{" "}
  </Center>
);

const initialLayout = {
  width: Dimensions.get("window").width,
};

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
  fourth: FourthRoute,
});



export default function Categories() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "first",
      title: "Quotes",
    },
    {
      key: "second",
      title: "Articles",
    },
    {
      key: "third",
      title: "Images",
    },
    {
      key: "fourth",
      title: "Videos",
    },
  ]);

  const renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    return (
      <Box flexDirection="row">
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.5
            ),
          });
          const color =
            index === i
              ? useColorModeValue("#000", "#e5e5e5")
              : useColorModeValue("#1f2937", "#a1a1aa");
          const borderColor =
            index === i
              ? "#6883bc"
              : useColorModeValue("coolGray.200", "gray.400");
          return (
            <Box
              borderBottomWidth="3"
              key={i}
              borderColor={borderColor}
              flex={1}
              alignItems="center"
              p="3"
              cursor="pointer"
            >
              <Pressable
                onPress={() => {
                  // console.log(i);
                  setIndex(i);
                }}
              >
                <Animated.Text
                  style={{
                    color,
                    fontFamily: 'SoraMedium'
                  }}
                >
                  {route.title}
                </Animated.Text>
              </Pressable>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
      <TabView
        navigationState={{
          index,
          routes,
        }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={{
          marginTop: StatusBar.currentHeight
        }}
      />

    
 
  );
}
