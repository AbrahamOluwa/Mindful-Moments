import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import {
  Box,
  HStack,
  AspectRatio,
  Image,
  Center,
  Stack,
  Heading,
} from "native-base";
import ArticlesCategories from "../components/home/ArticlesCategories";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"

const articles = [
  {
    id: 1,
    category: "Mindfulness",
    topics: [
      {
        title: "Introduction to Mindfulness",
        description: "Explaining what mindfulness is",
        image: ".....",
      },
      {
        title: "Mindful Breathing",
        description: "Exploring different breathing techniques",
        image: ".....",
      },
      {
        title: "Mindful Breathing",
        description: "Exploring different breathing techniques",
        image: ".....",
      },
      {
        title: "Mindful Breathing",
        description: "Exploring different breathing techniques",
        image: ".....",
      },
      {
        title: "Mindful Breathing",
        description: "Exploring different breathing techniques",
        image: ".....",
      },
    ],
  },
  {
    id: 2,
    category: "Personal Growth",
    topics: [
      {
        title: "Building Self-Confidence",
        description: "Boost self-confidence",
        image: "...",
      },
      {
        title: "Building Self-Confidence",
        description: "Boost self-confidence",
        image: "...",
      },
      {
        title: "Building Self-Confidence",
        description: "Boost self-confidence",
        image: "...",
      },
      {
        title: "Building Self-Confidence",
        description: "Boost self-confidence",
        image: "...",
      },
      {
        title: "Building Self-Confidence",
        description: "Boost self-confidence",
        image: "...",
      },
    ],
  },
  {
    category: "Emotional Well-Being",
  },
  {
    category: "Spirituality",
  },
  {
    category: "Gratitude",
  },
  {
    category: "Relationships",
  },
  {
    category: "Health and Wellness",
  },
  {
    category: "Inspiration and Motivation",
  },
];

const hotTopicsItems = [
  {
    title: "Building Self-Confidence",
    // image: require("../../assets/images/completed_1.jpg"),
  },
  {
    title: "Developing Resilience and Bouncing Back",
    // image: require("../../assets/images/completed_1.jpg"),
  },
  {
    title: "Developing Emotional Intelligence",
    // image: require("../../assets/images/completed_1.jpg"),
  },
];

export default function Articles() {
  const [categories, setCategories] = useState(articles);
  const navigation = useNavigation();

  return (
    <View>
      <ScrollView>
        <Text
          style={{
            fontFamily: "SoraSemiBold",
            marginLeft: 10,
            fontSize: 25,
            // fontWeight: 'bold'
          }}
        >
          Search By Categories
        </Text>

        <ArticlesCategories
          categories={categories}
          navigation={navigation}
        />

        <View style={{ flex: 1, marginTop: 20 }}>
          <HStack space={1}>
            <Text
              style={{
                fontFamily: "SoraSemiBold",
                marginLeft: 10,
                fontSize: 20,
              }}
            >
              Hot
            </Text>

            <MaterialIcons
              name="local-fire-department"
              size={24}
              color="#e25822"
              style={{
                marginTop: 4,
              }}
            />
          </HStack>
        </View>

        <View style={{ flex: 1, marginTop: 20 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {hotTopicsItems.map((item, index) => {
              return <Pill key={index} data={item} index={index} />;
            })}
          </ScrollView>
        </View>
        <View style={{ marginTop: -55 }}>
          <HStack space={1}>
            <Text
              style={{
                fontFamily: "SoraSemiBold",
                marginLeft: 10,
                fontSize: 20,
              }}
            >
              Trending
            </Text>

            <MaterialIcons
              name="local-fire-department"
              size={24}
              color="#e25822"
              style={{
                marginTop: 4,
              }}
            />
          </HStack>
        </View>

        <View style={{ flex: 1, marginTop: 20 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {hotTopicsItems.map((item, index) => {
              return <Pill key={index} data={item} index={index} />;
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const Pill = (props) => {
  return (
    <Box
      key={props.index}
      alignItems="center"
      w="80%"
      maxW="250"
      style={{ marginLeft: -10, height: 300, paddingHorizontal: 14 }}
    >
      <Box
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
            <Text size="md" ml="-1" style={{ fontFamily: "SoraMedium" }}>
              {props.data.title}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};
