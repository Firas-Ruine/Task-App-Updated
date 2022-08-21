import React, { useReducer, useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Alert,
  Modal,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CustomBigText from "../components/CustomBigText";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import CustomSmallText from "../components/CustomSmallText";
import Shape from "../components/Shape";
import Task from "../components/Task";
import DeviceDimensions from "../constants/DeviceDimensions";
import Theme from "../constants/Theme";
import * as authActions from "../store/actions/auth";
import * as taskActions from "../store/actions/tasks";
import { Formik, Field } from 'formik'
import * as yup from 'yup'
import Toast from 'react-native-toast-message'

const TasksScreen = ({ navigation }) => {
  const [error, setError] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [taskSelected, setTaskSelected] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fullname = useSelector((state) => state.auth.fullname);
  const tasks = useSelector(state => state.tasks.fetchedTasks);

  //Dispatch the error
  const dispatch = useDispatch();
  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'An error occured!',
        visibilityTime: 4000,
        autoHide: true
      })
    }
  }, [error]);

  //Fetch Tasks Function
  const fetchTasks = useCallback(async () => {
    try {
      setError(null);
      setIsRefreshing(true);
      dispatch(taskActions.fetchTasks());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing, setError]);

  // init
  useEffect(() => {
    fetchTasks();
  }, [dispatch, fetchTasks]);

  //Add Task Function
  const addTask = async (values, { resetForm }) => {
    action = taskActions.createTask(values.title);
    setError(null);
    try {
      await dispatch(action);
      Toast.show({
        type: 'success',
        text1: 'Task Added Successfully!',
        visibilityTime: 4000,
        autoHide: true
      })
      resetForm({ values: '' });
    } catch (err) {
      setError(err);
    }
  };

  //Delete task function
  const deleteTask = async (id) => {
    action = taskActions.deleteTask(id)
    try {
      await dispatch(action);
      Toast.show({
        type: 'success',
        text1: 'Your task is done!',
        visibilityTime: 4000,
        autoHide: true
      })
    } catch (err) {
      console.log(err)
    }
  };

  //Validation with yup
  const taskValidationSchema = yup.object().shape({
    title: yup
      .string()
      .required('Title is required'),
  })

  return (
    <Formik
      initialValues={{
        title: ''
      }}
      validationSchema={taskValidationSchema}
      onSubmit={(values, { resetForm }) => {
        addTask(values, { resetForm });
      }}
    >
      {({ handleSubmit, isValid }) => (

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={10}
          enabled={false}
          style={{ flex: 1 }}
        >
          <View style={styles.container}>
            <Shape source={require("../assets/shapeTask.png")} />
            <Toast />
            <View style={styles.userContainer}>
              <Image
                resizeMode="contain"
                style={styles.userImage}
                source={require("../assets/Firas.jpg")}
              />
              <View style={styles.nameTextContainer}>
                <CustomBigText
                  text={"Welcome, " + fullname}
                  style={styles.nameText}
                />
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.formContainer}>
              <Field
                component={CustomInput}
                name="title"
                placeholder="Add a new task"
              />
            </View>
            <View style={styles.buttonContainer}>
              <CustomButton text="ADD" style={styles.button} onPress={handleSubmit} disabled={!isValid} />
            </View>
            <View style={{ flex: 1 }}>
              <CustomBigText text="Tasks List" style={styles.taskText} />
            </View>
            <View style={styles.cardContainer}>
              <View style={styles.Card}>
                <CustomSmallText text="Tasks List" style={styles.cardText} />
                <FlatList
                  onRefresh={fetchTasks}
                  refreshing={isRefreshing}
                  style={styles.flatList}
                  data={tasks}
                  renderItem={(itemData) => (
                    <Task
                      key={itemData.item.id}
                      title={itemData.item.title}
                      onValueChange={() => {
                        setTaskSelected(itemData.item.id);
                        setModalVisible(true);
                      }}
                    />
                  )}
                />
              </View>
              <Text
                style={styles.logout}
                onPress={() => {
                  dispatch(authActions.logout());
                  navigation.navigate("Login");
                }}
              >
                LOGOUT
              </Text>
              <View style={styles.centeredView}>
                <Modal
                  animationType="none"
                  transparent={true}
                  visible={modalVisible}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>This task is Done ?</Text>
                      <View style={styles.modalButtonContainer}>
                        <Pressable
                          style={styles.buttonNotyet}
                          onPress={() => setModalVisible(!modalVisible)}
                        >
                          <Text style={styles.textStyle}>Not yet</Text>
                        </Pressable>
                        <Pressable
                          style={styles.buttonYes}
                          onPress={() => {
                            deleteTask(taskSelected);
                            fetchTasks();
                            setModalVisible(!modalVisible);
                          }}
                        >
                          <Text style={styles.textStyle}>Yes</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  //Modal Style
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.background,
    borderRadius: 20,
    width: DeviceDimensions.width * 0.64,
    height: DeviceDimensions.height * 0.13,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalText: {
    fontFamily: "poppins-regular",
    fontWeight: "400",
    color: "#000",
    textAlign: "center",
    fontSize: DeviceDimensions.height * 0.0222,
    marginTop: DeviceDimensions.height * 0.0185,
  },

  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: DeviceDimensions.height * 0.0246,
  },

  buttonYes: {
    borderRadius: 10,
    backgroundColor: Theme.primary,
    height: DeviceDimensions.height * 0.0431,
    width: DeviceDimensions.width * 0.24,
    justifyContent: "center",
    marginLeft: 15,
  },

  buttonNotyet: {
    borderRadius: 10,
    backgroundColor: Theme.primary,
    height: DeviceDimensions.height * 0.0431,
    width: DeviceDimensions.width * 0.24,
    justifyContent: "center",
  },

  textStyle: {
    textAlign: "center",
    color: Theme.white,
    fontSize: DeviceDimensions.height * 0.0185,
    fontFamily: "poppins-bold",
  },

  //Green Container Style
  container: {
    backgroundColor: Theme.button,
    height: DeviceDimensions.height * 0.37,
  },

  //Image and welcome text container Style
  userContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  //Static image Style
  userImage: {
    width: DeviceDimensions.width * 0.2667,
    height: DeviceDimensions.width * 0.2667,
    borderRadius: DeviceDimensions.width * 0.2667,
    borderWidth: 3,
    borderColor: "#2B8E94",
    position: "relative",
    marginTop: -DeviceDimensions.height * 0.1,
  },

  //User Name Container Style
  nameTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: DeviceDimensions.height * 0.0259,
  },

  //User Name Text Style
  nameText: {
    color: Theme.white,
  },

  //Task Text Style
  taskText: {
    marginHorizontal: DeviceDimensions.width * 0.0747,
    marginTop: DeviceDimensions.height * 0.0185,
  },

  //Form Container Style
  formContainer: {
    alignItems: "center",
    justifyContent: "center",
    //marginTop: DeviceDimensions.height * 0.0025,
    flex: 1,
  },

  //Button Container Style
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: DeviceDimensions.height * 0.0222,
    flex: 1,
  },

  //Button Style
  button: {
    height: DeviceDimensions.height * 0.0554,
    width: DeviceDimensions.width * 0.79,
  },

  //Card Container Style
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  //Card Text Style
  cardText: {
    paddingTop: DeviceDimensions.height * 0.0259,
    paddingHorizontal: DeviceDimensions.width * 0.056,
    fontSize: DeviceDimensions.height * 0.0197,
    fontSize: DeviceDimensions.height * 0.0172,
    textAlign: "left",
  },

  //Card Style
  Card: {
    backgroundColor: "#fff",
    width: DeviceDimensions.width * 0.86,
    height: DeviceDimensions.height * 0.305,
    elevation: 4,
    borderRadius: 24,
  },

  //FlatList Style
  flatList: {
    marginHorizontal: DeviceDimensions.width * 0.056,
    marginVertical: DeviceDimensions.height * 0.0259,
  },

  //Logout Link Style
  logout: {
    color: "#D24141",
    marginVertical: DeviceDimensions.height * 0.0246,
    fontFamily: "poppins-regular",
    fontSize: DeviceDimensions.height * 0.0172,
    letterSpacing: 1,
  },
});

export default TasksScreen;
