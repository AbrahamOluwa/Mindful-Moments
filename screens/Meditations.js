import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Categories from "../components/home/Categories";
import { HStack, VStack, Stack } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"

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
const nameOfParentScreen = 'Meditations';
export default function Meditations() {
  // const [categories, setCategories] = useState(articles);
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff' }}>
      <ScrollView>
        <ImageBackground
          source={require("../assets/images/meditation_2.jpg")}
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

        <Categories categories={meditations} navigation={navigation} nameOfParentScreen={nameOfParentScreen} />

        <View style={{ marginTop: 30 }}>
          <Card />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Card = () => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          backgroundColor: "#1868ae",
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
            <Stack style={{width: "70%"}}>
              <Text style={{fontFamily: "SoraSemiBold", color: 'white'}}>Breather</Text>
              <Text style={{fontFamily: "SoraRegular", fontSize: 13,  color: 'white'}}>
                A 5 minutes intro to meditate. Relax and inhale to Start.
              </Text>
            </Stack>

            <Stack style={{width: "30%", marginTop: -20}}>
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
