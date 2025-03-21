import {
  View,
  Text,
  Dimensions,
  StatusBar,
  Animated,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Tabs from "../components/home/Tabs";
import { Box, Center, useColorModeValue } from "native-base";
// import { TabView, SceneMap } from "react-native-tab-view";
import Quotes from "./Quotes.js";
import Articles from "./Articles.js";
import { auth, db } from "../firebaseConfig";
import { signInAnonymously, onAuthStateChanged, getAuth } from "firebase/auth";
import { doc, collection, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MotivationalImages from "./MotivationalImages.js";

export default function Home() {
  // useEffect(() => {
  //   signInAnonymously(auth)
  //     .then((userCredential) => {
  //       // Access the user object
  //       const user = userCredential.user;
  //       console.log("Anonymous User ID:", user.uid);
  //       saveNonRegisteredUser(user.uid);
  //     })
  //     .catch((error) => {
  //       // Handle sign-in error
  //       console.log("Anonymous sign-in error:", error);
  //     });
  // }, []);

  const saveNonRegisteredUser = async (userId) => {
    const userRef = doc(collection(db, "nonRegisteredUsers"), userId);

    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      const userData = {
        userId: userId,
        createdAt: serverTimestamp(),
        // Other user data
      };

      await setDoc(userRef, userData);
      console.log("User saved successfully!");
    } else {
      console.log("User already exists!");
    }
  };

  const saveUserId = async (userId) => {
    try {
      await AsyncStorage.setItem('nonRegisteredUserId', userId);
    } catch (error) {
      console.error('Error saving non-registered user ID:', error);
    }
  };

  const getUserId = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
   
      const storedUserId = await AsyncStorage.getItem('nonRegisteredUserId');
  
      if (storedUserId) {
        // User has previously used the app and has a stored userId
        console.log('Retrieved non-registered userId from AsyncStorage:', storedUserId);
        return storedUserId;
      } else {
        // User is anonymous and doesn't have a stored userId
        signInAnonymously(auth)
          .then((userCredential) => {
            const user = userCredential.user;
            const userId = user.uid;
            console.log('Anonymous User ID:', userId);
            saveNonRegisteredUser(userId);
            saveUserId(userId);
            return userId;
          })
          .catch((error) => {
            console.log("Anonymous sign-in error:", error);
          });
      }
    
  
    // if (user && !user.isAnonymous) {
    //   // User is signed in with a registered account
    //   const userId = user.uid;
    //   console.log('Registered User ID:', userId);
    //   return userId;
    // }
  
    // User is signed out
    // console.log('User is signed out');
    // return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      getUserId(); // Call the getUserId function to get and store the userId
    });

    return () => {
      unsubscribe(); // Clean up the subscription on unmount
    };
  }, []);

  

  return (
    <>
      <SafeAreaView style={{ marginTop: 0 }}>
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
            bg="#EF798A"
            // bg="#E9967A"
          >
            <Text style={{ fontFamily: "SoraRegular", color: "white" }}>
             Live. Be Happy
            </Text>
          </Box>
        </Box>
      </SafeAreaView>

      <Tabs quotes={Quotes} articles={Articles} images={MotivationalImages} />
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
