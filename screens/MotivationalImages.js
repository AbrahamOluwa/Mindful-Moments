import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, ActivityIndicator, Text } from "react-native";
import { getDocs, collection } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function MotivationalImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "motivation_images"));
      const imageList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        imageList.push(data.imageUrl);
      });
      setImages(imageList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EF798A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {images.map((imageUrl, index) => (
        <Image
          key={index}
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
