import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { Box } from "native-base";

const items = [
  {
    text: "Mindfulness",
  },
  {
    text: "Personal Growth",
  },
  {
    text: "Emotional Well-being",
  },
  {
    text: "Spirituality",
  },
  {
    text: "Gratitude",
  },
  {
    text: "Relationships",
  },
  {
    text: "Health and Wellness",
  },
  {
    text: "Inspiration and Motivation",
  },
];

export default function ArticlesCategories() {
  return (
    <View style={{ flex:1, marginTop: 20}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((item, index) => {
          return (
            <Box
              key={index}
              alignItems="center"
              style={{ marginHorizontal: 7 }}
            >
              <Box
                rounded="sm"
                p="2"
                _text={{
                  fontSize: "md",
                  fontWeight: "medium",
                  color: "warmGray.50",
                  letterSpacing: "lg",
                  textAlign: "center",
                }}
                bg={["red.400", "blue.400"]}
                // bg="#E9967A"
              >
                <TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: "SoraRegular",
                      color: "white",
                      fontSize: 13,
                    }}
                  >
                    {item.text}
                  </Text>
                </TouchableOpacity>
              </Box>
            </Box>
          );
        })}
      </ScrollView>

      
    </View>
  );
}
