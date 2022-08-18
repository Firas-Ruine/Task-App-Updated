import { combineReducers, createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import authReducer from "../store/reducers/auth";
import taskReducer from "../store/reducers/tasks";
//Declaring the reducers of our app
const rootReducer = combineReducers({
    auth: authReducer,
    tasks: taskReducer,
});

//Add the reducers to store
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default store;