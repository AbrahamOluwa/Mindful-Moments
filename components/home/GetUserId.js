import { View, Text } from 'react-native'
import React from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig.js";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const getUserId = async () => {
    const storedUserId = await AsyncStorage.getItem("nonRegisteredUserId");
    if (storedUserId) {
      // console.log(
      //   "Retrieved non-registered userId from AsyncStorage:",
      //   storedUserId
      // );
      return storedUserId;
    } else {
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            resolve(user.uid);
          } else {
            reject(new Error("User is not signed in."));
          }
          unsubscribe();
        });
      });
    }
  };

