import { View, Text, ScrollView, TouchableOpacity } from "react-native";
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
import { collection, getDocs, limit, query, onSnapshot, orderBy } from "firebase/firestore";
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
  const [topics, setTopics] = useState([]);
  const [articleContent, setArticleContent] = useState([]);

  const navigation = useNavigation();
  // const [loading, setLoading] = useState(true);

  const getArticleCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "article_categories"));
      const cat = [];
      querySnapshot.forEach((doc) => {
        cat.push({id: doc.id, ...doc.data()});
      });
      setCategories(cat);
      // setLoading(false); // Set loading to false after fetching quotes
    } catch (error) {
      console.error(error);
      // setLoading(false); // Set loading to false after fetching quotes
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
        //console.log('hot', hotEntries)
        //setIsFetching(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error fetching hot articles:", error);
      //setIsFetching(false);
    }
  };

  const loadTopicContent = async (topicId) => {
    const snapshot = await db.collection('article_content')
      .where('topic_id', '==', `/article_topics/${topicId}`)
      .get();
  
    const content = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
  
    return content;
  };

  useEffect(() => {
    getArticleCategories();
    getHotArticles();
  }, []);

  return (
    <View>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {hotArticles.map((item, index) => {
              return <Pill key={index} data={item} index={index} />;
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
            onPress={() => navigation.navigate("UploadCourseScreen")}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontFamily: "SoraSemiBold",
              }}
            >
              Upload Course
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const Pill = (props) => {
  return (
    <Box
      key={props.index}
      alignItems="center"
      w="80%"
      maxW="250"
      style={{ marginLeft: -10, height: 300, paddingHorizontal: 14 }}
    >
      <Box
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
            <Text size="sm" ml="-1" style={{ fontFamily: "SoraMedium", fontSize: 13 }}>
              {props.data.title}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};
