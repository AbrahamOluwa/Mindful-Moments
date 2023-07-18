import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { useRoute } from "@react-navigation/native";
import {
  HStack,
  Stack,
  Button,
  Modal,
  Center,
  useToast,
  Box,
} from "native-base";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function EditJournalEntry({ navigation }) {
  const route = useRoute();
  const { entryId, title, content } = route.params;
  const [journalEntryTitle, setJournalEntryTitle] = useState(title);
  const [journalEntryContent, setJournalEntryContent] = useState(content);
  const titleEditorRef = useRef();
  const noteEditorRef = useRef();

  const handleTitleChange = (text) => {
    setJournalEntryTitle(text);
  };

  const handleNoteChange = (text) => {
    setJournalEntryContent(text);
  };

  const handleInsertImage = () => {
    editorRef.current.insertImage("https://example.com/image.jpg");
  };

  // useEffect(() => {
  //   // Set the initial content of the rich text editor
  //   setJournalEntryTitle(title);
  //   setJournalEntryContent(content);
  // }, [content]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <HStack space={15}>
            <Stack>
              <TouchableOpacity
                onPress={() => navigation.navigate("AllJournalEntriesScreen")}
              >
                <AntDesign
                  name="arrowleft"
                  size={30}
                  color="black"
                  style={{ marginTop: 5 }}
                />
              </TouchableOpacity>
            </Stack>

            <Stack>
              <Text style={styles.header}>Journal Entries</Text>
            </Stack>
          </HStack>
          <RichEditor
            ref={titleEditorRef}
            style={{
              //flex: 1,
              borderWidth: 1,
              borderColor: "gray",
              marginBottom: 10,
              minHeight: 40,
            }}
            onChange={handleTitleChange}
            initialContentHTML={journalEntryTitle}
            androidHardwareAccelerationDisabled={true}
          />
          <ScrollView>
            <RichEditor
              ref={noteEditorRef}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "gray",
                marginBottom: 1,
                height: 300,
              }}
              onChange={handleNoteChange}
              initialContentHTML={journalEntryContent}
              androidHardwareAccelerationDisabled={true}
            />
          </ScrollView>
          <RichToolbar
            getEditor={() => noteEditorRef.current}
            selectedIconTint="purple"
            iconTint="gray"
            onPressAddImage={handleInsertImage}
          />

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Update Entry</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    //backgroundColor: "#FFFFFF",
  },
  header: {
    fontSize: 24,
    fontFamily: "SoraSemiBold",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#EF798A",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  saveButtonText: {
    fontFamily: "SoraMedium",
    color: "#FFFFFF",
    fontSize: 16,
  },
});
