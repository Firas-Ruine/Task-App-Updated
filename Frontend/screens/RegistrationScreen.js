import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import CustomInput from "../components/CustomInput";
import React, { useReducer, useCallback, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import Shape from "../components/Shape";
import CustomBigText from "../components/CustomBigText";
import DeviceDimensions from "../constants/DeviceDimensions";
import CustomSmallText from "../components/CustomSmallText";
import CustomButton from "../components/CustomButton";
import Theme from "../constants/Theme";
import { Formik, Field } from 'formik'
import * as yup from 'yup'
import Toast from 'react-native-toast-message'

const RegistrationScreen = ({ props, navigation }) => {
  const [error, setError] = useState();
  const dispatch = useDispatch()

  //Create account function
  const SignUp = async (values, { resetForm }) => {
    action =authActions.signup(
      values.fullName,
      values.email,
      values.password,
      values.confirmPassword
    )
    setError(null)
    try {
      await dispatch(action);
      navigation.navigate("Login");
      resetForm({ values: '' });
    } catch (err) {
      setError(err.message)
    }
  };
  //Set the error Taost
  useEffect(() => {
    if (error) {
      Toast.show({
        type:'error',
        text1:'Email already Exist!',
        text2:'This email already exist ',
        visibilityTime:4000,
        autoHide:true
      })
    }
  }, [error]);
  const signUpValidationSchema = yup.object().shape({
    fullName: yup
      .string()
      .required('Full name is required'),
    email: yup
      .string()
      .email("Please enter valid email")
      .required('Email is required'),
    password: yup
      .string()
      .min(6, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords do not match')
      .required('Confirm password is required'),
  })

  return (
    <Formik
      initialValues={{
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={signUpValidationSchema}
      onSubmit={(values, { resetForm }) => {
        SignUp(values, { resetForm });
        
      }}
    >
      {({ handleSubmit, isValid }) => (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={20}
          style={{ flex: 1 }}
        >
          <Shape source={require("../assets/shape.png")} />
          <Toast/>
          <ScrollView>
            <View style={styles.textContainer}>
              <CustomBigText text="Welcome Onboard!" style={styles.bigText} />
              <CustomSmallText
                style={styles.smallText}
                text="Let’s help you meet up your tasks"
              />
            </View>
            <View style={styles.formContainer}>


              <Field
                component={CustomInput}
                name="fullName"
                placeholder="Enter your full name"
              />
              <Field
                component={CustomInput}
                name="email"
                placeholder="Enter your email"
                keyboardType="email-address"
              />
              <Field
                component={CustomInput}
                keyboardType="default"
                secureTextEntry
                name="password"
                placeholder="Enter password"
              />
              <Field
                component={CustomInput}
                keyboardType="default"
                secureTextEntry
                name="confirmPassword"
                placeholder="Confirm password"
              />
            </View>
            <View style={styles.buttonContainer}>
              <CustomButton
                text="Register"
                style={styles.button}
                onPress={handleSubmit}
                disabled={!isValid}
              />
            </View>
            <View style={styles.bottomTextContainer}>
              <Text style={styles.alreadyText}>
                Already have an account ?
                <TouchableWithoutFeedback
                  onPress={() => {
                    navigation.navigate("Login");
                  }}
                >
                  <Text style={styles.signupText}> Sign In</Text>
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
  //Text Container Style
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: DeviceDimensions.height * 0.08,
  },

  smallText: {
    marginTop: DeviceDimensions.height * 0.0172,
  },

  //Button Container Style
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: DeviceDimensions.height * 0.0616,
  },

  button: {
    height: DeviceDimensions.height * 0.0764,
    width: DeviceDimensions.width * 0.87,
  },

  //Form Container Style
  formContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: DeviceDimensions.height * 0.0344,
  },

  bottomTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: DeviceDimensions.height * 0.0283,
  },

  //Already have an account ? Style
  alreadyText: {
    fontFamily: "poppins-regular",
    fontWeight: "400",
    letterSpacing: 1,
    fontSize: DeviceDimensions.height * 0.0172,
  },

  //Sign up Link Style
  signupText: {
    fontFamily: "poppins-bold",
    fontWeight: "400",
    color: Theme.button,
    letterSpacing: 1,
    fontSize: DeviceDimensions.height * 0.0172,
  },
});
export default RegistrationScreen;
