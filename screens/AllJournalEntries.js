import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack, Stack } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThoughtCard from "../components/thoughts/ThoughtCard.js";

const removeHtmlTags = (htmlString) => {
  return htmlString.replace(/<\/?div>/g, "").replace(/&nbsp;/g, "");
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

export default function AllJournalEntries({ navigation }) {
  const [journalEntries, setJournalEntries] = useState([]);
  const auth = getAuth();
  const [isFetching, setIsFetching] = useState(true);

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

  const fetchJournalEntries = async () => {
    try {
      const userId = await getUserId();
      const journalEntriesRef = collection(
        db,
        "nonRegisteredUsers",
        userId,
        "journal_entries"
      );
      const q = query(journalEntriesRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const entries = [];
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() });
      });
      setJournalEntries(entries);
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchJournalEntries();
    console.log("journals", journalEntries);
  }, []);

  const navigateToEditJournalEntry = (entryId, title, content) => {
    navigation.navigate("EditJournalEntryScreen", { entryId, title, content });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isFetching ? (
        // Show the loader component while loading is true
        <View style={{ flex:1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#EF798A" />
        </View>
      ) : (
        <ScrollView>
          <View style={{ marginTop: 15 }}>
            <HStack space={60} p={2}>
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
                  All Journals
                </Text>
              </Stack>
            </HStack>

            <View>
              {journalEntries.map((entry) => (
                // <Text key={entry.id}>{removeHtmlTags(entry.content)}</Text>
                <TouchableOpacity
                  key={entry.id}
                  onPress={() =>
                    navigateToEditJournalEntry(
                      entry.id,
                      entry.title,
                      entry.content
                    )
                  }
                >
                  <JournalCard
                    title={entry.title}
                    content={entry.content}
                    createdAt={entry.createdAt}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const JournalCard = (props) => {
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
            {truncateContent(removeHtmlTags(props.content))}
          </Text>
        </View>
      </View>
    </View>
  );
};
