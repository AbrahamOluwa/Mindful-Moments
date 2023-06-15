import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  Pressable,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

export default function Goals({ navigation }) {
  const { width } = Dimensions.get("screen");

  return (
    <SafeAreaView style={{ }}>
      <View style={{ marginTop: 10, marginLeft: 10 }}>
        <Text style={{ fontFamily: "SoraSemiBold", fontSize: 28 }}>Goals</Text>
      </View>

      <Image
        source={require("../assets/images/g3.png")}
        style={{
          width: width,
          height: 400,
        }}
        resizeMode="contain"
      />

      <View
        style={{
          marginTop: -10,
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "SoraSemiBold",
        }}
      >
        <Text style={styles.description}>Oops... No goals yet!</Text>
        <Text style={styles.description}>Tap to Start Planning</Text>
      </View>

      <View style={{alignItems: "center", justifyContent: "center", marginTop: 50 }}>
        <Button
          leftIcon={<Icon as={FontAwesome} name="plus" size="sm" />}
          style={{ backgroundColor: "#EF798A", borderRadius: 22 }}
        >
          <TouchableOpacity
            onPress={() => {
              console.log("pressed");
            }}
          >
            <Text
              style={{ fontFamily: "SoraMedium", color: "#fff", fontSize: 13 }}
            >
              Add new
            </Text>
          </TouchableOpacity>
        </Button>
      </View>

      {/* <TouchableOpacity>
          
          <View style={{alignItems: "center", justifyContent: "center",borderRadius: 8, backgroundColor: '#407BFF'}}>
              <Text 
                  style={{
                      alignSelf: "center", 
                      color: "#fff", 
                      fontSize: 15, 
                      padding:12,
                      fontFamily: "SoraRegular",
                  }}
              >
                    Create an account
              </Text>
          </View>
    
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  description: {
    fontFamily: "SoraSemiBold",
    color: "gray",
    fontSize: 15,
  },
});
