import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function SelectedSubtopic({ navigation }) {
  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate("SelectedTopicScreen")}
        >
          <AntDesign
            name="arrowleft"
            size={32}
            color="black"
            // style={{ marginTop: 0 }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={{marginTop: 10}}>
          <View>
            <Text
              style={{
                fontFamily: "SoraSemiBold",
                fontSize: 20,
              }}
            >
              Title of the Sub Topic
            </Text>
            <Text
              style={{
                fontFamily: "SoraSemiBold",
                fontSize: 18,
                marginTop: 20,
              }}
            >
              Introduction:{" "}
            </Text>
            <Text
              style={{
                fontFamily: "SoraRegular",
                marginTop: 5,
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
              lobortis hendrerit dolor, quis blandit tellus rhoncus vitae.
              Pellentesque commodo vitae erat ac consequat. Cras porttitor
              vehicula euismod. Vivamus et neque nisi. Proin eu posuere velit.
              Aliquam accumsan vehicula diam id finibus. Aenean commodo, neque
              id commodo suscipit, erat risus commodo mauris, nec dignissim
              tellus orci nec mauris. Vivamus pharetra lectus sit amet magna
              posuere, a dapibus ipsum vulputate. Donec rhoncus lacus molestie
              ornare porttitor. Sed consectetur non sem quis pharetra. Donec vel
              nulla dictum, gravida nunc eu, luctus enim. Donec vitae tellus
              fringilla leo accumsan aliquam. Nunc eu ultricies felis.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
