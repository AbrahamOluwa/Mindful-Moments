import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { Button, Card } from 'native-base';

export default function ResourceCard({ title, description, imageUrl, onButtonPress }) {
  return (
    <View>
      <Card style={styles.resourceCard}>
        <Image
         source={{ uri: imageUrl }}
          style={styles.image}
        />
        <Text style={styles.title}>{title}</Text>
        <Button onPress={onButtonPress} style={styles.button}>
          <Text style={styles.buttonText}>Read More</Text>
        </Button>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  resourceCard: {
    width: 220,
    height: 250, // Fixed height for uniformity
    marginRight: 15,
    borderRadius: 15,
    padding: 15,
    backgroundColor: "#fff",
    elevation: 5,
    justifyContent: "space-between", // Align content properly
    overflow: "hidden", // Prevent content overflow
  },

  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },

  title: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "PoppinsRegular",
    flexShrink: 1, // Prevent text overflow
  },

  button: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#9D50BB", // Matching button color with card
    fontSize: 14,
    fontWeight: "600",
  },
});
