import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  StyleSheet,
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
  Box,
  Fab,
  Modal,
  Button,
  useToast
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThoughtCard from "../components/thoughts/ThoughtCard.js";
import { debounce } from "lodash";
import { getUserId } from "../components/home/GetUserId";

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
  // const auth = getAuth();
  const toast = useToast();
  const [isFetching, setIsFetching] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [journalToDelete, setJournalToDelete] = useState();
  const [isLoading, setIsLoading] = useState(false);

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

      // Set up a real-time listener using onSnapshot
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const entries = [];
        querySnapshot.forEach((doc) => {
          entries.push({ id: doc.id, ...doc.data() });
        });

        // Update the state with the real-time data
        setJournalEntries(entries);
        setIsFetching(false);
      });

      // Use the unsubscribe function to stop the listener when needed
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      setIsFetching(false);
    }
  };

  const filterJournals = (searchText) => {
    const filteredJournals = journalEntries.filter((journal) => {
      // Assuming you have a "title" field in your journal entry
      return journal.title.toLowerCase().includes(searchText.toLowerCase());
    });
    setFilteredJournals(filteredJournals);
  };

  const debouncedFilter = debounce(filterJournals, 300);

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  useEffect(() => {
    filterJournals(searchText);
  }, [searchText]);

  const navigateToEditJournalEntry = (entryId, title, content) => {
    navigation.navigate("EditJournalEntryScreen", { entryId, title, content });
  };

  const handleFabPress = () => {
    navigation.navigate("WriteJournalEntryScreen");
    console.log("Fab pressed!");
  };

  const showDeleteConfirmationModal = (journalId) => {
    setJournalToDelete(journalId);
    setShowModal(true);
  };


  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const userId = await getUserId();
      const jRef = doc(
        db,
        "nonRegisteredUsers",
        userId,
        "journal_entries",
        journalToDelete
      );

     await deleteDoc(jRef);

      // Update the local state to remove the deleted moment
      const updatedJournal = journalEntries.filter((journal) => journal.id !== journalToDelete);
      setJournalEntries(updatedJournal);
    
      setShowModal(false);
      setIsLoading(false);

      toast.show({
        render: () => {
          return (
            <Box bg="emerald.500" px="4" py="3" rounded="sm" mb={5}>
              <Text style={{ fontFamily: "SoraMedium", color: "#fff" }}>
                Journal deleted successfully!
              </Text>
            </Box>
          );
        },
      });
    } catch (error) {
      console.error("Error deleting journal:", error);
    } finally {
      // Hide the loading indicator
      setIsLoading(false);
    }
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
            <HStack space={60} p={2}>
              <Stack>
                <TouchableOpacity
                  onPress={() => navigation.navigate("JournalScreen")}
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

            <Center flex={1} px="6" mt="2">
              <VStack w="100%" space={5} alignSelf="center">
                <Input
                  placeholder="Search Journals"
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
                  journalEntries.map((entry) => (
                    <JournalCard
                      key={entry.id}
                      id={entry.id}
                      title={entry.title}
                      content={entry.content}
                      createdAt={entry.createdAt}
                      navigation={navigation}
                      onDelete={() => showDeleteConfirmationModal(entry.id)}
                    />
                  ))
                : // If there's search text, show the filtered journals
                  filteredJournals.map((entry) => (
                    <JournalCard
                      key={entry.id}
                      id={entry.id}
                      title={entry.title}
                      content={entry.content}
                      createdAt={entry.createdAt}
                      navigation={navigation}
                      onDelete={() => showDeleteConfirmationModal(entry.id)}
                    />

                  ))}
            </View>

            
            <Center>
              <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                _backdrop={{
                  _dark: {
                    bg: "coolGray.800",
                  },
                  bg: "black",
                }}
              >
                <Modal.Content maxWidth="350" maxH="240">
                  <Modal.CloseButton />
                  <Modal.Header>
                    <Text style={{ fontFamily: "SoraSemiBold", fontSize: 14 }}>
                      Confirm Delete
                    </Text>
                  </Modal.Header>
                  <Modal.Body>
                    <Text style={{ fontFamily: "SoraRegular", fontSize: 13 }}>
                      Are you sure you want to delete this journal?
                    </Text>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button.Group space={2}>
                      <Button
                        variant="ghost"
                        colorScheme="blueGray"
                        onPress={() => {
                          setShowModal(false);
                        }}
                      >
                        <Text
                          style={{ fontFamily: "SoraRegular", color: "black" }}
                        >
                          Cancel
                        </Text>
                      </Button>

                      {isLoading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                      ) : (
                        <Button
                          onPress={() => {
                            handleDelete();
                          }}
                          style={{ backgroundColor: "#ff0e0e" }}
                        >
                          <Text
                            style={{ fontFamily: "SoraRegular", color: "#fff" }}
                          >
                            Delete
                          </Text>
                        </Button>
                      )}
                    </Button.Group>
                  </Modal.Footer>
                </Modal.Content>
              </Modal>
            </Center>
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

const JournalCard = (props) => {
  const { id, title, content, createdAt, navigation, onDelete } = props;

  const handleDelete = () => {
    onDelete(id);
  };

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
          width: "49%",
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
            <Text
              style={{ fontFamily: "SoraRegular", fontSize: 12, marginLeft: 4 }}
            >
              {formatDate(createdAt)}
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
            position: "relative",
          }}
        >
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("EditJournalEntryScreen", {
                id,
                title,
                content,
              })
            }
          >
            <MaterialIcons name="edit" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <MaterialIcons
              name="delete"
              size={20}
              color="#fff" // Icon color
            />
          </TouchableOpacity>

          <Text style={{ fontFamily: "SoraSemiBold", fontSize: 15, maxWidth: "80%" }}>
            {removeHtmlTags(title)}
          </Text>
          <Text style={{ fontFamily: "SoraRegular", fontSize: 13, maxWidth: "90%", marginTop: 8 }}>
            {truncateContent(removeHtmlTags(content))}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  editButton: {
    position: "absolute",
    top: 5,
    right: 48, // Adjust the position
    backgroundColor: "#EF798A",
    padding: 10, // Adjust the padding
    borderRadius: 20, // Make it a circle
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 4,
    backgroundColor: "#FF5733", // Customize the delete button color
    padding: 10, // Adjust the padding
    borderRadius: 20, // Make it a circle
  },
});
