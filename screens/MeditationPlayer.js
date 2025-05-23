// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   SafeAreaView,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Dimensions,
//   Animated
// } from "react-native";
// import { AntDesign, Ionicons  } from "@expo/vector-icons";
// import { Audio } from "expo-av";
// import { useFocusEffect } from "@react-navigation/native";
// import Slider from '@react-native-community/slider';
// import { useRoute } from '@react-navigation/native';
// import { AudioContext } from "../context/AudioContext";

// const { width } = Dimensions.get("screen");

// export default function MeditationPlayer({ route, navigation }) {
//   const { meditationId, title, description, audioURL } = route.params;

//   const [isPlaying, setIsPlaying] = useState(false);
//   const [sound, setSound] = useState(null);
//   const [positionMillis, setPositionMillis] = useState(0);
//   const [durationMillis, setDurationMillis] = useState(0);
//   const [sliderValue, setSliderValue] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const scaleValue = new Animated.Value(1);

//   useFocusEffect(
//     React.useCallback(() => {
//       loadAudio();

//       return () => {
//         if (sound) {
//           sound.unloadAsync();
//         }
//       };
//     }, [audioURL])
//   );

//   const handlePlaybackStatusUpdate = (status) => {
//     if (status) {
//       setPositionMillis(status.positionMillis);
//       setDurationMillis(status.durationMillis);
//       setSliderValue(status.positionMillis / status.durationMillis);
//     }
//   };

//   const loadAudio = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { sound: newSound } = await Audio.Sound.createAsync({
//         uri: audioURL,
//       });
//       setSound(newSound);
//       newSound.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error loading audio:", error);
//       setError("Failed to load audio. Please try again later.");
//       setLoading(false);
//     }
//   };

//   const togglePlayback = async () => {
//     if (!sound) return;
//     try {
//       if (isPlaying) {
//         await sound.pauseAsync();
//       } else {
//         await sound.playAsync();
//       }
//       setIsPlaying(!isPlaying);
//     } catch (error) {
//       console.error("Error toggling playback:", error);
//     }
//   };

//   const seekTo = async (value) => {
//     if (!sound) return;
//     const newPosition = value * durationMillis;
//     await sound.setPositionAsync(newPosition);
//   };

//   const formatTime = (milliseconds) => {
//     const seconds = Math.floor(milliseconds / 1000);
//     const minutes = Math.floor(seconds / 60);
//     const formattedMinutes = `${minutes}`.padStart(2, "0");
//     const formattedSeconds = `${seconds % 60}`.padStart(2, "0");
//     return `${formattedMinutes}:${formattedSeconds}`;
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#FF7F9F" />
//       ) : error ? (
//         <Text style={styles.errorText}>{error}</Text>
//       ) : (
//         <View style={styles.card}>
//            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//             <Ionicons name="arrow-back" size={24} color="#333" />
//           </TouchableOpacity>
//           <Text style={styles.title}>{title}</Text>
//           <Image
//             source={require("../assets/images/meditation.png")}
//             style={styles.image}
//             resizeMode="cover"
//           />
//           <Text style={styles.description}>{description}</Text>
//           <Slider
//             style={styles.slider}
//             minimumValue={0}
//             maximumValue={1}
//             value={sliderValue}
//             onSlidingComplete={seekTo}
//             minimumTrackTintColor="#FF7F9F"
//             maximumTrackTintColor="#ccc"
//             thumbTintColor="#FF7F9F"
//           />
//           <View style={styles.timeContainer}>
//             <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
//             <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
//           </View>
//           <TouchableOpacity
//             style={styles.playButton}
//             onPress={togglePlayback}
//             disabled={loading || error}
//           >
//             <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
//               <AntDesign
//                 name={isPlaying ? "pausecircleo" : "playcircleo"}
//                 size={75}
//                 color={isPlaying ? "#FF7F9F" : "#333"}
//               />
//             </Animated.View>
//           </TouchableOpacity>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F7F7F7",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {
//     width: width * 0.9,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   backButton: {
//     position: "absolute",
//     top: 15,
//     left: 20,
//     padding: 10,
//     zIndex: 10,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "600",
//     textAlign: "center",
//     marginBottom: 10,
//     color: "#333",
//     fontFamily: "PoppinsSemiBold",
//   },
//   description: {
//     fontSize: 14,
//     color: "#555",
//     textAlign: "center",
//     marginBottom: 20,
//     fontFamily: "PoppinsRegular",
//   },
//   image: {
//     width: "100%",
//     height: 250,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   slider: {
//     width: "100%",
//     height: 40,
//     marginVertical: 10,
//   },
//   timeContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//     marginVertical: 10,
//   },
//   timeText: {
//     fontSize: 14,
//     color: "#777",
//     fontFamily: "PoppinsRegular",
//   },
//   playButton: {
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//   },
//   errorText: {
//     fontSize: 18,
//     color: "red",
//     textAlign: "center",
//     padding: 20,
//     fontFamily: "PoppinsRegular",
//   },
// });


