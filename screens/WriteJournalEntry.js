import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Button,
} from "react-native";
import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  HStack,
  Stack,
} from "native-base";

export default function WriteJournalEntry({ navigation }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const titleEditorRef = useRef();
  const noteEditorRef = useRef();

  const handleTitleChange = (text) => {
    setTitle(text);
  };

  const handleNoteChange = (text) => {
    setNote(text);
  };

  const handleInsertImage = () => {
    editorRef.current.insertImage("https://example.com/image.jpg");
  };

  const saveJournalEntry = () => {
    // Save the journal entry using the title and note values
    // You can perform any required operations here, such as storing in a database
    console.log("Title:", title);
    console.log("Note:", note);

    // Clear the text input fields
    setTitle("");
    setNote("");

    navigation.navigate("AllJournalEntriesScreen");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <HStack space={15}>
          <Stack>
            <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
              <AntDesign
                name="arrowleft"
                size={30}
                color="black"
                style={{ marginTop:  5}}
              />
            </TouchableOpacity>
          </Stack>

          <Stack>
            <Text style={styles.header}>Journal Entries</Text>
          </Stack>
        </HStack>
        {/* <Text style={styles.header}>Journal Entries</Text> */}

        {/* <TextInput
          style={styles.input}
          multiline
          placeholder="Write your journal entry here..."
          value={journalEntry}
          onChangeText={setJournalEntry}
        /> */}

        <View style={{ flex: 1 }}>
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
            initialContentHTML={title}
            placeholder="Title..."
            androidHardwareAccelerationDisabled={true}
          />
          <RichEditor
            ref={noteEditorRef}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "gray",
              marginBottom: 10,
            }}
            onChange={handleNoteChange}
            initialContentHTML={note}
            placeholder="Notes..."
            androidHardwareAccelerationDisabled={true}
          />
          <RichToolbar
            getEditor={() => noteEditorRef.current}
            selectedIconTint="purple"
            iconTint="gray"
            onPressAddImage={handleInsertImage}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveJournalEntry}
          >
            <Text style={styles.saveButtonText}>Save Entry</Text>
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity style={styles.saveButton} onPress={handleSaveEntry}>
          <Text style={styles.saveButtonText}>Save Entry</Text>
        </TouchableOpacity> */}
      </View>
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
  input: {
    height: 200,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 10,
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
