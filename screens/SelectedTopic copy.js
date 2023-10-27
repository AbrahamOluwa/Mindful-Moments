import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Pressable
} from "react-native";
import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box, HStack, AspectRatio, Center, Stack, Heading } from "native-base";
import AntDesign from "@expo/vector-icons/AntDesign";
import Swiper from "react-native-swiper";
import Card from "../components/home/Card";

const { width } = Dimensions.get("screen");

export default function SelectedTopic({ navigation }) {
 
  const renderCards = () => {
    const cards = [];
    for (let i = 0; i <= 10; i++) {
      cards.push(
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>Card {i}</Text>
        </View>
      );
    }
    return cards;
  };

  const data = [
    { id: "1", title: "Unconditional Self-Acceptance" },
    { id: "2", title: "Identifying Your Strengths" },
    { id: "3", title: "Self-Compassion" },
    { id: "4", title: "Challenging Negative Self-Talk" },
    { id: "5", title: "Setting Healthy Boundaries" },
    { id: "6", title: "Setting Healthy Boundaries" },
    // Add more cards as needed
  ];


  const [focusedCardIndex, setFocusedCardIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const screenWidth = layoutMeasurement.width;
    const focusedIndex = Math.round(contentOffset.x / screenWidth);
    setFocusedCardIndex(focusedIndex);
  };

  const scrollToCard = (index) => {
    const screenWidth = Dimensions.get("window").width;
    scrollViewRef.current.scrollTo({ x: index * screenWidth, animated: true });
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <ImageBackground
          source={require("../assets/images/g3.png")}
          style={{
            //width: "100%",
            height: 200,
          }}
          resizeMode="contain"
        >
          <HStack space={15} p={2}>
            <Stack>
              <TouchableOpacity
                onPress={() => navigation.navigate("HomeScreen")}
              >
                <AntDesign
                  name="arrowleft"
                  size={30}
                  color="black"
                  // style={{ marginTop: 0 }}
                />
              </TouchableOpacity>
            </Stack>

            {/* <Stack>
              <Text style={{ fontFamily: "SoraSemiBold", fontSize: 20 }}>
                Title of the Topic
              </Text>
            </Stack> */}
          </HStack>
        </ImageBackground>

        <View style={{ marginLeft: 20, marginTop: 30 }}>
          <View>
            <Text style={{ fontFamily: "SoraSemiBold", fontSize: 20 }}>
              Title of the Topic
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

          <View>
            <Text
              style={{
                fontFamily: "SoraSemiBold",
                fontSize: 18,
                marginTop: 20,
              }}
            >
              Sub Topics:{" "}
            </Text>
       

            <View style={styles.container}>
              <ScrollView
                horizontal
                ref={scrollViewRef}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                <View style={styles.slide}>
                  {data.map((card, index) => (
                    <Pressable key={index} onPress={() => {
                      navigation.navigate("SelectedSubtopicScreen")
                    }}>
                    <View
                      
                      style={[
                        styles.card,
                        focusedCardIndex === index && styles.focusedCard,
                      ]}
                    >
                      <Text style={styles.cardTitle}>{card.title}</Text>
                    </View>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>

              <View style={styles.paginationContainer}>
                {data.map((card, index) => (
                  <View
                    key={card.id}
                    style={[
                      styles.paginationDot,
                      focusedCardIndex === index && styles.activeDot,
                    ]}
                    onTouchEnd={() => scrollToCard(index)}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={{marginTop: 30}}>
           
            <Text
              style={{
                fontFamily: "SoraSemiBold",
                fontSize: 18,
                marginTop: 20,
              }}
            >
              Key Takeaways:{" "}
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

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   //   backgroundColor: 'lightgray',
  //   // width: width,
  //   width: 250, // Adjust the width to reduce or increase the size
  //   height: 150,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  // swiperContainer: {
  //   height: 250,
  //   marginBottom: 16,
  // },
  // swiperDot: {
  //   backgroundColor: "rgba(0, 0, 0, 0.2)",
  //   width: 8,
  //   height: 8,
  //   borderRadius: 4,
  //   marginLeft: 3,
  //   marginRight: 3,
  //   marginTop: 3,
  //   marginBottom: 3,
  // },
  // swiperActiveDot: {
  //   backgroundColor: "#000",
  //   width: 12,
  //   height: 12,
  //   borderRadius: 6,
  //   marginLeft: 3,
  //   marginRight: 3,
  //   marginTop: 3,
  //   marginBottom: 3,
  // },

  // container: {
  //   flex: 1,
  // },
  // swiperContainer: {
  //   flex: 1,
  // },
  // slide: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "flex-start",
  //   paddingHorizontal: 100,
  // },
  // card: {
  //   backgroundColor: "red",
  //   borderRadius: 8,
  //   padding: 16,
  //   marginHorizontal: 8,
  //   width: 150,
  //   height: 110,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // cardTitle: {
  //   fontSize: 16,
  //   fontWeight: "bold",
  //   color: "#fff",
  // },

  container: {
    flex: 1,
    marginTop: 8,
  },
  slide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    // paddingHorizontal: 16,
    paddingHorizontal: 2,
  },
  card: {
    backgroundColor: "red",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 3,
    marginBottom: 8,
    width: Dimensions.get("window").width - 32,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  focusedCard: {
    backgroundColor: "blue",
    borderWidth: 2,
    borderColor: "white",
    height: 100,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "SoraRegular",
    color: "#fff",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "gray",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "blue",
  },
});
