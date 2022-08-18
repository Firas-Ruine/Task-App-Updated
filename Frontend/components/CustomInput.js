import { View, TextInput, StyleSheet, Text, Dimensions } from "react-native";
import React, { useReducer, useEffect } from "react";
import Theme from "../constants/Theme";
import DeviceDimensions from "../constants/DeviceDimensions";

const CustomInput = (props) => {
  const {
    field: { name, onBlur, onChange, value },
    form: { errors, touched, setFieldTouched },
    ...inputProps
  } = props
  const hasError = errors[name] && touched[name]
  return (
    <View style={styles.container}>
      <TextInput
        style={{ ...styles.input, ...props.style }}
        value={value}
        onChangeText={(text) => onChange(name)(text)}
        onBlur={() => {
          setFieldTouched(name)
          onBlur(name)
        }}
        {...inputProps}
      />
      <View
        style={{
          alignItems: "flex-start",
          justifyContent: "flex-start",
          marginLeft: Dimensions.get("screen").width * 0.03,
        }}
      >
        {hasError && <Text style={styles.errorText}>{errors[name]}</Text>}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    backgroundColor: Theme.white,
    width: DeviceDimensions.width * 0.866,
    height: DeviceDimensions.height * 0.0628,
    borderRadius: 22,
    paddingHorizontal: DeviceDimensions.width * 0.0667,
    marginTop: DeviceDimensions.height * 0.0259,
    fontFamily: "poppins-regular",
    fontSize: DeviceDimensions.height * 0.016,
    color: "rgba(0, 0, 0, 0.7)",
    letterSpacing: 1,
  },
  errorText: {
    fontSize: DeviceDimensions.height * 0.013,
    color: "#D24141",
    textAlign: "right",
  },
});
export default CustomInput;
