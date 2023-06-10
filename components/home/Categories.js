import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { Box } from "native-base";

// const categories = [
//   {
//     category: "Mindfulness",
//     topics: [
//       {
//         title: 'Introduction to Mindfulness',
//         description: 'Explaining what mindfulness is',
//         image: '.....',
//       },
//       {
//         title: 'Mindful Breathing',
//         description: 'Exploring different breathing techniques',
//         image: '.....',
//       },
//     ]
//   },
//   {
//     category: "Personal Growth",
//     topics: [
//       {
//         title: 'Building Self-Confidence',
//         description: 'Boost self-confidence',
//         image: '...'
//       }
//     ]
//   },
//   {
//     category: "Emotional Well-being",
//   },
//   {
//     category: "Spirituality",
//   },
//   {
//     category: "Gratitude",
//   },
//   {
//     category: "Relationships",
//   },
//   {
//     category: "Health and Wellness",
//   },
//   {
//     category: "Inspiration and Motivation",
//   },
// ];

export default function Categories({ navigation, ...props }) {
  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {props.categories.map((item, index) => {
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
                <TouchableOpacity
                  onPress={() => {
                    if(props.nameOfParentScreen === "Articles") {
                      const selectedCategory = props.categories[index];
                      navigation.navigate('TopicsScreen', {selectedCategory})
                    } else if(props.nameOfParentScreen === "Meditations") {
                      console.log('pressed');
                      navigation.navigate('MeditationPlayerScreen')
                    }
                    
                  }
                  }
                >
                  <Text
                    style={{
                      fontFamily: "SoraRegular",
                      color: "white",
                      fontSize: 13,
                    }}
                  >
                    {item.category}
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


// ouchableOpacity
//                   onPress={() =>
//                     navigation.navigate("TopicsScreen", {
//                       name: restaurant.name,
//                       image: restaurant.image_url,
//                       price: restaurant.price,
//                       reviews: restaurant.review_count,
//                       rating: restaurant.rating,
//                       categories: restaurant.categories,
//                     })
//                   }