import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

export default function EditJournalEntry() {
  const titleEditorRef = useRef();

  const handleTitleChange = (text) => {
    setTitle(text);
  };

  const handleNoteChange = (text) => {
    setNote(text);
  };

  return (
    <SafeAreaView>
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
      </View>
    </SafeAreaView>
  );
}
