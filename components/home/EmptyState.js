import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";

const EmptyState = (props) => {
  return (
    <View style={styles.emptySection}>
      <Image
        source={{ uri: "https://via.placeholder.com/150" }} // Replace with actual illustration URL
        style={styles.emptyStateImage}
      />
      <Text style={styles.emptyStateTitle}>{props.title}</Text>
      <Text style={styles.emptyStateText}>{props.description}</Text>
      <TouchableOpacity style={styles.ctaButton} onPress={props.onPress}>
        <Text style={styles.ctaButtonText}>{props.buttonText}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default EmptyState


const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: "#f5f5f5",
    },
    emptySection: {
      alignItems: "center",
      marginBottom: 40,
    },
    emptyStateImage: {
      width: 150,
      height: 150,
      marginBottom: 15,
    },
    emptyStateTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 10,
      fontFamily: "PoppinsSemiBold"
    },
    emptyStateText: {
      fontSize: 16,
      color: "#666",
      textAlign: "center",
      marginBottom: 20,
      fontFamily: "PoppinsRegular"

    },
    ctaButton: {
      backgroundColor: "#9D50BB",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    ctaButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  });