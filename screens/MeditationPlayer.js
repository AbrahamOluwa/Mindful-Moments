import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Animated
} from "react-native";
import { AntDesign, Ionicons  } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useFocusEffect } from "@react-navigation/native";
import Slider from '@react-native-community/slider';
import { useRoute } from '@react-navigation/native';

const { width } = Dimensions.get("screen");

export default function MeditationPlayer({ route, navigation }) {
  const { meditationId, title, description, audioURL } = route.params;

  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scaleValue = new Animated.Value(1);

  useFocusEffect(
    React.useCallback(() => {
      loadAudio();

      return () => {
        if (sound) {
          sound.unloadAsync();
        }
      };
    }, [audioURL])
  );

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
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: audioURL,
      });
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

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF7F9F" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.card}>
           <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
            minimumTrackTintColor="#FF7F9F"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#FF7F9F"
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
                color={isPlaying ? "#FF7F9F" : "#333"}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
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
    color: "#333",
    fontFamily: "PoppinsSemiBold",
  },
  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "PoppinsRegular",
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
    color: "#777",
    fontFamily: "PoppinsRegular",
  },
  playButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    padding: 20,
    fontFamily: "PoppinsRegular",
  },
});
