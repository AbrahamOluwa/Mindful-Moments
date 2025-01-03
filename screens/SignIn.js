import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import * as Yup from "yup";
import { Ionicons, FontAwesome } from "@expo/vector-icons"; // Importing icons

const SignIn = ({navigation}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const SignInSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSignIn = (values) => {
    Alert.alert("Sign In", `Welcome back, ${values.email}!`);
  };

  return (
    <LinearGradient colors={["#4CAF50", "#1E90FF"]} style={styles.container}>
    <Text style={styles.welcomeBackText}>Welcome Back!</Text>
    <Text style={styles.loginDetailsText}>Please enter your login details!</Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={SignInSchema}
        onSubmit={handleSignIn}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
        }) => (
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email Address/Username *"
                placeholderTextColor="#aaa"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && touched.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password *"
                  placeholderTextColor="#aaa"
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.showHideButton}
                >
                  <Text style={styles.showHideText}>
                    {passwordVisible ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.password && touched.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            <TouchableOpacity
                style={[
                  styles.signInButton,
                  { backgroundColor: isValid ? "#4CAF50" : "#ddd" },
                ]}
                onPress={handleSubmit}
                disabled={!isValid}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
          </View>
        )}
      </Formik>
      <Text style={styles.orText}>OR</Text>
      <TouchableOpacity style={styles.googleButton}>
        <Ionicons name="logo-google" size={24} color="#fff" />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.facebookButton}>
        <FontAwesome name="facebook" size={24} color="#fff" />
        <Text style={styles.facebookButtonText}>Continue with Facebook</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("SignUpScreen")}
      >
        <Text style={styles.signUpText}>
          Don’t have an account? <Text style={styles.signUpLink}>Sign Up</Text>
        </Text>
      </TouchableOpacity>

       {/* Forgot Password Section */}
      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPasswordScreen")} // Navigate to the ForgotPasswordScreen
        style={styles.forgotPasswordContainer}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  welcomeBackText: {
    fontSize: 32, // Increased size for the "Welcome Back!" text
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "PoppinsSemiBold",
  },
  loginDetailsText: {
    fontSize: 20, // Smaller size for "Please enter your login details!"
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
    fontFamily: "PoppinsRegular",
  },
  form: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    fontSize: 14,
    fontFamily: "PoppinsRegular",
  },
  passwordContainer: {
    position: "relative",
  },
  showHideButton: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  showHideText: {
    color: "#2575fc",
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    fontFamily: "PoppinsRegular",
  },
  signInButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
 
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    // color: "#2575fc",
    color: "#fff",
    fontFamily: "PoppinsRegular",
  },
  orText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginVertical: 10,
    fontFamily: "PoppinsRegular",
  },
  googleButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#db4437",
    marginBottom: 10,
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
    fontFamily: "PoppinsRegular",
  },
  facebookButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4267B2",
    marginBottom: 20,
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  facebookButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
    fontFamily: "PoppinsRegular",
  },
  signUpText: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "PoppinsRegular",
  },
  signUpLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontFamily: "PoppinsRegular",
  },
  forgotPasswordContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "PoppinsRegular",
  },
});

export default SignIn;