// MeditationPlayer.js
// import React, { useContext, useEffect } from "react";
// import {
//   View,
//   Text,
//   SafeAreaView,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Dimensions,
//   Animated
// } from "react-native";
// import { AntDesign, Ionicons } from "@expo/vector-icons";
// import Slider from "@react-native-community/slider";
// import { useFocusEffect } from "@react-navigation/native";
// import { AudioContext } from "../context/AudioContext";

// const { width } = Dimensions.get("screen");

// export default function MeditationPlayer({ route, navigation }) {
//   const { meditationId, title, description, audioURL } = route.params;
//   const {
//     isPlaying,
//     positionMillis,
//     durationMillis,
//     loadAudio,
//     togglePlayback,
//     seekTo,
//   } = useContext(AudioContext);

//   const scaleValue = new Animated.Value(1);

//   useFocusEffect(
//     React.useCallback(() => {
//       loadAudio(audioURL);
//       return () => {
//         // Unload audio when leaving the screen
//       };
//     }, [audioURL])
//   );

//   const formatTime = (milliseconds) => {
//     const seconds = Math.floor(milliseconds / 1000);
//     const minutes = Math.floor(seconds / 60);
//     const formattedMinutes = `${minutes}`.padStart(2, "0");
//     const formattedSeconds = `${seconds % 60}`.padStart(2, "0");
//     return `${formattedMinutes}:${formattedSeconds}`;
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.card}>
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#333" />
//         </TouchableOpacity>
//         <Text style={styles.title}>{title}</Text>
//         <Image
//           source={require("../assets/images/meditation.png")}
//           style={styles.image}
//           resizeMode="cover"
//         />
//         <Text style={styles.description}>{description}</Text>
//         <Slider
//           style={styles.slider}
//           minimumValue={0}
//           maximumValue={1}
//           value={positionMillis / durationMillis}
//           onSlidingComplete={seekTo}
//           minimumTrackTintColor="#FF7F9F"
//           maximumTrackTintColor="#ccc"
//           thumbTintColor="#FF7F9F"
//         />
//         <View style={styles.timeContainer}>
//           <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
//           <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
//         </View>
//         <TouchableOpacity
//           style={styles.playButton}
//           onPress={togglePlayback}
//         >
//           <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
//             <AntDesign
//               name={isPlaying ? "pausecircleo" : "playcircleo"}
//               size={75}
//               color={isPlaying ? "#FF7F9F" : "#333"}
//             />
//           </Animated.View>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F7F7F7",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {
//     width: width * 0.9,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   backButton: {
//     position: "absolute",
//     top: 15,
//     left: 20,
//     padding: 10,
//     zIndex: 10,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "600",
//     textAlign: "center",
//     marginBottom: 10,
//     color: "#333",
//     fontFamily: "PoppinsSemiBold",
//   },
//   description: {
//     fontSize: 14,
//     color: "#555",
//     textAlign: "center",
//     marginBottom: 20,
//     fontFamily: "PoppinsRegular",
//   },
//   image: {
//     width: "100%",
//     height: 250,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   slider: {
//     width: "100%",
//     height: 40,
//     marginVertical: 10,
//   },
//   timeContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//     marginVertical: 10,
//   },
//   timeText: {
//     fontSize: 14,
//     color: "#777",
//     fontFamily: "PoppinsRegular",
//   },
//   playButton: {
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//   },
// });

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Animated,
  BackHandler
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";
import { doc, setDoc, collection, addDoc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

const { width } = Dimensions.get("screen");

export default function MeditationPlayer({ route, navigation }) {
  const { title, description, audioURL } = route.params;

  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [intervalId, setIntervalId] = useState(null);

  const scaleValue = new Animated.Value(1);

  useEffect(() => {
    // Configure the audio mode
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          // interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          //interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: true,
        });
      } catch (error) {
        console.error("Error setting audio mode:", error);
      }
    };

    configureAudio();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAudio();

      const onBackPress = () => {
        if (sound) {
          sound.stopAsync();
          sound.unloadAsync();
          setIsPlaying(false);
          clearInterval(intervalId);
        }
        navigation.goBack();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        if (sound) {
          sound.stopAsync();
          sound.unloadAsync();
          setIsPlaying(false);
          clearInterval(intervalId);
        }
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [audioURL])
  );

  useEffect(() => {
    if (isPlaying) {
      const id = setInterval(() => {
        saveProgress();
      }, 60000); // Save progress every 60 seconds
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isPlaying]);

  const handlePlaybackStatusUpdate = (status) => {
    if (status) {
      setPositionMillis(status.positionMillis);
      setDurationMillis(status.durationMillis);
      setSliderValue(status.positionMillis / status.durationMillis);
    }
  };

  const loadAudio = async () => {
    setLoading(true);
    setError(null);
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioURL });
      setSound(newSound);
      newSound.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);
      setLoading(false);
    } catch (error) {
      console.error("Error loading audio:", error);
      setError("Failed to load audio. Please try again later.");
      setLoading(false);
    }
  };

  const togglePlayback = async () => {
    if (!sound) return;
    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  };

  const seekTo = async (value) => {
    if (!sound) return;
    const newPosition = value * durationMillis;
    await sound.setPositionAsync(newPosition);
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const formattedMinutes = `${minutes}`.padStart(2, "0");
    const formattedSeconds = `${seconds % 60}`.padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const saveProgress = async () => {
    const userId = auth.currentUser.uid;
    const sessionDate = new Date();

    try {
      await setDoc(doc(db, `users/${userId}/sessions`, "current"), {
        date: sessionDate,
        meditationId: route.params.meditationId,
        duration: durationMillis,
        positionMillis: positionMillis,
      });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const saveSession = async () => {
    const userId = auth.currentUser.uid;
    const sessionDate = new Date();

    try {
      await addDoc(collection(db, `users/${userId}/sessions`), {
        date: sessionDate,
        meditationId: route.params.meditationId,
        duration: durationMillis,
      });

      await updateStreak(userId, sessionDate);
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  const updateStreak = async (userId, sessionDate) => {
    const userRef = doc(db, `users/${userId}`);
    const userDoc = await getDoc(userRef);
  
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const lastSessionDate = userData.lastSessionDate ? userData.lastSessionDate.toDate() : null;
      let streak = userData.streak || 0;
  
      if (lastSessionDate) {
        // Normalize to start of the day (00:00:00) in UTC for both dates
        const lastSessionDay = new Date(Date.UTC(lastSessionDate.getUTCFullYear(), lastSessionDate.getUTCMonth(), lastSessionDate.getUTCDate()));
        const currentSessionDay = new Date(Date.UTC(sessionDate.getUTCFullYear(), sessionDate.getUTCMonth(), sessionDate.getUTCDate()));
        
        const diffDays = Math.floor((currentSessionDay - lastSessionDay) / (1000 * 60 * 60 * 24));
       
  
        if (diffDays === 1) {
          // If the session is on the next calendar day, increment the streak
          streak += 1;
        } else if (diffDays > 1) {
          // If there is a gap of more than one day, reset the streak
          streak = 1;
        } // if diffDays === 0, the streak remains unchanged for multiple sessions in the same day
      } else {
        // If there is no last session date, start the streak
        streak = 1;
      }

     
      // Update the user's last session date and streak in Firestore
      await updateDoc(userRef, {
        lastSessionDate: sessionDate,
        streak: streak,
      });
    }
  };

  const onComplete = async () => {
    setCompleteLoading(true);
    setFeedback("");
    try {
      await saveSession();
      setFeedback("Session completed successfully!");
    } catch (error) {
      setFeedback("Error completing session. Please try again.");
    } finally {
      setCompleteLoading(false);
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
        setIsPlaying(false);
      }
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#4DB6AC" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.card}>
          <TouchableOpacity style={styles.backButton} onPress={() => {
            if (sound) {
              sound.stopAsync();
              sound.unloadAsync();
              setIsPlaying(false);
            }
            navigation.goBack();
          }}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <Image
            source={require("../assets/images/meditation.png")}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.description}>{description}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={sliderValue}
            onSlidingComplete={seekTo}
            // minimumTrackTintColor="#FF7F9F"
            // maximumTrackTintColor="#ccc"
            // thumbTintColor="#FF7F9F"
            minimumTrackTintColor="#B39DDB"
            maximumTrackTintColor="#4DB6AC"
            thumbTintColor="#B39DDB"
          />
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
            <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
          </View>
          <TouchableOpacity
            style={styles.playButton}
            onPress={togglePlayback}
            disabled={loading || error}
          >
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <AntDesign
                name={isPlaying ? "pausecircleo" : "playcircleo"}
                size={75}
                color={isPlaying ? "#B39DDB" : "#4DB6AC"}
              />
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.completeButton} onPress={onComplete} disabled={completeLoading}>
            {completeLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.completeButtonText}>Complete Session</Text>
            )}
          </TouchableOpacity>
          {feedback ? <Text style={styles.feedbackText}>{feedback}</Text> : null}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    color: "#263238",
  },
  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  slider: {
    width: "100%",
    height: 40,
    marginVertical: 10,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  timeText: {
    fontSize: 14,
    color: "#263238",
  },
  playButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  completeButton: {
    marginTop: 20,
    // backgroundColor: "#FF7F9F",
    backgroundColor: "#A5D6A7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    textAlign: "center",
    alignItems: "center",
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  feedbackText: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    padding: 20,
  },
});