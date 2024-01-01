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
  Share,
  Button
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

  const removeHtmlTags = (htmlString) => {
    return htmlString.replace(/\\n/g, "\n");
  };
  
  const boldenTextBeforeColon = (text) => {
    const parts = text.split(":");
    if (parts.length === 2) {
      return (
        <Text>
          <Text style={{ fontFamily: "SoraSemiBold" }}>{parts[0]}:</Text>
          {parts[1]}
        </Text>
      );
    } else {
      return text; // If there's no colon, return the original text
    }
  };

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
      console.log("Error getting contents for the articles:", error.message);
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const shareArticle = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log('shared with activity type of: ', result.activityType)
        } else {
          // shared
          console.log('shared')
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
                      {section.content && (
                        <Text style={styles.contentText}>
                          {section.content}
                        </Text>
                      )}

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
                                {removeHtmlTags(subsection.content)}
                              </Text>

                              {subsection.examples &&
                                subsection.examples.map((example, index) => (
                                  <View key={index}>
                                    <Text style={styles.contentSubHeader}>
                                      {example.title}
                                    </Text>
                                    <Text style={styles.contentText}>
                                      {example.content}
                                    </Text>
                                   

                                    {example.steps &&
                                      example.steps.map((step, index) => (
                                        <View key={index}>
                                          <Text style={styles.contentText}>{boldenTextBeforeColon(step)}</Text>
                                        </View>
                                      ))}
                                  </View>
                                ))}
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
                {articleContents.howToPractice.content && (
                  <Text style={styles.contentText}>
                    {articleContents.howToPractice.content}
                  </Text>
                )}

                {articleContents.howToPractice.steps.map((practice, index) => {
                  return (
                    <View key={index}>
                      <Text style={styles.contentText}>
                        {index + 1}. {boldenTextBeforeColon(practice)}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View>
                <Text style={styles.contentHeader}>Quotes and Insights</Text>
                <Text style={styles.contentText}>{articleContents.quotesAndInsights}</Text>
              </View>

              <View>
                <Text style={styles.contentHeader}>Exercises</Text>

                {articleContents.exercises.map((exercise, index) => {
                  return (
                    <View key={index}>
                      <Text style={styles.contentText}>
                        {index + 1}. {boldenTextBeforeColon(exercise)}
                      </Text>
                      {/* <Text style={styles.contentText}>{`${
                        index + 1
                      }. ${exercise}`}</Text> */}
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
                      <Text style={styles.contentText}>
                        {index + 1}. {boldenTextBeforeColon(idea)}
                      </Text>
                      {/* <Text style={styles.contentText}>{`${
                        index + 1
                      }. ${idea}`}</Text> */}
                    </View>
                  );
                })}
              </View>

              <View>
                <Text style={styles.contentHeader}>Summary</Text>

                <Text style={styles.contentText}>
                  {articleContents.summary}
                </Text>
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

          {/* <Button title="Share Article" onPress={shareArticle} /> */}
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
