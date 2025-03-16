import React from "react";
import { View, StyleSheet, Text } from "react-native";

const ItemDetail = ({ route }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.itemText}>{item.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    padding: 20,
  },
  itemText: {
    fontSize: 24,
    color: "#333",
    fontFamily: 'PoppinsSemiBold'
  },
});

export default ItemDetail;