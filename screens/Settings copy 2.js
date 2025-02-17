import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { auth, db, storage } from "../firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Settings = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const auth = getAuth();
  const { setUser } = useAuth();
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    console.log("User:", user);
    if (user) {
      setDisplayName(user.username);
      setEmail(user.email);
      if (user.photoURL) {
        setProfileImage(user.photoURL);
      }
    }
  }, [user]);

  const updateProfile = () => {
    user
      .updateProfile({
        displayName: displayName,
        photoURL: profileImage,
      })
      .then(() => {
        Alert.alert(
          "Profile Updated",
          "Your profile has been updated successfully."
        );
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  const updateEmail = () => {
    user
      .updateEmail(email)
      .then(() => {
        Alert.alert(
          "Email Updated",
          "Your email has been updated successfully."
        );
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  const updatePassword = () => {
    user
      .updatePassword(password)
      .then(() => {
        Alert.alert(
          "Password Updated",
          "Your password has been updated successfully."
        );
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

 
  const pickImage = async () => {
    // Request permissions if necessary (Important!)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return; // Stop if permissions are not granted
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Consider allowing editing if needed
      aspect: [4, 3],       // Aspect ratio, adjust as required
      quality: 1,         // Quality, 1 is highest, 0 is lowest. Adjust as needed
    });
  
    if (!result.canceled) {
      const { uri } = result.assets[0]; // Access uri correctly
        //setProfileImage(uri);
      uploadImage(uri); // Call your upload function
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
  
      const storageRef = ref(storage, `profileImages/${user.uid}`); // Use ref() from firebase/storage
  
      await uploadBytes(storageRef, blob); // Use uploadBytes()
  
      const downloadURL = await getDownloadURL(storageRef); // Use getDownloadURL()
  
      setProfileImage(downloadURL);
      await user.updateProfile({ photoURL: downloadURL }); // Update user profile
  
      console.log("Image uploaded and URL updated:", downloadURL);
  
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert('Error', error.message);
    }
  };

  const toggleNotification = () => {
    setNotificationEnabled(!notificationEnabled);
  };

  const toggleDarkMode = () => {
    setDarkModeEnabled(!darkModeEnabled);
  };

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

  const navigateToTerms = () => {
    navigation.navigate("TermsScreen");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("../assets/images/lion_avatar.png")
          }
          style={styles.profileImage}
        />
        <Text style={styles.changePhotoText}>Change Profile Photo</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <Button title="Update Profile" onPress={updateProfile} color="#007BFF" />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Button title="Update Email" onPress={updateEmail} color="#007BFF" />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Update Password"
        onPress={updatePassword}
        color="#007BFF"
      />

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Notifications</Text>
        <Switch
          value={notificationEnabled}
          onValueChange={toggleNotification}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Dark Mode</Text>
        <Switch value={darkModeEnabled} onValueChange={toggleDarkMode} />
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Language</Text>
        <Picker
          selectedValue={selectedLanguage}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Spanish" value="es" />
          <Picker.Item label="French" value="fr" />
          {/* Add more languages as needed */}
        </Picker>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>About the App</Text>
        <Text style={styles.aboutText}>
          This is a sample app created using React Native and Firebase. It
          includes basic authentication and a settings screen.
        </Text>
      </View>

      <Button
        title="Terms and Conditions"
        onPress={navigateToTerms}
        color="#007BFF"
      />

      <Button title="Logout" onPress={logout} color="#FF3D00" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 12,
  },
  changePhotoText: {
    textAlign: "center",
    color: "#007BFF",
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  switchLabel: {
    fontSize: 18,
  },
  pickerContainer: {
    marginVertical: 16,
  },
  pickerLabel: {
    fontSize: 18,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  aboutSection: {
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 16,
    color: "#666",
    textAlign: "justify",
  },
  imageContainer: {
    alignItems: "center",
  },
});

export default Settings;
