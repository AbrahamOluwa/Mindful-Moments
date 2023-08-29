import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  Text,
  ScrollView,
} from "react-native";
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
        imageList.push(data);
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
      <ScrollView>
        {images.map((imageData, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              source={{ uri: imageData.imageUrl }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        ))}
      </ScrollView>
    </View>
  

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    //backgroundColor: "#fff",
  },
  imageContainer: {
    marginBottom: 16,
  },
  image: {
    width: "100%",
    aspectRatio: 8 / 9,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   image: {
//     width: '48%', // Adjust as needed to create columns
//     aspectRatio: 1, // Maintain aspect ratio
//     marginBottom: 16,
//   },
// });
