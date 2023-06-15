import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Thoughts({navigation}) {
  const { width } = Dimensions.get("screen");

  const handleJournalEntriesPress = () => {
    // Handle navigation to Journal Entries screen
    // You can use navigation library or component to handle screen navigation
    navigation.navigate("JournalScreen")
  };

  const handleGratitudeMomentsPress = () => {
    // Handle navigation to Gratitude Moments screen
    // You can use navigation library or component to handle screen navigation
    navigation.navigate("GratitudeScreen")
  };

  return (
    <SafeAreaView style={{ }}>
      <View style={{ marginTop: 10, marginLeft: 10 }}>
        <Text style={{ fontFamily: "SoraSemiBold", fontSize: 28 }}>
          Thoughts
        </Text>
      </View>

      <Image
        source={require("../assets/images/journalling.png")}
        style={{
          width: width,
          height: 320,
        }}
        resizeMode="contain"
      />

      <View style={{marginTop: 0}}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 14,
            marginBottom: 20,
            paddingHorizontal: 20,
            fontFamily: 'SoraRegular',
          }}
        >
          Reflect on your thoughts and cultivate gratitude through journaling
          and capturing moments of appreciation. Explore the power of
          self-expression and positivity in your personal growth journey.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
        <TouchableOpacity
          style={styles.sectionButton}
          onPress={handleJournalEntriesPress}
        >
          <Text style={styles.sectionButtonText}>Journal Entries</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sectionButton}
          onPress={handleGratitudeMomentsPress}
        >
          <Text style={styles.sectionButtonText}>Gratitude Moments</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionButton: {
    // backgroundColor: "#E5E5E5",
    backgroundColor: "#EF798A",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  sectionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SoraSemiBold',
    textAlign: "center",
  },
});
