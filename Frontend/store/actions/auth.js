import AsyncStorage from "@react-native-async-storage/async-storage";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
import Api from '../../constants/Api'
import axios from 'axios';
import config from '../../config/config'
//Authentification Dispatch Function
export const authenticate = (userId, token, fullname) => {
  return (dispatch) => {
    dispatch({
      type: AUTHENTICATE,
      userId: userId,
      token: token,
      fullname: fullname,
    });
  };
};

//Sign Up Function
export const signup = (fullname, email, password, password_confirmation) => {
  return async (dispatch) => {
    axios.post(config.API_URL + "/register/", {
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
      console.log("Response: ", response.data)
      //Dispatch the response Data
      const responseData = response.data;
      dispatch(
        authenticate(responseData.user.id, responseData.user.fullname, responseData.token)
      );
      //Save data in the phone Memory
      saveDataToStorage(responseData.token);
    }).catch(error => {
      console.log('Error: ', error)
    });;

    //Dispatch the response Data
    const responseData = await response.json();
    
  };
};

//Sign In Function
export const login = (email, password) => {
  return async (dispatch) => {
    axios({
      method: 'post',
      url: Api.api + "/login/",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        email: email,
        password: password,
      },
    }).then(response => {
      console.log("Response: ", response.status)
      //Dispatch the response Data
      const responseData = response.data;
      dispatch(
        authenticate(responseData.user.id, responseData.token, responseData.user.fullname)
      );
      //Save data in the phone Memory
      saveDataToStorage(responseData.token);
      return responseData;
    }).catch(error => {
      console.log('Error: ', error)
    });
  };
};

//Logout Function
export const logout = () => {
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

//Sava Data in the memory Function
const saveDataToStorage = (token) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
    })
  );
};
