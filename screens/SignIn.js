import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import * as Yup from "yup";
import { Ionicons, FontAwesome } from "@expo/vector-icons"; // Importing icons
import { auth, db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword , getAuth } from "firebase/auth";
import { useToast, Box } from "native-base";
import { useAuth } from "../context/AuthContext";

const SignIn = ({navigation}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();
  const toast = useToast();
  const { setUser } = useAuth();

  const SignInSchema = Yup.object().shape({
    email: Yup.string().required("Email/Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // const handleSignIn = (values) => {
  //   Alert.alert("Sign In", `Welcome back, ${values.email}!`);
  // };

  const isEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const handleSignIn = async (credentials) => {
    setIsLoading(true);

    try {
      let email = credentials.email;

      // Check if the input is not an email, then it's a username
      if (!isEmail(email)) {
       
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("User not found");
        }

        // Assume the first result is the correct one
        const userData = querySnapshot.docs[0].data();
        email = userData.email; // Get the email associated with the username
        console.log('email', userData.email)
      }

      // Perform Firebase Authentication with the resolved email
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        credentials.password
      );
      const user = userCredential.user;

      // Alert.alert("Success", `Welcome back, ${user.email || user.displayName}!`);
      setUser({ uid: user.uid, email: user.email });

      navigation.navigate("NewHomeScreen");
    } catch (error) {
      console.log(error)

      switch (error.code || error.message) {
        case "auth/user-not-found":
        case "User not found":
          // Alert.alert("Error", "No user found with this username or email.");
          toast.show({
            placement: "top",
            render: () => {
              return (
                <Box bg="#db4437" px="4" py="3" rounded="sm" mb={5}>
                  <Text style={{ fontFamily: "PoppinsRegular", color: "#fff" }}>
                   No user found with this username or email.
                  </Text>
                </Box>
              );
            },
          });
          break;
        case "auth/wrong-password":
          // Alert.alert("Error", "Incorrect password.");
          toast.show({
            placement: "top",
            render: () => {
              return (
                <Box bg="#db4437" px="4" py="3" rounded="sm" mb={5}>
                  <Text style={{ fontFamily: "PoppinsRegular", color: "#fff" }}>
                  Incorrect password
                  </Text>
                </Box>
              );
            },
          });
          break;
        case "auth/invalid-email":
          // Alert.alert("Error", "Invalid email address.");
          toast.show({
            placement: "top",
            render: () => {
              return (
                <Box bg="#db4437" px="4" py="3" rounded="sm" mb={5}>
                  <Text style={{ fontFamily: "PoppinsRegular", color: "#fff" }}>
                  Invalid email address
                  </Text>
                </Box>
              );
            },
          });
          break;
        default:
          // Alert.alert("Error", "Failed to sign in. Please try again.");
          toast.show({
            placement: "top",
            render: () => {
              return (
                <Box bg="#db4437" px="4" py="3" rounded="sm" mb={5}>
                  <Text style={{ fontFamily: "PoppinsRegular", color: "#fff" }}>
                  Failed to sign in. Please try again.
                  </Text>
                </Box>
              );
            },
          });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#4CAF50", "#1E90FF"]} style={styles.container}>
    <Text style={styles.welcomeBackText}>Welcome Back!</Text>
    <Text style={styles.loginDetailsText}>Please enter your login details!</Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={SignInSchema}
        // onSubmit={handleSignIn}
        onSubmit={(values) => {
          handleSignIn(values);
        }}
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
                {/* <Text style={styles.buttonText}>Sign In</Text> */}

                {isLoading ? (
                    <ActivityIndicator size="large" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
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
