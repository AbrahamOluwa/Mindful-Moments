import {
  View,
  Text,
  Dimensions,
  StatusBar,
  Animated,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Categories from "../components/home/Categories";
import { Box, Center, useColorModeValue } from "native-base";
import { TabView, SceneMap } from "react-native-tab-view";
import Quotes from "./Quotes.js";
import Articles from "./Articles.js";

export default function Home() {
  return (
    <>
      <SafeAreaView style={{ marginTop: 22 }}>
        <Box alignItems="center">
          <Box
            width="90%"
            rounded="lg"
            p="9"
            _text={{
              fontSize: "md",
              fontWeight: "medium",
              color: "warmGray.50",
              letterSpacing: "lg",
              textAlign: "center",
            }}
            // bg={["red.400", "blue.400"]}
            bg="#E9967A"
          >
            <Text style={{ fontFamily: "SoraRegular", color: "white" }}>
              You are a Child of God, a priceless part of His Kingdom, which He created as part of Him. Nothing else exists and ONLY this is real.
            </Text>
          </Box>
        </Box>
      </SafeAreaView>

      <Categories quotes={Quotes} articles={Articles} />


    </>
  );
}

// const Category = (props) => {
//   const FirstRoute = () => (
//     <Center flex={1} my="7">
//       <props.quotes />
//     </Center>
//   );

//   const SecondRoute = () => (
//     <Center flex={1} my="4">
//       <props.articles />
//     </Center>
//   );

//   const ThirdRoute = () => (
//     <Center flex={1} my="4">
//       This is Tab 3
//     </Center>
//   );

//   const FourthRoute = () => (
//     <Center flex={1} my="4">
//       This is Tab 4{" "}
//     </Center>
//   );

//   const initialLayout = {
//     width: Dimensions.get("window").width,
//   };

//   const renderScene = SceneMap({
//     first: FirstRoute,
//     second: SecondRoute,
//     third: ThirdRoute,
//     fourth: FourthRoute,
//   });

//   const [index, setIndex] = useState(0);
//   const [routes] = useState([
//     {
//       key: "first",
//       title: "Quotes",
//     },
//     {
//       key: "second",
//       title: "Articles",
//     },
//     {
//       key: "third",
//       title: "Images",
//     },
//     {
//       key: "fourth",
//       title: "Videos",
//     },
//   ]);

//   const renderTabBar = (props) => {
//     const inputRange = props.navigationState.routes.map((x, i) => i);
//     return (
//       <Box flexDirection="row">
//         {props.navigationState.routes.map((route, i) => {
//           const opacity = props.position.interpolate({
//             inputRange,
//             outputRange: inputRange.map((inputIndex) =>
//               inputIndex === i ? 1 : 0.5
//             ),
//           });
//           const color =
//             index === i
//               ? useColorModeValue("#000", "#e5e5e5")
//               : useColorModeValue("#1f2937", "#a1a1aa");
//           const borderColor =
//             index === i
//               ? "#6883bc"
//               : useColorModeValue("coolGray.200", "gray.400");
//           return (
//             <Box
//               borderBottomWidth="3"
//               key={i}
//               borderColor={borderColor}
//               flex={1}
//               alignItems="center"
//               p="3"
//               cursor="pointer"
//             >
//               <Pressable
//                 onPress={() => {
//                   // console.log(i);
//                   setIndex(i);
//                 }}
//               >
//                 <Animated.Text
//                   style={{
//                     color,
//                     fontFamily: "SoraMedium",
//                   }}
//                 >
//                   {route.title}
//                 </Animated.Text>
//               </Pressable>
//             </Box>
//           );
//         })}
//       </Box>
//     );
//   };

//   return (
//     <TabView
//       navigationState={{
//         index,
//         routes,
//       }}
//       renderScene={renderScene}
//       renderTabBar={renderTabBar}
//       onIndexChange={setIndex}
//       initialLayout={initialLayout}
//       style={{
//         marginTop: StatusBar.currentHeight,
//       }}
//       swipeEnabled={false}
//     />
//   );
// };
