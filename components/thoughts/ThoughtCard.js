import { View, Text } from 'react-native'
import React from 'react'
import { HStack, Stack } from "native-base";
import { AntDesign } from "@expo/vector-icons";

export default function ThoughtCard() {
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
  )
}