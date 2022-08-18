import Task from "../../models/Task";
export const FETCH_TASKS = "FETCH_TASK";
export const CREATE_TASK = "CREATE_TASK";
export const DELETE_TASK = "DELETE_TASK";
import Api from '../../constants/Api'
import axios from 'axios';
import config from '../../config/config'
//Fetching the tasks from database
export const fetchTasks = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    axios({
      method:'get',
      url: Api.api + "/tasks",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        //Adding token to json
        Authorization: "Bearer " + token,
      },
    }).then(response => {
      console.log("Response: ", response.data)
      //Dispatch the response Data
      const responseData = response.data;
      const fetchedTasks = [];
      for (const key in responseData) {
        fetchedTasks.push(
          new Task(
            responseData[key].id,
            responseData[key].title,
            responseData[key].user_id
          ),
          console.log(fetchedTasks)
        );
      }
     
      dispatch({
        type: FETCH_TASKS,
        tasks: fetchedTasks,
      });

    }).catch(error => {
      console.log('Error: ', error)
    });
  };
};

//Create a new task
export const createTask = (title) => {
  return async (dispatch, getState) => {
    //Get the user Token
    const token = getState().auth.token;
    console.log(getState())
    axios({
      method: "post",
      url: Api.api + "/tasks",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        //Adding token to json
        Authorization: "Bearer " + token,
      },
      data: {
        title: title,
      }
    }).then(response => {
      console.log("Response: ", response.data)
      //Dispatch the response Data
      const responseData = response.data;
      dispatch({
        type: CREATE_TASK,
        taskData: {
          id: responseData.id,
          title: title,
          ownerId: responseData.user_id
        },
      });

    }).catch(error => {
      console.log('Error: ', error)
    });
  };
};

//Delete Task Function
export const deleteTask = (id) => {
  return async (dispatch, getState) => {
    //Get the user token
    const token = getState().auth.token;
    axios({
      method: 'delete',
      url: `${Api.api}/delete/${id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        //Adding token to json
        Authorization: "Bearer " + token,
      },
    }).then(response => {
      console.log("Response: ", response.data)
      //Dispatch the response Data
      dispatch({
        type: DELETE_TASK,
        id: id,
      });

    }).catch(error => {
      console.log('Error: ', error)
    });

    
  };
};
