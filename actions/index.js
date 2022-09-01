import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

export const checkAuth = () => async dispatch => {
  try {
    // console.log(await AsyncStorage.getItem('student-auth'));
    if (await AsyncStorage.getItem('admin-auth')) {
      return dispatch({
        type: 'AUTH_ADMIN',
      });
    } else if (await AsyncStorage.getItem('teacher-auth')) {
      return dispatch({
        type: 'AUTH_TEACHER',
      });
    } else if (await AsyncStorage.getItem('student-auth')) {
      return dispatch({
        type: 'AUTH_STUDENT',
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
  } else if (await AsyncStorage.getItem('student-auth')) {
    token = await AsyncStorage.getItem('student-auth');
  } else if (await AsyncStorage.getItem('teacher-auth')) {
    token = await AsyncStorage.getItem('teacher-auth');
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

export const fetchCourse = () => async dispatch => {
  let token;
  if (await AsyncStorage.getItem('admin-auth')) {
    token = await AsyncStorage.getItem('admin-auth');
  } else if (await AsyncStorage.getItem('teacher-auth')) {
    token = await AsyncStorage.getItem('teacher-auth');
  } else if (await AsyncStorage.getItem('student-auth')) {
    token = await AsyncStorage.getItem('student-auth');
  } else {
    await AsyncStorage.clear();
    return dispatch({
      type: 'AUTH_FAIL',
    });
  }

  try {
    const response = await api.get(`/api/malsawma/course`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    return dispatch({
      type: 'FETCH_COURSE',
      payload: response.data.data,
    });
  } catch (error) {
    if (error.response === 401) {
      await AsyncStorage.clear();
      return dispatch({
        type: 'AUTH_FAIL',
      });
    }
    return dispatch({
      type: 'CLEAR_COURSE',
    });
  }
};

export const fetchProfile = () => async dispatch => {
  let token;
  let profile;
  if (await AsyncStorage.getItem('student-auth')) {
    token = await AsyncStorage.getItem('student-auth');
    profile = 'student';
  } else if (await AsyncStorage.getItem('admin-auth')) {
    token = await AsyncStorage.getItem('admin-auth');
    profile = 'user';
  } else if (await AsyncStorage.getItem('teacher-auth')) {
    token = await AsyncStorage.getItem('teacher-auth');
    profile = 'teacher';
  } else {
    await AsyncStorage.clear();
    return dispatch({
      type: 'AUTH_FAIL',
    });
  }
  const decoded = await jwt_decode(token);
  try {
    const response = await api.get(
      `/api/malsawma/profile/${profile}/${decoded.id}`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    );
    return dispatch({
      type: 'FETCH_PROFILE',
      payload: response.data.data,
    });
  } catch (error) {
    if (error.response === 401) {
      await AsyncStorage.clear();
      return dispatch({
        type: 'AUTH_FAIL',
      });
    }
    return dispatch({
      type: 'CLEAR_PROFILE',
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
