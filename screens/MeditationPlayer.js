import { View, Text, StyleSheet, TouchableOpacity, Image,Dimensions } from "react-native";
import Slider from "@react-native-community/slider";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';
import { useRoute } from "@react-navigation/native";


const { width } = Dimensions.get("screen");
export default function MeditationPlayer({ route }) { 

  // const route = useRoute();
  const { medidationId, title, description, audioURL } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [playbackStatus, setPlaybackStatus] = useState(null);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);



  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          //console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handlePlaybackStatusUpdate = (status) => {
    setPlaybackStatus(status);
    if (status) {
      setPositionMillis(status.positionMillis);
      setDurationMillis(status.durationMillis);
      setSliderValue(status.positionMillis);
    }
  };

  const togglePlayback = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.log("Error toggling playback:", error);
    }
  };

  const seekTo = async (position) => {
    try {
      if (sound && durationMillis) {
        await sound.setPositionAsync(position);
        setPositionMillis(position);
        setSliderValue(position);
      }
    } catch (error) {
      console.log("Error seeking audio:", error);
    }
  };

  const loadAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({
        // uri: meditation.audioUrl,
        uri: audioURL,
      });
      // const { sound } = await Audio.Sound.createAsync(
      //   require("../assets/audio/dyksen.mp3")
      // );
      setSound(sound);
      sound.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);
    } catch (error) {
      console.log("Error loading audio:", error);
    }
  };

  useEffect(() => {
    loadAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);



  return (
    <SafeAreaView style={{}}>
      <View style={styles.container}>
        {/* <Text style={styles.title}>{meditation.title}</Text> */}
        <Text style={styles.title}>Breather</Text>

        <Image
          source={require("../assets/images/meditation.png")}
          style={styles.image}
          resizeMode="cover"
        />
        <Slider
          style={styles.progressBar}
          minimumValue={0}
          maximumValue={durationMillis}
          value={sliderValue}
          onValueChange={(value) => setSliderValue(value)}
          onSlidingComplete={seekTo}
          minimumTrackTintColor="#333"
          maximumTrackTintColor="#FF69B4"
          thumbTintColor="#333"
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
          <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
        </View>
        <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
          {/* <Text style={styles.playButtonText}>
            {isPlaying ? "Pause" : "Play"}
          </Text> */}

          {/* <Feather name={isPlaying ? 'pause-circle' : 'play-circle'} size={70} color="#333" /> */}
          <AntDesign name={isPlaying ? 'pausecircleo' : 'playcircleo'} size={70} color={isPlaying ? 'red' : 'blue'} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const formattedMinutes = `${minutes}`.padStart(2, "0");
  const formattedSeconds = `${seconds % 60}`.padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    fontFamily: "SoraSemiBold"
  },
  progressBar: {
    width: "100%",
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    color: "#555",
    fontFamily: "SoraRegular"
  },
  // playButton: {
  //   backgroundColor: "#333",
  //   paddingVertical: 8,
  //   borderRadius: 8,
  //   marginTop: 16,
  // },
  // playButtonText: {
  //   color: "#FFF",
  //   fontWeight: "bold",
  //   fontSize: 16,
  // },
  image: {
    width: width,
    height: 450,
    borderRadius: 100,
    marginBottom: 16,
  },
});
