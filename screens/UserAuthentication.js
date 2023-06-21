import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack, Stack, Button, Icon } from "native-base";
import { AntDesign } from "@expo/vector-icons";
//import { Icon } from 'react-native-vector-icons';

export default function UserAuthentication() {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/welcome.png")}
          style={styles.image}
        />
        <Text style={styles.title}>Login to Mindful Moments</Text>
        <Text style={styles.description}>
          Login to Mindful Moments and unlock a world of personal growth and
          well-being. Take a moment to center yourself and access a range of
          mindfulness tools and resources.
        </Text>
        <TouchableOpacity
          style={[
            styles.button,
            (style = {
              backgroundColor: "#eee",
              borderWidth: 1,
              borderColor: "blue",
            }),
          ]}
        >
          <HStack space={4}>
            <AntDesign name="google" size={24} color="#4285F4" />
            <Text style={[styles.buttonText, (style = { color: "black" })]}>
              Continue with Google
            </Text>
          </HStack>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continue with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, style={backgroundColor: '#ec4899'}]}>
          <Text style={styles.buttonText}>Login With Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signupButton}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By signing up, you agree to our{"\n"}Terms of Service and Privacy
          Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: "SoraSemiBold",
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "SoraRegular",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 30,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "SoraSemiBold",
  },
  signupButton: {
    marginTop: 20,
  },
  signupButtonText: {
    color: "#4285F4",
    fontSize: 16,
    fontFamily: "SoraSemiBold",
  },
  termsText: {
    marginTop: 30,
    fontSize: 12,
    textAlign: "center",
    fontFamily: "SoraRegular"
  },
});
