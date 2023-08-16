import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Box,
  HStack,
  AspectRatio,
  Image,
  Center,
  Stack,
  Heading,
} from "native-base";

export default function Topics({ route, navigation }) {
  const { selectedCategory } = route.params;

  // useEffect(() => {
  //   console.log(route.params);
  // }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HStack space={15} p={2}>
        <Stack>
          <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
            <AntDesign
              name="arrowleft"
              size={30}
              color="black"
              // style={{ marginTop: 0 }}
            />
          </TouchableOpacity>
        </Stack>

        <Stack>
          <Text style={{ fontFamily: "SoraSemiBold", fontSize: 20 }}>
            {selectedCategory.category}
          </Text>
        </Stack>
      </HStack>

      <ScrollView>
        {selectedCategory.topics.map((item, index) => {
          return (
            <Pill
              key={index}
              data={item}
              index={index}
              navigation={navigation}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const Pill = (props) => {
  return (
    <TouchableOpacity
      onPress={() => props.navigation.navigate("SelectedTopicScreen")}
    >
      <Box
        key={props.index}
        alignItems="center"
        style={{ paddingVertical: 15 }}
      >
        <Box
          w="80%"
          maxW="80"
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.700",
          }}
          _web={{
            shadow: 2,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: "gray.50",
          }}
        >
          <Box>
            <AspectRatio w="100%" ratio={16 / 9}>
              <Image
                source={{
                  uri: "https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg",
                }}
                alt="image"
              />
            </AspectRatio>
          </Box>
          <Stack p="4" space={3}>
            <Stack space={2}>
              <Text
                size="md"
                ml="-1"
                style={{ fontFamily: "SoraMedium", fontSize: 16 }}
              >
                {props.data.title}
              </Text>

              <Text
                style={{
                  fontFamily: "SoraRegular",
                  fontSize: 12,
                  color: "gray",
                }}
              >
                {props.data.description}
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};
