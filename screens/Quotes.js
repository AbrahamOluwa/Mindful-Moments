import { View, Text, Image, ScrollView } from "react-native";
import React from "react";
import {
  Box,
  Center,
  HStack,
  VStack,
  Heading,
  Stack,
  AspectRatio,
} from "native-base";

export default function Quotes() {
  const quotes = [
    {
      id: 1,
      quote:
        "Your calm mind is the ultimate weapon against your challenges.",
      author: "Bryant McGill",
    },
    {
      id: 1,
      quote:
        "Be present in all things and thankful for all things.",
      author: "Maya Angelou",
    },
    {
      id: 1,
      quote:
        "You are not a drop in the ocean. You are the entire ocean in a drop.",
      author: "Rumi",
    },
    {
      id: 2,
      quote:
        "The soul loves to meditate, for in contact with the Spirit lies its greatest joy.",
      author: "Paramahansa Yogananda",
    },
    {
      id: 3,
      quote: "In the silence of the heart, God speaks.",
      author: "Mother Teresa",
    },
    {
      id: 4,
      quote: "God is not distant; He is within me, closer than my own breath.",
      author: "Swami Vivekananda",
    },
    {
      id: 5,
      quote:
        "The divine spark within you is your connection to the infinite wisdom and love of God.",
      author: "Unknown",
    },
    {
      id: 6,
      quote:
        "When you realize the depth of your connection with God, you understand the oneness of all creation.",
      author: "Eckhart Tolle",
    },
    {
      id: 7,
      quote:
        "You are not separate from the whole. You are one with the sun, the earth, the air. You don't have a life. You are life.",
      author: "Eckhart Tolle",
    },
    {
      id: 8,
      quote:
        "You are a child of God. Your playing small does not serve the world.",
      author: "Marianne Williamson",
    },
    {
      id: 9,
      quote:
        "Your purpose is to awaken to your true nature, to remember your divine essence, and to live from that place of love and oneness.",
      author: "Unknown",
    },
    {
      id: 10,
      quote:
        "The highest spiritual practice is to live constantly aware of your oneness with God and all of creation.",
      author: "Neale Donald Walsch",
    },
    {
      id: 10,
      quote:
        "You are a Child of God, a priceless part of His Kingdom, which He created as part of Him. Nothing else exists and ONLY this is real.",
      author: "A Course In Miracles",
    },
    {
      id: 10,
      quote:
        "The awakening of the soul is the realization that you are a spiritual being having a human experience.",
      author: "Pierre Teilhard de Chardin",
    },
  ];

  return (
    // <View>
    //   <Text style={{ fontFamily: "SoraRegular" }}>Quotes in this app</Text>
    // </View>

    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {quotes.map((quote, index) => {
          return (
            <Box key={index} alignItems="center" style={{ marginBottom: 18 }}>
              <Box
                width="100%"
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
                <Stack p="3" space={3}>
                  <Stack space={2}>
                    <Heading size="4xl" ml="-1">
                      <Text style={{ fontFamily: "PassionOneRegular" }}>"</Text>
                    </Heading>
                    <Text
                      _light={{
                        color: "violet.500",
                      }}
                      _dark={{
                        color: "violet.400",
                      }}
                      fontWeight="500"
                      ml="-0.5"
                      mt="-1"
                      style={{
                        fontFamily: "SoraMedium",
                        fontSize: 17,
                        marginTop: -35,
                        color: '#D87093'
                      }}
                    >
                      {quote.quote}
                    </Text>
                  </Stack>
                  {/* <Text fontWeight="400">
                    Bengaluru (also called Bangalore) is the center of India's
                    high-tech industry. The city is also known for its parks and
                    nightlife.
                  </Text> */}
                  <HStack
                    alignItems="center"
                    space={4}
                    justifyContent="space-between"
                  >
                    <HStack alignItems="center">
                      <Text
                        color="coolGray.600"
                        _dark={{
                          color: "warmGray.200",
                        }}
                        fontWeight="400"
                        style={{
                          fontFamily: "SoraMedium",
                          fontSize: 14
                        }}
                      >
                        - {quote.author}
                      </Text>
                    </HStack>
                  </HStack>
                </Stack>
              </Box>
            </Box>
          );
        })}
      </ScrollView>
    </View>
  );
}
