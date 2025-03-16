import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { auth, db, storage } from "../firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useAuth } from "../context/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Profile({ navigation }) {
  const { user, setUser } = useAuth();
  const [displayName, setDisplayName] = useState();
  const [fullName, setFullName] = useState();
  const [email, setEmail] = useState();
  const [bio, setBio] = useState();
  const [profileImage, setProfileImage] = useState(
    require("../assets/images/lion_avatar.png")
  );
  const [isEditing, setIsEditing] = useState(false);
  const [gender, setGender] = useState();
  const [countryCode, setCountryCode] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.username || "");
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      if (user.profileImage) {
        setProfileImage({ uri: user.profileImage });
      }
      setGender(user.gender || "");
      setCountryCode(user.countryCode || "+1");
      setPhoneNumber(user.phoneNumber || "");
      if (user.dob) {
        setDob(new Date(user.dob));
      }
      setLoading(false);
    }
  }, [user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      uploadImage(uri);
    }
  };

  const uploadImage = async (uri) => {
    setImageUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
  
      const storageRef = ref(storage, `profileImages/${user.uid}`);
  
      // *** Improved: Use a resumable upload for larger files ***
      const uploadTask = uploadBytesResumable(storageRef, blob);
  
      // Monitor upload progress (optional, but good UX):
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          // ... update a progress bar in your UI
        }, 
        (error) => {
          // Handle unsuccessful uploads
          console.error("Upload Error", error);
          setImageUploading(false); // Hide loading indicator on error
          Alert.alert("Error", error.message);
        }, 
        () => {
          // Handle successful uploads
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            setProfileImage({ uri: downloadURL });
  
            const userDoc = doc(db, "users", user.uid);
            await updateDoc(userDoc, { profileImage: downloadURL });
  
            // Update AuthContext (same as before)
            const updatedUserDoc = await getDoc(userDoc);
            if (updatedUserDoc.exists()) {
              setUser({
                uid: user.uid,
                email: user.email,
                ...updatedUserDoc.data(),
              });
            }
            console.log("Image uploaded and URL updated:", downloadURL);
            setImageUploading(false); // Hide loading indicator on success
          });
        }
      );
  
  
    } catch (error) {
      console.error("Error fetching or uploading image:", error);
      setImageUploading(false); // Hide loading indicator on error
      Alert.alert("Error", error.message);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, {
        fullName,
        bio,
        gender,
        countryCode,
        phoneNumber,
        dob: dob.toISOString(),
        profileImage: profileImage.uri || null,
      });

      // Update AuthContext after successful update
      const updatedUserDoc = await getDoc(userDoc);
      if (updatedUserDoc.exists()) {
        setUser({
          uid: user.uid,
          email: user.email,
          ...updatedUserDoc.data(),
        });
      }

      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating user data:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setDob(currentDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#407BFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={pickImage} disabled={imageUploading}>
            {imageUploading ? (
              <ActivityIndicator size="large" color="#407BFF" style={styles.profileImage} />
            ) : (
              <Image source={profileImage} style={styles.profileImage} />
            )}
            <Ionicons
              name="camera"
              size={24}
              color="#fff"
              style={styles.cameraIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            editable={false}
          />
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, isEditing && styles.editableInput]}
            value={fullName}
            editable={isEditing}
            onChangeText={setFullName}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} editable={false} />
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            disabled={!isEditing}
          >
            <TextInput
              style={[styles.input, isEditing && styles.editableInput]}
              value={formatDate(dob)}
              editable={false}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dob}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
          <Text style={styles.label}>Gender</Text>
          <View
            style={[
              styles.input,
              styles.pickerInput,
              isEditing && styles.editableInput,
            ]}
          >
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              enabled={isEditing}
              style={styles.picker}
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneContainer}>
            <TextInput
              style={[
                styles.input,
                styles.countryCodeInput,
                isEditing && styles.editableInput,
              ]}
              value={countryCode}
              editable={isEditing}
              onChangeText={setCountryCode}
            />
            <TextInput
              style={[
                styles.input,
                styles.phoneNumberInput,
                isEditing && styles.editableInput,
              ]}
              value={phoneNumber}
              editable={isEditing}
              onChangeText={setPhoneNumber}
            />
          </View>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[
              styles.input,
              isEditing && styles.editableInput,
              styles.bioInput,
            ]}
            value={bio}
            placeholder="Write a brief about yourself"
            placeholderTextColor="#999"
            editable={isEditing}
            onChangeText={setBio}
            multiline
            numberOfLines={isEditing ? undefined : 4}
            maxLength={isEditing ? 500 : undefined}
          />
        </View>
        {saving ? (
          <ActivityIndicator size="large" color="#407BFF" />
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={isEditing ? handleSave : handleEdit}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? "Save" : "Edit"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    padding: 25,
  },
  profileImageContainer: {
    alignItems: "center",
    marginTop: 20,
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 5,
  },
  infoContainer: {
    marginTop: 30,
  },
  label: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 15,
    marginBottom: 5,
  },
  input: {
    fontFamily: "PoppinsMedium",
    fontSize: 13,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  editableInput: {
    backgroundColor: "#ffffff",
    borderColor: "#407BFF",
    borderWidth: 1,
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  picker: {
    height: 55,
    color: "#000",
  },
  pickerInput: {
    padding: 0,
  },
  phoneContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  countryCodeInput: {
    flex: 1,
    marginRight: 10,
  },
  phoneNumberInput: {
    flex: 4,
  },
  editButton: {
    backgroundColor: "#407BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  editButtonText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 16,
    color: "#ffffff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
