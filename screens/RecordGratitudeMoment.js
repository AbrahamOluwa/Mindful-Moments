import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React,  { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  HStack,
  Stack,
} from "native-base";

export default function RecordGratitudeMoment({navigation}) {
  const [title, setTitle] = useState("");
  const [moment, setMoment] = useState("");
  const titleEditorRef = useRef();
  const momentEditorRef = useRef();

  const handleTitleChange = (text) => {
    setTitle(text);
  };

  const handleMomentChange = (text) => {
    setMoment(text);
  };

  const handleInsertImage = () => {
    editorRef.current.insertImage("https://example.com/image.jpg");
  };

  const saveGratitidueMoment = () => {
    // Save the journal entry using the title and note values
    // You can perform any required operations here, such as storing in a database
    console.log("Title:", title);
    console.log("Moment:", moment);

    // Clear the text input fields
    setTitle("");
    setMoment("");

    navigation.navigate("AllGratitudeMomentsScreen");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}

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
            <Text style={styles.header}>Gratitude Moments</Text>
          </Stack>
        </HStack>
        {/* <Text style={styles.header}>Gratitude Moments</Text> */}

        <View style={{ flex: 1 }}>
          <RichEditor
            ref={titleEditorRef}
            style={{
              borderWidth: 1,
              borderColor: "gray",
              marginBottom: 10,
              minHeight: 40,
            }}
            containerStyle={{ backgroundColor: 'transparent' }}
            onChange={handleTitleChange}
            initialContentHTML={title}
            placeholder="Title..."
          />
          <RichEditor
            ref={momentEditorRef}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "gray",
              marginBottom: 10,
            }}
            containerStyle={{ backgroundColor: 'transparent' }}
            onChange={handleMomentChange}
            initialContentHTML={moment}
            placeholder="Moments..."
          />
          <RichToolbar
            getEditor={() => momentEditorRef.current}
            selectedIconTint="purple"
            iconTint="gray"
            onPressAddImage={handleInsertImage}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveGratitidueMoment}
          >
            <Text style={styles.saveButtonText}>Save Entry</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* <TextInput
          style={styles.input}
          multiline
          placeholder="Write your journal entry here..."
          value={journalEntry}
          onChangeText={setJournalEntry}
        />

       
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveEntry}>
          <Text style={styles.saveButtonText}>Save Entry</Text>
        </TouchableOpacity> */}
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
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "SoraMedium",
  },
});
