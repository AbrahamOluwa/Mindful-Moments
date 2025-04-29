import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { auth, db, storage } from "../firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

export default function SettingsScreen({ navigation }) {
  const auth = getAuth();
  // const { setUser } = useAuth();
  // const { user } = useAuth();

  const { setUser, user } = useAuth();

  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigation.navigate("SignInScreen");
      })
      .catch((error) => {
        // An error happened.
        if (error.code === "auth/no-current-user") {
          console.log("No user is currently signed in.");
          Alert.alert("Error", "No user is currently signed in.");
        } else {
          console.log("An error occurred: ", error.message);
          Alert.alert("Error", "Failed to sign out. Please try again.");
        }
      });
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={
              user && user.profileImage
                ? { uri: user.profileImage }
                : require("../assets/images/lion_avatar.png")
            }
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>
            {user ? user.fullName : "Loading..."}
          </Text>
          <Text style={styles.profileDescription}>
            {user ? user.bio : "Loading..."} {/* Use user.bio */}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Current Streak:</Text>
            <Text style={[styles.infoText, styles.highlightedText]}>
              8 days active
            </Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Current Streak:</Text>
            <Text style={[styles.infoText, styles.highlightedText]}>
              2 weeks active
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProfileScreen")}
              style={styles.optionContainer}
            >
              <Ionicons
                name="person-circle-outline"
                size={20}
                color="#4DB6AC"
              />
              <View style={styles.optionTextContainer}>
                <Text style={styles.mainText}>Profile</Text>
                <Text style={styles.subText}>Personal Details, Bio</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.optionDivider} />

            {/* <TouchableOpacity style={styles.optionContainer}>
              <MaterialCommunityIcons
                name="gamepad-variant-outline"
                size={20}
                color="#407BFF"
              />
              <View style={styles.optionTextContainer}>
                <Text style={styles.mainText}>Games</Text>
                <Text style={styles.subText}>Scores, Badges</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.optionDivider} /> */}

            <TouchableOpacity
              onPress={() => navigation.navigate("NotificationsSettingsScreen")}
              style={styles.optionContainer}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#4DB6AC"
              />
              <View style={styles.optionTextContainer}>
                <Text style={styles.mainText}>Notification</Text>
                <Text style={styles.subText}>Push, Push notification</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.optionDivider} />

            <TouchableOpacity
              onPress={() => navigation.navigate("HelpScreen")}
              style={styles.optionContainer}
            >
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={20}
                color="#4DB6AC"
              />
              <View style={styles.optionTextContainer}>
                <Text style={styles.mainText}>Help</Text>
                <Text style={styles.subText}>Support, FAQs</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.optionDivider} />

            <TouchableOpacity
              onPress={() => navigation.navigate("TermsScreen")}
              style={styles.optionContainer}
            >
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#4DB6AC"
              />
              <View style={styles.optionTextContainer}>
                <Text style={styles.mainText}>Terms and Conditions</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.optionDivider} />

            <TouchableOpacity
              onPress={() => navigation.navigate("AboutScreen")}
              style={styles.optionContainer}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                // color="#407BFF"
                color="#4DB6AC"
              />
              <View style={styles.optionTextContainer}>
                <Text style={styles.mainText}>About the App</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={logout}>
            <View style={styles.logoutContainer}>
              <Ionicons name="log-out-outline" size={30} color="#F48FB1" />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  container: {
    padding: 25,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 25,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileName: {
    marginTop: 15,
    fontFamily: "PoppinsSemiBold",
    fontSize: 20,
    color: "#263238",
  },
  profileDescription: {
    marginTop: 10,
    fontFamily: "PoppinsMedium",
    fontSize: 13,
    textAlign: "center",
  },
  divider: {
    marginVertical: 20,
    height: 1,
    // backgroundColor: "#ececec",
    backgroundColor: "#D7CCC8",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 40,
  },
  infoBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontFamily: "PoppinsMedium",
    fontSize: 13,
    color: "#263238",
  },
  highlightedText: {
    // color: "#407BFF",
    color: "#78909C"
  },
  verticalDivider: {
    width: 1,
    height: "100%",
    // backgroundColor: "#ececec",
    backgroundColor: "#D7CCC8",
  },
  sectionTitle: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 16,
    color: "#263238",
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  optionTextContainer: {
    marginLeft: 15, // Adjusted margin for consistency
  },
  mainText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 15,
    color: "#263238",
  },
  subText: {
    fontFamily: "PoppinsMedium",
    fontSize: 13,
    color: "#78909C",
  },
  optionDivider: {
    marginVertical: 10,
    height: 1,
    // backgroundColor: "#ececec",
    backgroundColor: "#D7CCC8",
  },
  logoutContainer: {
    marginTop: 70,
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    // color: "#FF1493",
    color: "#F48FB1",
    marginLeft: 10,
    fontFamily: "PoppinsSemiBold",
  },
});
