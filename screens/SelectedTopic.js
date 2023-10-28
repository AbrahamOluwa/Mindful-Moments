import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box, HStack, AspectRatio, Center, Stack, Heading } from "native-base";
import AntDesign from "@expo/vector-icons/AntDesign";
import { db } from "../firebaseConfig";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { FlatList } from "react-native";
import Swiper from "react-native-swiper";
import Card from "../components/home/Card";

const { width } = Dimensions.get("screen");

export default function SelectedTopic({ route, navigation }) {
  const [selectedTopicId, setSelectedTopicId] = useState(route.params);
  const [articleContents, setArticleContents] = useState({});
  const [loading, setLoading] = useState(true);

  // const fetchContents = async () => {
  //   const topicsCollection = collection(db, "article_topics");

  //   try {
  //     const topicDoc = doc(topicsCollection, selectedTopicId);
  //     const topicSnap = await getDoc(topicDoc);

  //     if (topicSnap.exists()) {
  //       const topicsCollection = collection(db, "article_contents");
  //       const queryForTopic = query(
  //         topicsCollection,
  //         where("topic_id", "==", topicDoc)
  //       );

  //       const querySnapshot = await getDocs(queryForTopic);
  //       const contentData = [];

  //       querySnapshot.forEach((doc) => {
  //         // Push each topic's data into the topicsData array
  //         contentData.push({ id: doc.id, ...doc.data() });
  //       });

  //       console.log(contentData);

  //       setArticleContents(contentData); // Set topics state variable
  //       //setLoading(false);
  //     } else {
  //       console.log("Topic document not found");
  //       //setLoading(false);
  //     }
  //   } catch (error) {
  //     console.log("Error getting contents for the articles:", error);
  //     //setLoading(false);
  //   }
  // };

  const fetchContents = async () => {
    const topicsCollection = collection(db, "article_topics");

    try {
      const topicDoc = doc(topicsCollection, selectedTopicId);
      const topicSnap = await getDoc(topicDoc);

      if (topicSnap.exists()) {
        const contentsCollection = collection(db, "article_contents");
        const queryForTopic = query(
          contentsCollection,
          where("topic_id", "==", topicDoc)
        );

        const querySnapshot = await getDocs(queryForTopic);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const contentData = { id: doc.id, ...doc.data() };

          // console.log("a", contentData);

          setArticleContents(contentData);
          setLoading(false);
        } else {
          console.log("No content found for the topic");
          setLoading(false);
        }
      } else {
        console.log("Topic document not found");
        setLoading(false);
      }
    } catch (error) {
      console.log("Error getting contents for the articles:", error);
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <ActivityIndicator size="large" color="purple" />
        </View>
      ) : (
        <ScrollView>
          <HStack space={15}>
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

          <View style={{ marginLeft: 20, marginTop: 10 }}>
            <View>
              <Text style={{ fontFamily: "SoraSemiBold", fontSize: 17 }}>
                Topic: {articleContents.title}
              </Text>
              <View>
                <Text style={styles.contentHeader}>Introduction: </Text>
                <Text style={styles.contentText}>
                  {articleContents.introduction}
                </Text>
              </View>
              <View>
                {articleContents.sections.map((section, sectionIndex) => {
                  const sectionNumber = sectionIndex + 1;
                  return (
                    <View key={sectionIndex}>
                      <Text style={styles.contentHeader}>
                        {`Section ${sectionNumber}: ${section.title}`}
                      </Text>
                      <Text style={styles.contentText}>{section.content}</Text>

                      {section.subSections.map(
                        (subsection, subSectionIndex) => {
                          const subSectionNumber = subSectionIndex + 1;
                          return (
                            <View key={subSectionIndex}>
                              <Text style={styles.contentSubHeader}>
                                {" "}
                                {`${sectionNumber}.${subSectionNumber} : ${subsection.title}`}
                              </Text>
                              <Text style={styles.contentText}>
                                {subsection.content}
                              </Text>
                            </View>
                          );
                        }
                      )}
                    </View>
                  );
                })}
              </View>

              <View>
                <Text style={styles.contentHeader}>
                  {articleContents.howToPractice.header}
                </Text>
                {articleContents.howToPractice.steps.map((practice, index) => {
                  return (
                    <View key={index}>
                      <Text style={styles.contentText}>{`${
                        index + 1
                      }. ${practice}`}</Text>
                    </View>
                  );
                })}
              </View>

              <View>
                <Text style={styles.contentHeader}>Exercises</Text>

                {articleContents.exercises.map((exercise, index) => {
                  return (
                    <View key={index}>
                      <Text style={styles.contentText}>{`${
                        index + 1
                      }. ${exercise}`}</Text>
                    </View>
                  );
                })}
              </View>

              <View>
                <Text style={styles.contentHeader}>Goal Ideas</Text>

                <Text style={styles.contentSubHeader}>
                  {articleContents.goalIdeas.content}
                </Text>
                {articleContents.goalIdeas.ideas.map((idea, index) => {
                  return (
                    <View key={index}>
                      <Text style={styles.contentText}>{`${
                        index + 1
                      }. ${idea}`}</Text>
                    </View>
                  );
                })}
              </View>

              <View>
                <Text style={styles.contentHeader}>Summary</Text>

                <Text style={styles.contentText}>{articleContents.summary}</Text>

              </View>


              <View>
                <Text style={styles.contentHeader}>Key Takeaways</Text>

                {articleContents.keyTakeaways.map((takeaway, index) => {
                  return (
                    <View key={index}>
                      <Text style={styles.contentText}>{`${
                        index + 1
                      }. ${takeaway}`}</Text>
                    </View>
                  );
                })}
              </View>

            </View>

          
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentHeader: {
    fontFamily: "SoraSemiBold",
    fontSize: 15,
    marginTop: 20,
  },

  contentSubHeader: {
    fontFamily: "SoraSemiBold",
    fontSize: 13,
    marginTop: 20,
  },

  contentText: {
    fontFamily: "SoraRegular",
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    maxWidth: "92%",
  },
});
