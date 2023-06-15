import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack, Stack, Button, Icon } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import ThoughtCard from "../components/thoughts/ThoughtCard.js";

export default function AllJournalEntries({navigation}) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ marginTop: 15 }}>
          {/* <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontFamily: "SoraSemiBold", fontSize: 24 }}>
              All Journals
            </Text>
          </View> */}

          <HStack space={60} p={2}>
            <Stack>
              <TouchableOpacity
                onPress={() => navigation.navigate("HomeScreen")}
              >
                <AntDesign
                  name="arrowleft"
                  size={30}
                  color="black"
                  style={{ marginTop: 5 }}
                />
              </TouchableOpacity>
            </Stack>

            <Stack style={{alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontFamily: "SoraSemiBold", fontSize: 24, alignItems: "center", justifyContent: "center" }}>
                All Journals
              </Text>
            </Stack>
          </HStack>

          <ThoughtCard />
          <ThoughtCard />
          <ThoughtCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
