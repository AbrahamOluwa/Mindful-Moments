import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack, Stack} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import ThoughtCard from "../components/thoughts/ThoughtCard.js";

export default function AllGratitudeMoments({navigation}) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ marginTop: 15 }}>

          <HStack space={3} p={2}>
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

            <Stack style={{ alignItems: "center", justifyContent: "center" }}>
              <Text
                style={{
                  fontFamily: "SoraSemiBold",
                  fontSize: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                All Gratitude Moments
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
