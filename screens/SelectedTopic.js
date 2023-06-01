import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  ImageBackground,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box, HStack, AspectRatio, Center, Stack, Heading } from "native-base";
import AntDesign from "@expo/vector-icons/AntDesign";
import Swiper from "react-native-swiper";
import Card from "../components/home/Card";

export default function SelectedTopic({ navigation }) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleIndexChanged = (index) => {
    setFocusedIndex(index);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>
        <ImageBackground
          source={require("../assets/images/g3.jpg")}
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
              <Swiper
                loop={false}
                showsPagination={false}
                style={styles.swiperContainer}
                dotStyle={styles.swiperDot}
                activeDotStyle={styles.swiperActiveDot}
                onIndexChanged={handleIndexChanged}
                spaceBetween={-30}
              >
                <View>
                  <Card title="Card 1" isFocused={focusedIndex === 0} />
                </View>
                <View>
                  <Card title="Card 2" isFocused={focusedIndex === 1} />
                </View>
                <View>
                  <Card title="Card 3" isFocused={focusedIndex === 2} />
                </View>

                {/* <Card title="Card 2" isFocused={focusedIndex === 1} />
                <Card title="Card 3" isFocused={focusedIndex === 2} /> */}
              </Swiper>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      //   backgroundColor: 'lightgray',
      alignItems: 'center',
      justifyContent: 'center',
    },
    swiperContainer: {
      height: 250,
      marginBottom: 16,
    },
    swiperDot: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3,
    },
    swiperActiveDot: {
      backgroundColor: '#000',
      width: 12,
      height: 12,
      borderRadius: 6,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3,
    },
  });
