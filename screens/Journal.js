import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack, Stack, Button, Icon } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

export default function Journal({ navigation }) {
  const { width } = Dimensions.get("screen");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View>
        {/* <Image
          source={require("../assets/images/writinginjournal_2.png")}
          style={{
            width: width,
            height: 400,
          }}
          resizeMode="contain"
        /> */}

        <ImageBackground
          source={require("../assets/images/writinginjournal_2.png")}
          style={{
            width: width,
            height: 500,
          }}
          resizeMode="contain"
        >
          <HStack space={15} p={2}>
            <Stack>
              <TouchableOpacity
                onPress={() => navigation.navigate("HomeScreen")}
              >
                <AntDesign
                  name="arrowleft"
                  size={30}
                  color="black"
                  // style={{ marginTop: 0 }}
                />
              </TouchableOpacity>
            </Stack>
          </HStack>
        </ImageBackground>

        {/* <View style={{ marginTop: 10, marginLeft: 10 }}>
          <Text style={{ fontFamily: "SoraSemiBold", fontSize: 28 }}>
            Goals
          </Text>
        </View> */}
        <View
          style={{
            marginTop: -10,
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "SoraSemiBold",
          }}
        >
          <Text style={styles.description}>Oops... No journals yet!</Text>
          <Text style={styles.description}>Tap to Start Writing</Text>
        </View>

        <View style={{ alignItems: "center", justifyContent: "center" }}>
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
                style={{
                  fontFamily: "SoraMedium",
                  color: "#fff",
                  fontSize: 13,
                }}
              >
                Add new
              </Text>
            </TouchableOpacity>
          </Button>
        </View>
      </View>
      {/* <ScrollView>
        <View style={{ marginTop: 20 }}>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontFamily: "SoraSemiBold", fontSize: 24 }}>
              All Journals
            </Text>
          </View>
          <JournalItems />
          <JournalItems />
          <JournalItems />
        </View>
      </ScrollView> */}
    </SafeAreaView>
  );
}

const JournalItems = () => {
  return (
    <View
      style={{
        marginLeft: 10,
        // justifyContent: "center",
        // alignItems: "center",
        marginTop: 30,
      }}
    >
      <View
        style={{
          backgroundColor: "#FBF2FD",
          borderRadius: 8,
          width: "32%",
          padding: 7,
          justifyContent: "flex-start",
          marginLeft: 12,
        }}
      >
        <HStack>
          <Stack>
            <AntDesign name="calendar" size={18} color="black" />
          </Stack>

          <Stack>
            <Text style={{ fontFamily: "SoraRegular", fontSize: 12 }}>
              14 Jun 2023
            </Text>
          </Stack>
        </HStack>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#EECFD4",
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 16,
            marginRight: 12,
            width: "90%",
            marginTop: 10,
          }}
        >
          <Text style={{ fontFamily: "SoraSemiBold", fontSize: 16 }}>
            The best part of my day
          </Text>
          <Text style={{ fontFamily: "SoraRegular", fontSize: 12 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            dignissim eleifend eros at finibus. Morbi.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  description: {
    fontFamily: "SoraSemiBold",
    color: "lightgray",
    fontSize: 15,
  },
});
