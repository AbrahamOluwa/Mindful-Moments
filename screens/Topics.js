import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Box,
  HStack,
  AspectRatio,
  Image,
  Center,
  Stack,
  Heading,
} from "native-base";
import { db } from "../firebaseConfig";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";

export default function Topics({ route, navigation }) {
  const { selectedCategory } = route.params;
  const [topics, setTopics] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    selectedCategory.id
  );
  const [loading, setLoading] = useState(true);

  const getTopicsForCategory = async (categoryId) => {
    // Reference to the 'article_categories' collection
    const categoriesCollection = collection(db, "article_categories");

    try {
      // Create a reference to the specific category document
      const categoryDoc = doc(categoriesCollection, categoryId);

      const categorySnap = await getDoc(categoryDoc);

      if (categorySnap.exists()) {
        // Reference to the 'article_topics' collection
        const topicsCollection = collection(db, "article_topics");

        // Create a query to filter topics based on the category reference
        const queryForCategory = query(
          topicsCollection,
          where("category_id", "==", categoryDoc)
        );

        // Execute the query to get topics related to the specified category
        const querySnapshot = await getDocs(queryForCategory);

        const topics = querySnapshot.docs.map((doc) => doc.data());
        console.log("real_topics", topics);
        return topics;
      } else {
        console.log("Category document not found");
        return [];
      }
    } catch (error) {
      console.error("Error getting category or topics:", error);
      return [];
    }
  };

  const fetchTopics = async () => {
    const categoriesCollection = collection(db, "article_categories");

    try {
      const categoryDoc = doc(categoriesCollection, selectedCategoryId);
      const categorySnap = await getDoc(categoryDoc);

      if (categorySnap.exists()) {
        const topicsCollection = collection(db, "article_topics");
        const queryForCategory = query(
          topicsCollection,
          where("category_id", "==", categoryDoc)
        );

        const querySnapshot = await getDocs(queryForCategory);
        const topicsData = [];

        querySnapshot.forEach((doc) => {
          // Push each topic's data into the topicsData array
          topicsData.push({ id: doc.id, ...doc.data() });
        });

        setTopics(topicsData); // Set topics state variable
        setLoading(false);
      } else {
        console.log("Category document not found");
        setLoading(false);
      }
    } catch (error) {
      console.log("Error getting category or topics:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    //const categoryId = selectedCategory.id; // Replace with the actual category ID
    // getTopicsForCategory(categoryId).then((topics) => {
    //   console.log("Topics related to the category:", topics);
    // });

    fetchTopics();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <ActivityIndicator size="large" color="purple" />
        </View>
      ) : (
        <View style={{marginTop: 0}}>
          <HStack space={15} pl={2}>
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

            <Stack>
              <Text style={{ fontFamily: "SoraSemiBold", fontSize: 20 }}>
                {selectedCategory.name}
              </Text>
            </Stack>
          </HStack>

          <ScrollView>
            {topics.map((item, index) => {
              return (
                <Pill
                  key={index}
                  data={item}
                  index={index}
                  navigation={navigation}
                />
              );
            })}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const Pill = (props) => {
  return (
    <TouchableOpacity
      onPress={() => props.navigation.navigate("SelectedTopicScreen", props.data.id)}
    >
      <Box
        key={props.index}
        alignItems="center"
        style={{ paddingVertical: 15 }}
      >
        <Box
          w="80%"
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
          <Box>
            <AspectRatio w="100%" ratio={16 / 9}>
              <Image
                source={{
                  uri: props.data.imageUrl,
                }}
                alt="image"
              />
            </AspectRatio>
          </Box>
          <Stack p="4" space={3}>
            <Stack space={2}>
              <Text
                size="md"
                ml="-1"
                style={{ fontFamily: "SoraMedium", fontSize: 14 }}
              >
                {props.data.title}
              </Text>

              <Text
                style={{
                  fontFamily: "SoraRegular",
                  fontSize: 12,
                  color: "gray",
                }}
              >
                {props.data.description}
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};
