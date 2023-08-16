import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  HStack,
  Stack,
  Icon,
  Center,
  VStack,
  Input,
  Fab,
  Box,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce } from "lodash";

const removeHtmlTags = (htmlString) => {
  return htmlString.replace(/<\/?div>/g, "").replace(/&nbsp;/g, "").replace(/<br>/g, "")
};

const formatDate = (timestamp) => {
  const date = timestamp.toDate();
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const MAX_CONTENT_LENGTH = 100; // Maximum number of characters to display

// Truncate the journal content and add ellipsis if needed
const truncateContent = (content) => {
  if (content.length <= MAX_CONTENT_LENGTH) {
    return content;
  } else {
    return content.substring(0, MAX_CONTENT_LENGTH) + "...";
  }
};

export default function AllGratitudeMoments({ navigation }) {
  const [gratitudeMoments, setGratitudeMoments] = useState([]);
  const auth = getAuth();
  const [isFetching, setIsFetching] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredMoments, setFilteredMoments] = useState([]);

  const getUserId = async () => {
    const storedUserId = await AsyncStorage.getItem("nonRegisteredUserId");
    if (storedUserId) {
      console.log(
        "Retrieved non-registered userId from AsyncStorage:",
        storedUserId
      );
      return storedUserId;
    } else {
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            resolve(user.uid);
          } else {
            reject(new Error("User is not signed in."));
          }
          unsubscribe();
        });
      });
    }
  };

  const fetchGratitudeMoments = async () => {
    try {
      const userId = await getUserId();
      const gratitudeMomentsRef = collection(
        db,
        "nonRegisteredUsers",
        userId,
        "gratitude_moments"
      );
      const q = query(gratitudeMomentsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const entries = [];
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() });
      });
      setGratitudeMoments(entries);
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      setIsFetching(false);
    }
  };

  const filterMoments = (searchText) => {
    const filteredMoments = gratitudeMoments.filter((moment) => {
      // Assuming you have a "title" field in your journal entry
      return moment.title.toLowerCase().includes(searchText.toLowerCase());
    });
    setFilteredMoments(filteredMoments);
  };

  const debouncedFilter = debounce(filterMoments, 300);

  useEffect(() => {
    fetchGratitudeMoments();
    filterMoments(searchText);
  }, [searchText]);

  const navigateToEditGratitudeMoment = (entryId, title, moment) => {
    navigation.navigate("EditGratitudeMomentScreen", { entryId, title, moment });
  };

  const handleFabPress = () => {
    navigation.navigate("RecordGratitudeMomentScreen");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isFetching ? (
        // Show the loader component while loading is true
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#EF798A" />
        </View>
      ) : (
        <ScrollView>
          <View style={{ marginTop: 15 }}>
            <HStack space={3} p={2}>
              <Stack>
                <TouchableOpacity
                  onPress={() => navigation.navigate("HomeScreen")}
                >
                  <AntDesign
                    name="arrowleft"
                    size={30}
                    color="black"
                    style={{ marginTop: 5 }}
                  />
                </TouchableOpacity>
              </Stack>

              <Stack style={{ alignItems: "center", justifyContent: "center" }}>
                <Text
                  style={{
                    fontFamily: "SoraSemiBold",
                    fontSize: 24,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  All Gratitude Moments
                </Text>
              </Stack>
            </HStack>

            <Center flex={1} px="6" mt="2">
              <VStack w="100%" space={5} alignSelf="center">
                <Input
                  placeholder="Search Moments"
                  style={{ fontFamily: "SoraRegular" }}
                  width="100%"
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
              </VStack>
            </Center>

            <View>
              {searchText === ""
                ? // If there's no search text, show all journals
                  gratitudeMoments.map((entry) => (
                    <TouchableOpacity
                      key={entry.id}
                      onPress={() =>
                        navigateToEditGratitudeMoment(
                          entry.id,
                          entry.title,
                          entry.moment
                        )
                      }
                    >
                      <MomentCard
                        title={entry.title}
                        moment={entry.moment}
                        createdAt={entry.createdAt}
                      />
                    </TouchableOpacity>
                  ))
                : // If there's search text, show the filtered journals
                  filteredMoments.map((entry) => (
                    <TouchableOpacity
                      key={entry.id}
                      onPress={() =>
                        navigateToEditGratitudeMoment(
                          entry.id,
                          entry.title,
                          entry.moment
                        )
                      }
                    >
                      <MomentCard
                        title={entry.title}
                        moment={entry.moment}
                        createdAt={entry.createdAt}
                      />
                    </TouchableOpacity>
                  ))}
            </View>
          </View>
        </ScrollView>
      )}

      <Center>
        <Fab
          renderInPortal={false}
          shadow={2}
          size="sm"
          style={{ backgroundColor: "#613F75" }}
          icon={<Icon color="white" as={AntDesign} name="plus" size="lg" />}
          onPress={handleFabPress}
        />
      </Center>
    </SafeAreaView>
  );
}

const MomentCard = (props) => {
  return (
    <View
      style={{
        marginLeft: 10,
        marginTop: 30,
      }}
    >
      <View
        style={{
          backgroundColor: "#FBF2FD",
          borderRadius: 8,
          width: "35%",
          padding: 7,
          justifyContent: "flex-start",
          marginLeft: 12,
        }}
      >
        <HStack>
          <Stack>
            <AntDesign name="calendar" size={18} color="black" />
          </Stack>

          <Stack>
            <Text style={{ fontFamily: "SoraRegular", fontSize: 12 }}>
              {formatDate(props.createdAt)}
            </Text>
          </Stack>
        </HStack>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#EECFD4",
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 16,
            marginRight: 12,
            width: "90%",
            marginTop: 10,
          }}
        >
          <Text style={{ fontFamily: "SoraSemiBold", fontSize: 15 }}>
            {removeHtmlTags(props.title)}
          </Text>
          <Text style={{ fontFamily: "SoraRegular", fontSize: 12 }}>
            {truncateContent(removeHtmlTags(props.moment))}
          </Text>
        </View>
      </View>
    </View>
  );
};
