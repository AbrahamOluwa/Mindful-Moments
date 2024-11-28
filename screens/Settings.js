import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
// import { Card, Icon, Divider } from "react-native-elements";
import { Card, Icon, Divider } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Settings() {
  const navigation = useNavigation();

  const handleCreateAccountPress = () => {
    // Navigate to create account screen
  };

  const handleSetRemindersPress = () => {
    // Navigate to set reminders screen
  };

  const handleGiveFeedbackPress = () => {
    // Navigate to give feedback screen
  };

  const handlePrivacyPolicyPress = () => {
    // Navigate to privacy policy screen
  };

  const handleAboutUsPress = () => {
    // Navigate to about us screen
  };

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  // Dummy user name
  const userName = "Guest";

  // Example progress data
  const progressData = [
    { title: "Meditation", progress: 50 },
    { title: "Journaling", progress: 70 },
    { title: "Gratitude", progress: 100 },
  ];

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={require("../assets/images/lion_avatar.png")}
              style={styles.profileImage}
            />
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <View style={styles.card}>
            {progressData.map((data, index) => (
              <View key={index} style={styles.progressItem}>
                <Text style={styles.progressItemTitle}>{data.title}</Text>
                <View
                  style={[
                    styles.progressBar,
                    {
                      backgroundColor: getColorForProgress(data.progress),
                      width: `${(data.progress / 100) * 100}%`,
                    },
                  ]}
                ></View>
                {/* <Text
                style={styles.progressItemProgress}
              >{`${data.progress}%`}</Text> */}

                <Text
                  style={styles.progressItemProgress}
                >{`${data.progress}/100`}</Text>
              </View>
            ))}
          </View>

          {/* <View>
            <TouchableOpacity
              style={styles.option}
              onPress={handleCreateAccountPress}
            >
              <Text style={styles.optionText}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={handleSetRemindersPress}
            >
              <Text style={styles.optionText}>Set Reminders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={handleGiveFeedbackPress}
            >
              <Text style={styles.optionText}>Give Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={handlePrivacyPolicyPress}
            >
              <Text style={styles.optionText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={handleAboutUsPress}
            >
              <Text style={styles.optionText}>About Us</Text>
            </TouchableOpacity>
          </View> */}

          <View style={styles.cardContainer}>
            <Card title="Profile" containerStyle={styles.profileCard}>
              <TouchableOpacity
                onPress={() => handleNavigation("CreateAccount")}
              >
                <View style={styles.itemRow}>
                  <Ionicons name="person-circle" size={24} color="#EF798A" />
                  <Text style={styles.itemText}>Login or Create Account</Text>
                  <View style={styles.rightIcon}>
                    <Ionicons
                      name="ios-arrow-forward-circle-outline"
                      size={24}
                      color="black"
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <Divider style={styles.divider} />
              <TouchableOpacity
                onPress={() => handleNavigation("CreateAccount")}
              >
                <View style={styles.itemRow}>
                  <MaterialCommunityIcons
                    name="account"
                    size={24}
                    color="#EF798A"
                  />
                  <Text style={styles.itemText}>Profile</Text>
                  <View style={styles.rightIcon}>
                    <Ionicons
                      name="ios-arrow-forward-circle-outline"
                      size={24}
                      color="black"
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <Divider style={styles.divider} />
              <TouchableOpacity onPress={() => handleNavigation("Profile")}>
                <View style={styles.itemRow}>
                  <FontAwesome5 name="bell" size={24} color="#EF798A" />
                  <Text style={styles.itemText}>Set Reminders</Text>
                  <View style={styles.rightIcon}>
                    <Ionicons
                      name="ios-arrow-forward-circle-outline"
                      size={24}
                      color="black"
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <Divider style={styles.divider} />
              <TouchableOpacity
                onPress={() => handleNavigation("GiveFeedback")}
              >
                <View style={styles.itemRow}>
                  <AntDesign name="message1" size={24} color="#EF798A" />
                  <Text style={styles.itemText}>Give Feedback</Text>
                  <View style={styles.rightIcon}>
                    <Ionicons
                      name="ios-arrow-forward-circle-outline"
                      size={24}
                      color="black"
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <Divider style={styles.divider} />
              <TouchableOpacity onPress={() => handleNavigation("AboutUs")}>
                <View style={styles.itemRow}>
                  <AntDesign name="infocirlce" size={24} color="#EF798A" />
                  <Text style={styles.itemText}>About Us</Text>
                  <View style={styles.rightIcon}>
                    <Ionicons
                      name="ios-arrow-forward-circle-outline"
                      size={24}
                      color="black"
                    />
                  </View>
                </View>
              </TouchableOpacity>
              {/* Rest of the items */}
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getColorForProgress = (progress) => {
  if (progress <= 50) {
    return "#FF4C4C"; // Red color for low progress
  } else if (progress <= 75) {
    return "#FFA200"; // Orange color for medium progress
  } else {
    return "#00B8D9"; // Blue color for high progress
  }
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  // progressContainer: {
  //   backgroundColor: "#FFF",
  //   paddingVertical: 16,
  //   paddingHorizontal: 24,
  //   marginBottom: 12,
  //   borderRadius: 8,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 4,
  // },
  // progressTitle: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   color: "#333",
  //   marginBottom: 8,
  // },
  // progressText: {
  //   fontSize: 16,
  //   color: "#333",
  // },
  option: {
    marginTop: 10,
    backgroundColor: "#FFF",
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },

  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 50,
    marginBottom: 5,
  },
  userName: {
    fontSize: 20,
    fontFamily: "SoraSemiBold",
    color: "#333",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 14,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressItemTitle: {
    fontSize: 15,
    color: "#333",
    marginBottom: 8,
    fontFamily: "SoraSemiBold",
  },
  progressBar: {
    height: 10,
    //width: 200,
    borderRadius: 5,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    borderRadius: 5,
    with: "50%",
  },
  progressItemProgress: {
    fontSize: 13,
    fontFamily: "SoraRegular",
    //color: "#333",
  },
  cardContainer: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 40
  },
  profileCard: {
    width: "100%",
    borderWidth: 0,
    borderRadius: 8,
    // Add any other styling properties for the card
  },
  divider: {
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  leftIcon: {
    marginRight: 10,
    color: "black",
  },
  rightIcon: {
    marginLeft: "auto",
    //color: 'black',
  },
  itemText: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "SoraSemiBold",
    // Add any other styling properties for the item text
  },
});
