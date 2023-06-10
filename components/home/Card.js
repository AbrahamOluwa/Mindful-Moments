import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Card = ({ title, isFocused }) => {
  const cardStyle = isFocused ? styles.focusedCard : styles.card;

  return (
    // <View style={cardStyle}>
    //   <Text style={styles.cardTitle}>{title}</Text>
    // </View>

    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "red",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 8,
    width: 150,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
  },
  focusedCard: {
    backgroundColor: "red",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 0,
    width: 200,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default Card;
