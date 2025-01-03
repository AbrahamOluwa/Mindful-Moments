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
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

const SignUp = ({ navigation }) => {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const auth = getAuth();

  const handleSignUp = async (credentials) => {
    try {
      console.log("Attempting sign-up");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      const user = userCredential.user;

      console.log("User created:", user.uid);

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: credentials.username,
        gender: credentials.gender,
        countryCode: credentials.countryCode,
        phoneNumber: credentials.phone,
        createdAt: serverTimestamp(),
      });

      alert("User created successfully!");
    } catch (error) {
      console.error("Error creating user:", error.message);
      alert(`Error creating user: ${error.message}`);
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
            alert(
              "Registration Successful: " + JSON.stringify(values, null, 2)
            );
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
                  <Picker.Item label="Select Gender *" value="" />
                  <Picker.Item label="Male" value="Male" />
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

                {/* <Checkbox
                  accessibilityLabel="choose numbers"
                  onChange={() => setFieldValue("terms", !values.terms)}
                  onBlur={handleBlur("terms")}
                  value={values.terms}
                /> */}
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
                disabled={!isValid}
              >
                <Text style={styles.buttonText}>Create Your Account</Text>
              </TouchableOpacity>

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
