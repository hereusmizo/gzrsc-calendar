import {combineReducers} from 'redux';
import authReducer from './authReducer';
import courseReducer from './courseReducer';
import decodedReducer from './decodedReducer';
import profileReducer from './profileReducer';
export default combineReducers({
  auth: authReducer,
  decoded: decodedReducer,
  course: courseReducer,
  profile: profileReducer,
});
