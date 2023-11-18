import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
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
  getDocs,
  limit,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Categories from "../components/home/Categories";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const articles = [
  {
    id: 1,
    category: "Mindfulness",
    topics: [
      {
        title: "Introduction to Mindfulness",
        description: "Explaining what mindfulness is",
        image: ".....",
      },
      {
        title: "Mindful Breathing",
        description: "Exploring different breathing techniques",
        image: ".....",
      },
      {
        title: "Mindful Breathing",
        description: "Exploring different breathing techniques",
        image: ".....",
      },
      {
        title: "Mindful Breathing",
        description: "Exploring different breathing techniques",
        image: ".....",
      },
      {
        title: "Mindful Breathing",
        description: "Exploring different breathing techniques",
        image: ".....",
      },
    ],
  },
  {
    id: 2,
    category: "Personal Growth",
    topics: [
      {
        title: "Building Self-Confidence",
        description: "Boost self-confidence",
        image: "...",
      },
      {
        title: "Building Self-Confidence",
        description: "Boost self-confidence",
        image: "...",
      },
      {
        title: "Building Self-Confidence",
        description: "Boost self-confidence",
        image: "...",
      },
      {
        title: "Building Self-Confidence",
        description: "Boost self-confidence",
        image: "...",
      },
      {
        title: "Building Self-Confidence",
        description: "Boost self-confidence",
        image: "...",
      },
    ],
  },
  {
    category: "Emotional Well-Being",
  },
  {
    category: "Spirituality",
  },
  {
    category: "Gratitude",
  },
  {
    category: "Relationships",
  },
  {
    category: "Health and Wellness",
  },
  {
    category: "Inspiration and Motivation",
  },
];

const nameOfParentScreen = "Articles";

const hotTopicsItems = [
  {
    title: "Building Self-Confidence",
    // image: require("../../assets/images/completed_1.jpg"),
  },
  {
    title: "Developing Resilience and Bouncing Back",
    // image: require("../../assets/images/completed_1.jpg"),
  },
  {
    title: "Developing Emotional Intelligence",
    // image: require("../../assets/images/completed_1.jpg"),
  },
];

export default function Articles() {
  const [categories, setCategories] = useState([]);
  const [hotArticles, setHotArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingCategory, setIsLoadingCategory] = useState(true);

  const navigation = useNavigation();
  // const [loading, setLoading] = useState(true);

  const getArticleCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "article_categories"));
      const cat = [];
      querySnapshot.forEach((doc) => {
        cat.push({ id: doc.id, ...doc.data() });
      });
      setCategories(cat);
      setIsLoadingCategory(false);
    } catch (error) {
      console.error(error);
      setIsLoadingCategory(false);
    }
  };

  const getHotArticles = async () => {
    try {
      const entryRef = collection(db, "article_topics");

      const a = query(entryRef, orderBy("createdAt", "desc"), limit(5));

      const unsubscribe = onSnapshot(a, (querySnapshot) => {
        const hotEntries = [];
        querySnapshot.forEach((doc) => {
          hotEntries.push({ id: doc.id, ...doc.data() });
        });

        setHotArticles(hotEntries);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error fetching hot articles:", error);
      setLoading(false);
    }
  };

  // const get = async () => {
  //   try {
  //     const [hotArticlesQuery, categoriesQuery] = await Promise.all([
  //       getDocs(collection(db, "article_topics")),
  //       getDocs(collection(db, "article_categories")),
  //     ]);

  //     const articles = [];
  //     hotArticlesQuery.forEach((doc) => {
  //       const articlesData = doc.data();
  //       const categoryReference = articlesData.category;
  //       const categoryId = categoryReference.id;
  //       // console.log("Meditation ID:", doc.id);
  //       // console.log("Category ID:", categoryId);

  //       const category = categoriesQuery.docs.find(
  //         (categoryDoc) => categoryDoc.id === categoryId
  //       );

  //       const categoryData = category ? category.data() : null;

  //       articles.push({
  //         id: doc.id,
  //         ...articlesData,
  //         category: categoryData, // Add the category data to each meditation
  //       });
  //     });

  //     setHotArticles(articles);
  //     setLoading(false);
  //     return meditations;
  //   } catch (error) {
  //     console.error("Error fetching meditations:", error);
  //     setLoading(false);
  //     return [];
  //   }
  // };

  useEffect(() => {
    getArticleCategories();
    getHotArticles();
  }, []);

  return (
    <View>
      {isLoadingCategory && loading ? (
        // Show the loader component while loading is true
        <ActivityIndicator size="large" color="purple" />
      ) : (
        <ScrollView>
          <Text
            style={{
              fontFamily: "SoraSemiBold",
              marginLeft: 10,
              fontSize: 25,
              // fontWeight: 'bold'
            }}
          >
            Search By Categories
          </Text>

          <Categories
            categories={categories}
            navigation={navigation}
            nameOfParentScreen={nameOfParentScreen}
          />

          <View style={{ flex: 1, marginTop: 20 }}>
            <HStack space={1}>
              <Text
                style={{
                  fontFamily: "SoraSemiBold",
                  marginLeft: 10,
                  fontSize: 20,
                }}
              >
                Hot
              </Text>

              <MaterialIcons
                name="local-fire-department"
                size={24}
                color="#e25822"
                style={{
                  marginTop: 4,
                }}
              />
            </HStack>
          </View>

          <View style={{ flex: 1, marginTop: 20 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 10, // Add horizontal padding to the content
                flexDirection: "row", // Make the ScrollView scroll horizontally
              }}
            >
              {hotArticles.map((item, index) => {
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
          {/* <View style={{ marginTop: -55 }}>
          <HStack space={1}>
            <Text
              style={{
                fontFamily: "SoraSemiBold",
                marginLeft: 10,
                fontSize: 20,
              }}
            >
              Trending
            </Text>

            <MaterialIcons
              name="local-fire-department"
              size={24}
              color="#e25822"
              style={{
                marginTop: 4,
              }}
            />
          </HStack>
        </View> */}

          {/* <View style={{ flex: 1, marginTop: 20 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {hotTopicsItems.map((item, index) => {
              return <Pill key={index} data={item} index={index} />;
            })}
          </ScrollView>
        </View> */}

          <View style={{ flex: 1, marginTop: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#613F75",
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("UploadArticlesScreen")}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontFamily: "SoraSemiBold",
                }}
              >
                Upload Article Content
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const Pill = (props) => {
  return (
    <TouchableOpacity
      onPress={() =>
        props.navigation.navigate("SelectedTopicScreen", props.data.id)
      }
    >
      <Box
        key={props.index}
        width="90%" // Limit the width to 90% of the parent container
        maxWidth={300} // Set a maximum width to avoid covering the whole screen
        height={280} // Set a fixed height for all pills
        borderWidth={3}
        borderColor="gray.200"
        borderRadius={10}
        overflow="hidden"
        marginLeft={props.data.index === 0 ? 10 : 0}// Adjust the horizontal spacing between pills
      >
        <Box>
          <AspectRatio ratio={16 / 9}>
            <Image
              source={{
                uri: props.data.imageUrl,
              }}
              alt="image"
            />
          </AspectRatio>
        </Box>
        <Stack p={4} space={3}>
          <Text
            noOfLines={2} // Limit the title to 2 lines
            style={{ fontFamily: "SoraMedium", fontSize: 13 }}
          >
            {props.data.title}
          </Text>
        </Stack>
      </Box>
    </TouchableOpacity>
  );
};
