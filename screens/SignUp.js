import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  NativeBaseProvider,
  Box,
  VStack,
  Input,
  Button,
  Checkbox,
  FormControl,
  HStack,
  Heading,
  Center,
  Select,
  CheckIcon,
  Icon,
} from "native-base";
import CountryPicker from "react-native-country-picker-modal";
import { MaterialIcons } from "@expo/vector-icons";
// import { CountryCode, Country } from './src/types'

const SignUp = () => {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null); // Store selected country code
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [selectedNationality, setSelectedNationality] = useState(null);
  const [showNationalityPicker, setShowNationalityPicker] = useState(false);

  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState(null);
  const [showPhoneCountryPicker, setShowPhoneCountryPicker] = useState(false);

  const [countryCode, setCountryCode] = useState("FR");
  const [country, setCountry] = useState("");
  const [withCountryNameButton, setWithCountryNameButton] = useState(false);
  const [withFlag, setWithFlag] = useState(true);
  const [withEmoji, setWithEmoji] = useState(true);
  const [withFilter, setWithFilter] = useState(true);
  const [withAlphaFilter, setWithAlphaFilter] = useState(false);
  const [withCallingCode, setWithCallingCode] = useState(false);
  // const onSelect = (country) => {
  //   setCountryCode(country.cca2)
  //   setCountry(country)
  // }

  // const onSelect = (country) => {
  //   setCountryCode(country.cca2);
  //   setCountry(country);
  //   //console.log('Country', country);
  // };

  const onSelect = (country) => {
    console.log("Selected Country: ", country);
    setSelectedNationality(country);
    setSelectedPhoneCountry(country);
    setShowNationalityPicker(false);
  };

  const inputStyles = {
    borderColor: "primary.400",
    _focus: { borderColor: "primary.500", bg: "primary.50" },
    height: 50,
    bg: "white",
    borderRadius: 10,
    fontSize: "md",
  };

  const SignUpSchema = Yup.object().shape({
    name: Yup.string().required("Full Name is required"),
    username: Yup.string().required("Username is required"),
    gender: Yup.string().required("Gender is required"),
    nationality: Yup.string().required("Nationality is required"),
    phone: Yup.string()
      .matches(/^\d{10,15}$/, "Phone number must be between 10 and 15 digits")
      .required("Phone number is required"),
    terms: Yup.boolean().oneOf(
      [true],
      "You must accept the terms and conditions"
    ),
  });
  return (
    // <View>
    //   <Text>SignUp</Text>
    // </View>
    <Box safeArea flex={1} bg="white">
      {/* Logo and Intro Text */}
      <Center mt={10}>
        <Image
          source={{
            uri: "https://via.placeholder.com/150", // Replace with actual image URL
          }}
          alt="App Logo"
          size="xl"
          mb={6}
        />
        <Heading fontSize="2xl" color="primary.600" mb={2}>
          Set Up Your Account
        </Heading>
        <Text fontSize="md" color="gray.500" textAlign="center" px={6}>
          Join our platform and start your personal or professional growth
          journey today!
        </Text>
      </Center>

      {/* Form */}
      <Formik
        initialValues={{
          name: "",
          username: "",
          gender: "",
          nationality: "",
          phone: "",
          terms: false,
        }}
        validationSchema={SignUpSchema}
        onSubmit={(values) => {
          Alert.alert(
            "Registration Successful",
            JSON.stringify(values, null, 2)
          );
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <VStack space={5} px={6} mt={8}>
            {/* Reusable Input Style */}

            {/* Full Name */}
            <FormControl isInvalid={touched.name && errors.name}>
              <FormControl.Label fontSize="md" color="primary.600">
                Full Name
              </FormControl.Label>
              <Input
                placeholder="Enter your full name"
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                {...inputStyles}
              />
              {touched.name && errors.name && (
                <FormControl.ErrorMessage>
                  {errors.name}
                </FormControl.ErrorMessage>
              )}
            </FormControl>

            {/* Username */}
            <FormControl isInvalid={touched.username && errors.username}>
              <FormControl.Label fontSize="md" color="primary.600">
                Username
              </FormControl.Label>
              <Input
                placeholder="Enter your username"
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
                {...inputStyles}
              />
              {touched.username && errors.username && (
                <FormControl.ErrorMessage>
                  {errors.username}
                </FormControl.ErrorMessage>
              )}
            </FormControl>

            {/* Gender Dropdown */}
            <FormControl isInvalid={touched.gender && errors.gender}>
              <FormControl.Label fontSize="md" color="primary.600">
                Gender
              </FormControl.Label>
              <Select
                selectedValue={values.gender}
                minWidth="200"
                accessibilityLabel="Select Gender"
                placeholder="Select Gender"
                {...inputStyles}
                _selectedItem={{
                  bg: "primary.500",
                  endIcon: <Icon size={4} name="check" color="white" />,
                }}
                onValueChange={handleChange("gender")}
              >
                <Select.Item label="Male" value="Male" />
                <Select.Item label="Female" value="Female" />
                <Select.Item label="Other" value="Other" />
              </Select>
              {touched.gender && errors.gender && (
                <FormControl.ErrorMessage>
                  {errors.gender}
                </FormControl.ErrorMessage>
              )}
            </FormControl>

            {/* Nationality Dropdown */}
            <FormControl isInvalid={touched.nationality && errors.nationality}>
              <FormControl.Label fontSize="md" color="primary.600">
                Nationality
              </FormControl.Label>
              <TouchableOpacity
                onPress={() => setShowNationalityPicker(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderColor: "primary.400",
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingHorizontal: 8,
                  height: 50,
                  bg: "white",
                }}
              >
                <Text color="gray.700" fontSize="md">
                  {selectedNationality
                    ? selectedNationality.name
                    : "Select Nationality"}
                </Text>
                <Icon
                  as={MaterialIcons}
                  name="arrow-drop-down"
                  size={5}
                  color="primary.500"
                  style={{ marginLeft: "auto" }}
                />
              </TouchableOpacity>
              {showNationalityPicker && (
                <CountryPicker
                  withFlag
                  withCountryNameButton
                  withAlphaFilter
                  onSelect={(country) => {
                    setSelectedNationality(country);
                    setShowNationalityPicker(false);
                  }}
                  visible={showNationalityPicker}
                  onClose={() => setShowNationalityPicker(false)}
                />
              )}
              {touched.nationality && errors.nationality && (
                <FormControl.ErrorMessage>
                  {errors.nationality}
                </FormControl.ErrorMessage>
              )}
            </FormControl>

            {/* Phone Number with Country Code */}
            <FormControl isInvalid={touched.phone && errors.phone}>
              <FormControl.Label fontSize="md" color="primary.600">
                Phone Number
              </FormControl.Label>
              <HStack space={2} alignItems="center">
                <TouchableOpacity
                  onPress={() => setShowPhoneCountryPicker(true)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderColor: "primary.400",
                    borderWidth: 1,
                    borderRadius: 10,
                    paddingHorizontal: 8,
                    height: 50,
                    bg: "white",
                  }}
                >
                  {selectedPhoneCountry?.cca2 && (
                    <Image
                      source={{
                        uri: `https://flagcdn.com/w40/${selectedPhoneCountry.cca2.toLowerCase()}.png`,
                      }}
                      alt="Country Flag"
                      style={{ width: 24, height: 16, marginRight: 8 }}
                    />
                  )}
                  <Text fontSize="md" color="gray.700">
                    {selectedPhoneCountry?.callingCode
                      ? `+${selectedPhoneCountry.callingCode}`
                      : "+1"}
                  </Text>
                </TouchableOpacity>
                {showPhoneCountryPicker && (
                  <CountryPicker
                    withFlag
                    withCallingCode
                    withAlphaFilter
                    onSelect={(country) => {
                      setSelectedPhoneCountry(country);
                      setShowPhoneCountryPicker(false);
                    }}
                    visible={showPhoneCountryPicker}
                    onClose={() => setShowPhoneCountryPicker(false)}
                  />
                )}
                <Input
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    handleChange("phone")(
                      `${selectedPhoneCountry?.callingCode || "+1"} ${text}`
                    );
                  }}
                  flex={1}
                  {...inputStyles}
                />
              </HStack>
              {touched.phone && errors.phone && (
                <FormControl.ErrorMessage>
                  {errors.phone}
                </FormControl.ErrorMessage>
              )}
            </FormControl>

            {/* Submit Button */}
            <Button
              onPress={handleSubmit}
              isDisabled={!isTermsAccepted}
              colorScheme="primary"
              size="lg"
              mt={6}
              rounded="full"
            >
              Register
            </Button>
          </VStack>
        )}
      </Formik>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  form: {
    marginTop: 10,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 20,
    padding: 5,
    backgroundColor: "#6200ee",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 12,
    marginLeft: 5,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
  },
});

export default SignUp;
