import {combineReducers} from 'redux';
import authReducer from './authReducer';
import decodedReducer from './decodedReducer';
export default combineReducers({
  auth: authReducer,
  decoded: decodedReducer,
});
