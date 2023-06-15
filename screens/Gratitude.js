import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    StyleSheet,
    ScrollView,
    Dimensions,
    ImageBackground,
  } from "react-native";
  import React from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { HStack, Stack, Button, Icon } from "native-base";
  import { AntDesign } from "@expo/vector-icons";
  import { FontAwesome } from "@expo/vector-icons";

export default function Gratitude({navigation}) {
    const { width } = Dimensions.get("screen");

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View>

      <ImageBackground
        source={require("../assets/images/gratitude_1.png")}
        style={{
          width: width,
          height: 500,
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
              />
            </TouchableOpacity>
          </Stack>
        </HStack>
      </ImageBackground>


      <View
        style={{
          marginTop: -30,
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "SoraSemiBold",
        }}
      >
        <Text style={styles.header}>Gratitude Moments</Text>
        <Text style={styles.description}>Oops... No entries yet!</Text>
        <Text style={styles.description}>Tap to Start Writing</Text>
      </View>

      <View style={{alignItems: "center", justifyContent: "center", marginTop: 50 }}>
        <Button
          leftIcon={<Icon as={FontAwesome} name="plus" size="sm" />}
          style={{ backgroundColor: "#EF798A", borderRadius: 22 }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("RecordGratitudeMomentScreen")}
          >
            <Text
              style={{
                fontFamily: "SoraMedium",
                color: "#fff",
                fontSize: 13,
              }}
            >
              Add new
            </Text>
          </TouchableOpacity>
        </Button>
      </View>
    </View>
  </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    header: {
        fontFamily: "SoraSemiBold",
        fontSize: 28,
        marginBottom: 15
    },
    
    description: {
      fontFamily: "SoraSemiBold",
      color: "gray",
      fontSize: 15,
    },
  });
  