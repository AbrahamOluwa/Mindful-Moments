import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Categories from "../components/home/Categories";
import { HStack, VStack, Stack, Center, Input, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, getDoc } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import { debounce } from "lodash";

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
  const [isFetching, setIsFetching] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredMeditations, setFilteredMeditations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const getAllMeditations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "meditations"));
      const meditations = [];
      querySnapshot.forEach((doc) => {
        meditations.push({ id: doc.id, ...doc.data() });
      });
      setMeditationData(meditations);
      setIsFetching(false);
      return meditations;
    } catch (error) {
      console.error("Error fetching meditations:", error);
      setIsFetching(false);
      return [];
    }
  };

  const navigateToMeditationPlayer = (
    medidationId,
    title,
    description,
    audioURL
  ) => {
    navigation.navigate("MeditationPlayerScreen", {
      medidationId,
      title,
      description,
      audioURL,
    });
  };

  const filterMeditations = (searchText) => {
    const filteredMeditations = meditationData.filter((meditation) => {
      return meditation.title.toLowerCase().includes(searchText.toLowerCase());
    });
    setFilteredMeditations(filteredMeditations);
  };

  const debouncedFilter = debounce(filterMeditations, 300);

  // const filterMeditations = (searchText, selectedCategory) => {
  //   const filteredMeditations = meditationData.filter((meditation) => {
  //     const titleMatches = meditation.title.toLowerCase().includes(searchText.toLowerCase());

  //     if (selectedCategory === "All") {
  //       return titleMatches;
  //     } else {
  //       const categoryMatches = meditation.category && meditation.category.name.toLowerCase() === selectedCategory.toLowerCase();
  //       return titleMatches && categoryMatches;
  //     }
  //   });
  //   setFilteredMeditations(filteredMeditations);
  // };

  useEffect(() => {
    getAllMeditations();
    filterMeditations(searchText);
    //console.log("Meditation Data", meditationData);
  }, [searchText, selectedCategory]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isFetching ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#EF798A" />
        </View>
      ) : (
        <View>
          <ImageBackground
            source={require("../assets/images/meditation_2.png")}
            style={{
              height: 60,
            }}
            resizeMode="contain"
          />

          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontFamily: "SoraSemiBold", fontSize: 28 }}>
              Meditations
            </Text>
          </View>
          <ScrollView>
            <View style={{ marginTop: 30 }}>
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

            <View>
              <Center px="4" mt="2">
                <VStack w="100%" space={5} alignSelf="center">
                  <Input
                    placeholder="Search Meditations"
                    style={{ fontFamily: "SoraRegular" }}
                    width="97%"
                    borderRadius="4"
                    py="3"
                    px="1"
                    fontSize="14"
                    value={searchText}
                    onChangeText={setSearchText}
                    InputLeftElement={
                      <Icon
                        m="2"
                        ml="3"
                        size="6"
                        color="gray.400"
                        as={<MaterialIcons name="search" />}
                      />
                    }
                  />
                  {/* <Picker
                  selectedValue={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value)}
                  style={{
                    width: "100%",
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: "gray.400",
                    py: 3,
                    px: 1,
                  }}
                >
                  <Picker.Item label="All Categories" value="All" />
                  <Picker.Item label="Relaxation" value="Relaxation" />
                </Picker> */}
                </VStack>
              </Center>
            </View>

            {/* <Categories
            categories={meditations}
            navigation={navigation}
            nameOfParentScreen={nameOfParentScreen}
          /> */}

            <View style={{ marginTop: 4, marginBottom: 200 }}>
              {searchText === ""
                ? meditationData.map((m, index) => {
                    return (
                      <TouchableOpacity
                        key={m.id}
                        onPress={() =>
                          navigateToMeditationPlayer(
                            m.id,
                            m.title,
                            m.description,
                            m.audioURL
                          )
                        }
                      >
                        <Card
                          title={m.title}
                          description={m.description}
                          duration={m.duration}
                        />
                      </TouchableOpacity>
                    );
                  })
                : filteredMeditations.map((m) => (
                    <TouchableOpacity
                      key={m.id}
                      onPress={() =>
                        navigateToMeditationPlayer(
                          m.id,
                          m.title,
                          m.description,
                          m.audioURL
                        )
                      }
                    >
                      <Card
                        title={m.title}
                        description={m.description}
                        duration={m.duration}
                      />
                    </TouchableOpacity>
                  ))}
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const Card = (props) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 18,
      }}
    >
      <View
        style={{
          backgroundColor: "#EFB9CB",
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 16,
          marginRight: 12,
        }}
      >
        <VStack>
          <Stack
            style={{
              backgroundColor: "#613F75",
              borderRadius: 8,
              width: 80,
              padding: 5,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 12,
                fontFamily: "SoraLight",
              }}
            >
              {props.duration}
            </Text>
          </Stack>

          <HStack space={2}>
            <Stack style={{ width: "70%" }}>
              <Text style={{ fontFamily: "SoraSemiBold", color: "black" }}>
                {props.title}
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
