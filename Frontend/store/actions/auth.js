import AsyncStorage from "@react-native-async-storage/async-storage";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
import axios from 'axios';
import config from '../../config/config'
//Authentification Dispatch Function
export const authenticate = (userId, fullname) => {
  return (dispatch) => {
    dispatch({
      type: AUTHENTICATE,
      userId: userId,
      fullname: fullname,
    });
  };
};

//Sign Up Function
export const signup = (fullname, email, password, password_confirmation) => {
  return async () => {
    await axios({
      method: 'post',
      url: config.API_URL + "/register/",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: ({
        fullname,
        email,
        password,
        password_confirmation,
      }),
    }).then(response => {
    }).catch(error => {
      let message = "Invalid credentials!";
      if (error.response.data.errors.email) {
        message = error.response.data.errors.email;
      } else {
        message = error.response.data.message;
      }
      throw new Error(message);
    });;

  };
};

//Sign In Function
export const login = (email, password) => {
  return async (dispatch) => {
    await axios({
      method: 'post',
      url: config.API_URL + "/login/",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        email: email,
        password: password,
      },
    }).then(response => {
      //Dispatch the response Data
      const responseData = response.data;
      dispatch(
        authenticate(responseData.user.id, responseData.user.fullname)
      );
      //Save data in the phone Memory
      saveDataToStorage(responseData.token);
    }).catch(error => {
      let message = "Invalid credentials!";
      if (error.response.data.message) {
        message = error.response.data.message;
      }
      throw new Error(message);
    });
  };
};



//Logout Function
export const logout = () => {
  return async () => {
    const userData = await AsyncStorage.getItem("userToken");
    const transformedData = JSON.parse(userData);
    const { token } = transformedData;
    await axios({
      method: 'post',
      url: config.API_URL + "/logout/",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        //Adding token to json
        Authorization: "Bearer " + token,
      },
    }).then(response => {
      console.log(response.data)
      AsyncStorage.removeItem("userToken");
      return { type: LOGOUT };
    }).catch(error => {
      let message = "There is an error!";
      if (error.response.data.message) {
        message = error.response.data.message;
      }
      throw new Error(message);
    });
  };
};

//Sava Data in the memory Function
const saveDataToStorage = async (token) => {
  await AsyncStorage.setItem(
    "userToken",
    JSON.stringify({
      token: token,
    })
  );
};
