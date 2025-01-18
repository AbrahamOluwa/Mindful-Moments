
// components/MinimizedPlayer.js
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { AudioContext } from "../../context/AudioContext";

const MinimizedPlayer = () => {
    const { isPlaying, positionMillis, durationMillis, togglePlayback, seekTo, isMeditationPlaying } = useContext(AudioContext);
  
    if (!isMeditationPlaying) {
      return null;
    }
  
    const formatTime = (milliseconds) => {
      const seconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const formattedMinutes = `${minutes}`.padStart(2, "0");
      const formattedSeconds = `${seconds % 60}`.padStart(2, "0");
      return `${formattedMinutes}:${formattedSeconds}`;
    };
  
    return (
      <View style={styles.container}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={positionMillis / durationMillis}
          onSlidingComplete={seekTo}
          minimumTrackTintColor="#FF7F9F"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#FF7F9F"
        />
        <View style={styles.controls}>
          <TouchableOpacity onPress={togglePlayback}>
            <AntDesign
              name={isPlaying ? "pausecircleo" : "playcircleo"}
              size={24}
              color={isPlaying ? "#FF7F9F" : "#333"}
            />
          </TouchableOpacity>
          <Text style={styles.timeText}>
            {formatTime(positionMillis)} / {formatTime(durationMillis)}
          </Text>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      backgroundColor: "#fff",
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: "#ccc",
      marginBottom: 50, // Adjust this value based on your bottom navigation height
    },
    controls: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    slider: {
      width: "100%",
      height: 40,
    },
    timeText: {
      fontSize: 14,
      color: "#777",
    },
  });
  
  export default MinimizedPlayer;