import React from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import { useCallback, useEffect, useReducer, useState } from "react";
import CustomInput from "../components/CustomInput";
import Toast from 'react-native-toast-message'
import Shape from "../components/Shape";
import DeviceDimensions from "../constants/DeviceDimensions";
import CustomBigText from "../components/CustomBigText";
import CustomButton from "../components/CustomButton";
import Theme from "../constants/Theme";
import { Formik, Field } from 'formik'
import * as yup from 'yup'

const LoginScreen = ({ props, navigation }) => {
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  //Login function
  const Login = async (values, { resetForm }) => {
    //Declaring the action
    action = authActions.login(values.email, values.password);
    setError(null);
    try {
      console.log('dkhal dispatch')
      await dispatch(action);
      navigation.navigate("Tasks");
      resetForm({ values: '' });
    } catch (err) {
      setError(err.message);
    }
  };
  //Set the error alert
  useEffect(() => {
    if (error) {
      console.log('dkhal useeffect')
      Toast.show({
        type: 'error',
        text1: 'Wrong email or password!',
        text2: 'Check your informations',
        visibilityTime: 4000,
        autoHide: true
      })
    }
  }, [error]);

  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email")
      .required('Email is required'),
    password: yup
      .string()
      .min(6, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required'),
  })
  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={loginValidationSchema}
      onSubmit={(values, { resetForm }) => {
        Login(values, { resetForm });
      }}
    >
      {({ handleSubmit, isValid }) => (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={10}
        >

          <Shape source={require("../assets/shape.png")} />
          <Toast />
          <ScrollView>
            <View style={styles.textContainer}>
              <CustomBigText text="Welcome Back!" />
              <Image
                resizeMode="contain"
                style={styles.image}
                source={require("../assets/login.png")}
              />
            </View>

            <View style={styles.formContainer}>
              <Field
                component={CustomInput}
                name="email"
                keyboardType="email-address"
                placeholder="Enter your email"
              />
              <Field
                component={CustomInput}
                name="password"
                keyboardType="default"
                secureTextEntry
                placeholder="Enter password"
              />
            </View>
            <View style={styles.buttonContainer}>
              <CustomButton text="Sign In" style={styles.button} onPress={handleSubmit} disabled={!isValid} />
            </View>
            <View style={styles.bottomTextContainer}>
              <Text style={styles.alreadyText}>
                Don't have an account ?
                <TouchableWithoutFeedback
                  onPress={() => {
                    navigation.navigate("Register");
                  }}
                >
                  <Text style={styles.signinText}> Sign Up</Text>
                </TouchableWithoutFeedback>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  //Image Style
  image: {
    width: DeviceDimensions.width * 0.465,
    height: DeviceDimensions.height * 0.209,
    marginTop: DeviceDimensions.height * 0.043,
    marginBottom: DeviceDimensions.height * 0.03,
  },

  //Text Container Style
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: DeviceDimensions.height * 0.0431,
    overflow: "visible",
  },

  //Button Container Style
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: DeviceDimensions.height * 0.08,
  },

  //Button Style
  button: {
    height: DeviceDimensions.height * 0.0764,
    width: DeviceDimensions.width * 0.87,
  },

  //Form Container Style
  formContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  //Bottom Text Container Style
  bottomTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: DeviceDimensions.height * 0.0357,
  },

  //D'ont have an account ?  Style
  alreadyText: {
    fontFamily: "poppins-regular",
    fontWeight: "400",
    letterSpacing: 1,
    fontSize: DeviceDimensions.height * 0.0172,
  },

  //Sign In Link Style
  signinText: {
    fontFamily: "poppins-bold",
    fontWeight: "400",
    color: Theme.button,
    letterSpacing: 1,
    fontSize: DeviceDimensions.height * 0.0172,
  },
});
export default LoginScreen;
