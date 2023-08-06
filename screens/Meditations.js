import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Categories from "../components/home/Categories";
import { HStack, VStack, Stack } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const meditations = [
  {
    id: 1,
    category: "Stress Reduction",
  },
  {
    id: 2,
    category: "Relaxation",
  },
  {
    category: "Focus and Concentration",
  },
  {
    category: "Mindfulness",
  },
  {
    category: "Sleep and Rest",
  },
];
const nameOfParentScreen = "Meditations";
export default function Meditations() {
  // const [categories, setCategories] = useState(articles);
  const navigation = useNavigation();
  const [meditationData, setMeditationData] = useState([]);
  const [meditations, setMeditations] = useState([]);

  const getAllMeditations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "meditations"));
      const meditations = [];
      querySnapshot.forEach((doc) => {
        meditations.push({ id: doc.id, ...doc.data() });
      });
      setMeditationData(meditations);
      console.log(meditations);
      return meditations;
    } catch (error) {
      console.error("Error fetching meditations:", error);
      return [];
    }
  };

  useEffect(() => {
    getAllMeditations();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <ImageBackground
          source={require("../assets/images/meditation_2.png")}
          style={{
            height: 60,
          }}
          resizeMode="contain"
        />

        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontFamily: "SoraSemiBold", fontSize: 28 }}>
            Meditations
          </Text>
        </View>

        <View style={{ flex: 1, marginTop: 30 }}>
          <HStack space={1}>
            <Text
              style={{
                fontFamily: "SoraSemiBold",
                marginLeft: 10,
                fontSize: 22,
              }}
            >
              Explore Topics
            </Text>

            <MaterialIcons
              name="explore"
              size={27}
              color="black"
              style={{
                marginTop: 7,
              }}
            />
          </HStack>
        </View>

        <Categories
          categories={meditations}
          navigation={navigation}
          nameOfParentScreen={nameOfParentScreen}
        />

        <View style={{ marginTop: 10 }}>
          {meditationData.map((m) => {
            <TouchableOpacity
              key={m.id}
              onPress={() => {
                navigation.navigate("MeditationPlayerScreen");
              }}
            >
              <Card />
            </TouchableOpacity>;
          })}

{/*         
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MeditationPlayerScreen");
            }}
          >
            <Card />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MeditationPlayerScreen");
            }}
          >
            <Card />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MeditationPlayerScreen");
            }}
          >
            <Card />
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Card = () => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          backgroundColor: "#EFB9CB",
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 16,
          marginRight: 12,
          width: "90%",
        }}
      >
        <VStack>
          <Stack
            style={{
              backgroundColor: "#FBF2FD",
              borderRadius: 8,
              width: 80,
              padding: 5,
            }}
          >
            <Text
              style={{
                color: "#E3C2EF",
                fontSize: 12,
                fontFamily: "SoraLight",
              }}
            >
              12 minutes
            </Text>
          </Stack>

          <HStack space={2}>
            <Stack style={{ width: "70%" }}>
              <Text style={{ fontFamily: "SoraSemiBold", color: "black" }}>
                Breather
              </Text>
              <Text
                style={{
                  fontFamily: "SoraRegular",
                  fontSize: 13,
                  color: "black",
                }}
              >
                A 5 minutes intro to meditate. Relax and inhale to Start.
              </Text>
            </Stack>

            <Stack style={{ width: "30%", marginTop: -20 }}>
              <Image
                source={require("../assets/images/meditation.png")}
                style={{
                  width: "80%",
                  height: 80,
                }}
                //resizeMode="contain"
              />
            </Stack>
          </HStack>
        </VStack>
      </View>
    </View>
  );
};
