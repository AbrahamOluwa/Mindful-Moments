// context/AudioContext.js
import React, { createContext, useState, useEffect } from "react";
import { Audio } from "expo-av";

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const [isMeditationPlaying, setIsMeditationPlaying] = useState(false); // New state

  const loadAudio = async (url) => {
    setAudioURL(url);
    try {
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: url,
      });
      setSound(newSound);
      newSound.setOnPlaybackStatusUpdate((status) => {
        setPositionMillis(status.positionMillis);
        setDurationMillis(status.durationMillis);
      });
      setIsMeditationPlaying(true); // Set to true when audio is loaded
    } catch (error) {
      console.error("Error loading audio:", error);
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

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        positionMillis,
        durationMillis,
        audioURL,
        loadAudio,
        togglePlayback,
        seekTo,
        isMeditationPlaying, // Provide the new state
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};