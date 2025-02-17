import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator 
} from "react-native";
import { Checkbox } from "native-base";
import { Formik } from "formik";
import * as Yup from "yup";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
// import Checkbox from 'expo-checkbox';
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useToast, Box } from "native-base";

const SignUp = ({ navigation }) => {
  // const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [successMessage, setSuccessMessage] = useState(null); // For success messages
  const auth = getAuth();
  const toast = useToast();

  const handleSignUp = async (credentials) => {
    setIsLoading(true); // Start loader
    setSuccessMessage(null); // Reset success message
  
    try {
      // Check if the username is already in use
      const usernameQuery = await getDocs(
        query(collection(db, "users"), where("username", "==", credentials.username))
      );
  
      if (!usernameQuery.empty) {
        throw { code: "auth/username-already-in-use", message: "The username is already taken." };
      }
  
      // Proceed with account creation
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
  
      const user = userCredential.user;
  
      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: credentials.name,
        username: credentials.username,
        gender: credentials.gender,
        countryCode: credentials.countryCode,
        phoneNumber: credentials.phone,
        createdAt: serverTimestamp(),
        profileImage: "",
        bio: "",
        address: "",
        nationality: "",
        dob: null,
      });
  
      setSuccessMessage("User created successfully!");
  
      toast.show({
        placement: "bottom",
        render: () => (
          <Box bg="#198754" px="4" py="3" rounded="sm" mb={5}>
            <Text style={{ fontFamily: "PoppinsRegular", color: "#fff" }}>
              Account created successfully!
            </Text>
          </Box>
        ),
      });
  
      setIsLoading(false); // Stop loader
  
      setTimeout(() => {
        navigation.navigate("SignInScreen");
      }, 4000);
    } catch (error) {
      //console.error("Error creating user:", error.message);
  
      let errorMessage = "An error occurred. Please try again.";
  
      // Combine Firebase error codes and custom errors
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "The email address is already in use. Please use a different email.";
          break;
        case "auth/invalid-email":
          errorMessage = "The email address is not valid. Please check and try again.";
          break;
        case "auth/weak-password":
          errorMessage = "The password is too weak. Please choose a stronger password.";
          break;
        case "auth/username-already-in-use":
          errorMessage = error.message; // Custom error message for username
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your internet connection and try again.";
          break;
        default:
          errorMessage = `Error creating user: ${error.message}`;
      }
  
  
      toast.show({
        placement: "bottom",
        render: () => (
          <Box bg="#db4437" px="4" py="3" rounded="sm" mb={5}>
            <Text style={{ fontFamily: "PoppinsRegular", color: "#fff" }}>
              {errorMessage}
            </Text>
          </Box>
        ),
        duration: 5000,
      });
  
      setIsLoading(false); // Stop loader
    }
  };

  const SignUpSchema = Yup.object().shape({
    name: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    username: Yup.string().required("Username is required"),
    gender: Yup.string().required("Gender is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    // nationality: Yup.string().required("Nationality is required"),
    countryCode: Yup.string().required("Country code is required"),
    phone: Yup.string()
      .matches(/^\d{10,15}$/, "Phone number must be between 10 and 15 digits")
      .required("Phone number is required"),
    terms: Yup.boolean().oneOf(
      [true],
      "You must accept the terms and conditions"
    ),
  });
  return (
    <LinearGradient
      colors={["#4CAF50", "#1E90FF"]}
      style={styles.gradientContainer}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Section */}
        <Text style={styles.headerText}>Create Your Account</Text>
        <Text style={styles.subHeaderText}>
          Start your journey with us today!
        </Text>

        <TouchableOpacity style={styles.googleButton}>
          <Icon name="google" size={24} color="#fff" />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* OR Separator */}
        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>OR</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* Form */}
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            username: "",
            gender: "",
            countryCode: "",
            phone: "",
            terms: false,
          }}
          validationSchema={SignUpSchema}
          validateOnMount
          onSubmit={(values) => {
            handleSignUp(values);
            // alert(
            //   "Registration Successful: " + JSON.stringify(values, null, 2)
            // );
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <View style={styles.formContainer}>
              {/* Full Name */}
              <TextInput
                style={styles.input}
                placeholder="Full Name *"
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              {/* Email */}
              <TextInput
                style={styles.input}
                placeholder="Email Address *"
                keyboardType="email-address"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              {/* Username */}
              <TextInput
                style={styles.input}
                placeholder="Username *"
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
              />
              {touched.username && errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}

              {/* Gender Picker */}
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={values.gender}
                  onValueChange={(itemValue) =>
                    setFieldValue("gender", itemValue)
                  }
                  style={styles.picker}
                >
                  <Picker.Item
                    label="Select Gender *"
                    value=""
                    fontFamily="PoppinsRegular"
                  />
                  <Picker.Item
                    label="Male"
                    value="Male"
                    fontFamily="PoppinsRegular"
                  />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
              {touched.gender && errors.gender && (
                <Text style={styles.errorText}>{errors.gender}</Text>
              )}

              {/* Phone Number with Country Code */}
              <View style={styles.phoneContainer}>
                <TextInput
                  style={[styles.input, styles.countryCodeInput]}
                  placeholder="+1 *"
                  keyboardType="phone-pad"
                  onChangeText={handleChange("countryCode")}
                  onBlur={handleBlur("countryCode")}
                  value={values.countryCode}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Phone Number *"
                  keyboardType="phone-pad"
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                />
              </View>
              {touched.phone && errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}

              {/* Password */}
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password *"
                  secureTextEntry={!isPasswordVisible}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  style={styles.iconContainer}
                >
                  <Icon
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={24}
                    color="#333"
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              {/* Terms and Conditions */}
              <View style={styles.checkboxContainer}>
                <Checkbox
                  accessibilityLabel="This is a dummy checkbox"
                  value={values.terms}
                  onChange={() => setFieldValue("terms", !values.terms)}
                  color={values.terms ? "#4CAF50" : undefined}
                />
                <Text style={styles.termsText}>
                  I accept the Terms and Conditions *
                </Text>
              </View>
              {touched.terms && errors.terms && (
                <Text style={styles.errorText}>{errors.terms}</Text>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: isValid ? "#4CAF50" : "#ddd" },
                ]}
                onPress={handleSubmit}
                disabled={!isValid || isLoading}
              >

                {isLoading ? (
                    <ActivityIndicator size="large" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Create Your Account</Text>
                )}
              </TouchableOpacity>

              {/* Success message */}
              {/* s */}

              {/* Sign In Link */}

              <TouchableOpacity
                onPress={() => navigation.navigate("SignInScreen")}
              >
                <Text style={styles.signInText}>
                  Already have an account?{" "}
                  <Text style={styles.signInLink}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
    fontFamily: "PoppinsSemiBold",
  },
  subHeaderText: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "PoppinsRegular",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontFamily: "PoppinsRegular",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
    fontFamily: "PoppinsRegular",
  },
  picker: {
    height: 52,
    color: "#333",
    fontFamily: "PoppinsRegular",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  countryCodeInput: {
    width: 60,
    marginRight: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    paddingHorizontal: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  termsText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#333",
    fontFamily: "PoppinsRegular",
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
  },
  errorText: {
    color: "red",
    fontSize: 11,
    marginTop: -6,
    marginBottom: 10,
    fontFamily: "PoppinsRegular",
  },
  signInText: {
    textAlign: "center",
    marginTop: 20,
    color: "#333",
    fontFamily: "PoppinsRegular",
  },
  signInLink: {
    color: "#1E90FF",
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
  },

  required: {
    color: "red",
    marginLeft: 5,
  },

  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DB4437",
    //backgroundColor: "#1E90FF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  googleButtonText: {
    marginLeft: 10,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "PoppinsRegular",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  separatorText: {
    marginHorizontal: 10,
    color: "#555",
    fontSize: 14,
  },
});

export default SignUp;
