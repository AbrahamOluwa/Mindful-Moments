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
    <SafeAreaView style={{ flex: 1 }}>
      <View>
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

        <View
          style={{
            marginTop: -10,
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "SoraSemiBold",
          }}
        >
          <Text style={styles.header}>Journal Entries</Text>
          <Text style={styles.description}>Oops... No journals yet!</Text>
          <Text style={styles.description}>Tap to Start Writing</Text>
        </View>

        <View style={{ alignItems: "center", justifyContent: "center", marginTop: 50 }}>
          <Button
            leftIcon={<Icon as={FontAwesome} name="plus" size="sm" />}
            style={{ backgroundColor: "#EF798A", borderRadius: 22 }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("WriteJournalEntryScreen")}
              //onPress={() => navigation.navigate("AllJournalEntriesScreen")}
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

const styles = StyleSheet.create({
  header: {
    fontFamily: "SoraSemiBold",
    fontSize: 28,
    marginBottom: 15,
  },

  description: {
    fontFamily: "SoraSemiBold",
    color: "gray",
    fontSize: 15,
  },
});
