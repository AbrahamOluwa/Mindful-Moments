import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Categories from "../components/home/Categories";
import { Box } from "native-base";

export default function Home() {
  return (
    <>
      <SafeAreaView style={{marginTop: 22 }}>
        <Box alignItems="center">
          <Box
            width="90%"
            rounded="lg"
            p="9"
            _text={{
              fontSize: "md",
              fontWeight: "medium",
              color: "warmGray.50",
              letterSpacing: "lg",
              textAlign: "center",
            }}
            // bg={["red.400", "blue.400"]}
            bg="#E9967A"
          >
            <Text style={{ fontFamily: "SoraRegular", color: "white" }}>
              This is a Box
            </Text>
          </Box>
        </Box>
      </SafeAreaView>

      <Categories />

      
    </>
  );
}
