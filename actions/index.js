import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkAuth = () => async dispatch => {
  try {
    if (await AsyncStorage.getItem('admin-auth')) {
      return dispatch({
        type: 'AUTH_ADMIN',
      });
    } else {
      return dispatch({
        type: 'AUTH_FAIL',
      });
    }
  } catch (error) {
    await AsyncStorage.clear();
    return dispatch({
      type: 'AUTH_FAIL',
    });
  }
};

export const fetchDecoded = () => async dispatch => {
  let token;
  if (await AsyncStorage.getItem('admin-auth')) {
    token = await AsyncStorage.getItem('admin-auth');
  } else if (await AsyncStorage.getItem('user-auth')) {
    token = await AsyncStorage.getItem('user-auth');
  } else {
    await AsyncStorage.clear();
    return dispatch({
      type: 'AUTH_FAIL',
    });
  }
  const decoded = await jwt_decode(token);
  try {
    return dispatch({
      type: 'FETCH_DECODED',
      payload: decoded,
    });
  } catch (error) {
    return dispatch({
      type: 'CLEAR_DECODED',
    });
  }
};

export const logout = () => async dispatch => {
  await AsyncStorage.clear();
  dispatch({
    type: 'CLEAR_PROFILE',
  });
  dispatch({
    type: 'CLEAR_DECODED',
  });
  return dispatch({
    type: 'AUTH_FAIL',
  });
};
