import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  ToastAndroid,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';

import {TextInput} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {checkAuth} from '../actions';
import HideKeyboard from '../components/HideKeyboard';
import getColor from '../components/getColor';
import {Picker} from '@react-native-picker/picker';
import TextInputStyle from '../components/TextInputStyle';
import PrimaryActiveButtonStyle from '../components/PrimaryActiveButtonStyle';
import PrimaryInactiveButtonStyle from '../components/PrimaryInactiveButtonStyle';
import api from '../api/api';

const Login = ({checkAuth}) => {
  const ref1 = useRef();
  const [selectUser, setSelectUser] = useState('Student');
  const [isWait, setIsWait] = useState(false);
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
  });

  const onSubmit = async () => {
    if (formValues.username && formValues.password) {
      try {
        setIsWait(true);
        if (selectUser === 'Student') {
          const response = await api.post(`/api/malsawma/login/student`, {
            ...formValues,
            rollno: formValues.username,
          });
          await AsyncStorage.setItem('student-auth', response.data.token);
        } else if (selectUser === 'SU') {
          const response = await api.post(`/api/malsawma/login/teacher`, {
            ...formValues,
            email: formValues.username,
          });
          await AsyncStorage.setItem('teacher-auth', response.data.token);
        } else {
          const response = await api.post(`/api/malsawma/login/user`, {
            ...formValues,
          });
          await AsyncStorage.setItem('admin-auth', response.data.token);
        }
        setFormValues({username: '', password: ''});
        setIsWait(false);
        ToastAndroid.showWithGravity(
          'Authentication Success',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
        setTimeout(() => checkAuth(), 300);
      } catch (error) {
        setIsWait(false);
        if (error.response) {
          return ToastAndroid.showWithGravity(
            error.response.data.message,
            ToastAndroid.LONG,
            ToastAndroid.TOP,
          );
        }
        return ToastAndroid.showWithGravity(
          'Something went wrong. Please check your internet connectivity',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        );
      }
    } else {
      return ToastAndroid.showWithGravity(
        'Please fill up all the fields',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    }
  };

  return (
    <HideKeyboard>
      <ScrollView
        style={{
          display: 'flex',
          backgroundColor: '#fff',
          paddingHorizontal: 12,
          height: Dimensions.get('window').height,
        }}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/logo.png')}
            style={{height: 130, width: 130, marginTop: 40}}
          />
        </View>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 10,
            fontWeight: 'bold',
            fontSize: 18,
          }}>
          GZRSC Students' App
        </Text>
        <View
          style={{
            borderWidth: 0.8,
            borderColor: '#eee',
            borderRadius: 5,
            backgroundColor: '#fff',
            elevation: 3,
            marginTop: 15,
          }}>
          <Text
            style={{
              marginLeft: 10,
              color: '#5A5353',
              fontSize: 20,
              fontWeight: '500',
              marginTop: 20,
            }}>
            Sign In
          </Text>
          <Text
            style={{
              color: 'black',
              fontSize: 12,
              marginTop: 5,
              marginHorizontal: 10,
            }}>
            Select User Type
          </Text>
          <View style={{...TextInputStyle, padding: 0, height: 44}}>
            <Picker
              mode="dropdown"
              style={{marginTop: -5}}
              selectedValue={selectUser}
              onValueChange={value => setSelectUser(value)}>
              <Picker.Item label="Student" value={'Student'} />
              <Picker.Item label="Students' Union" value={'SU'} />
              <Picker.Item label="Admin" value={'Admin'} />
            </Picker>
          </View>
          <Text
            style={{
              color: 'black',
              fontSize: 12,
              marginTop: 5,
              marginHorizontal: 10,
            }}>
            {selectUser === 'Admin'
              ? 'Username'
              : selectUser === 'SU'
              ? 'Email ID'
              : 'Roll Number'}
          </Text>
          <TextInput
            style={TextInputStyle}
            placeholder={
              selectUser === 'Admin'
                ? 'Username'
                : selectUser === 'SU'
                ? 'Email ID'
                : 'Roll Number'
            }
            value={formValues.username}
            onChangeText={value =>
              setFormValues({...formValues, username: value})
            }
            returnKeyType="next"
            onSubmitEditing={() => ref1.current.focus()}
          />
          <Text
            style={{
              color: 'black',
              fontSize: 12,
              marginTop: 5,
              marginHorizontal: 10,
            }}>
            Password
          </Text>
          <TextInput
            style={TextInputStyle}
            placeholder="Password"
            secureTextEntry
            value={formValues.password}
            onChangeText={value =>
              setFormValues({...formValues, password: value})
            }
            ref={ref1}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />

          <View style={{marginVertical: 20}}>
            <TouchableHighlight
              disabled={isWait}
              underlayColor={getColor.primaryUnderlay}
              onPress={onSubmit}
              style={
                isWait ? PrimaryInactiveButtonStyle : PrimaryActiveButtonStyle
              }>
              <View>
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    fontWeight: '700',
                    fontSize: 16,
                  }}>
                  {isWait ? 'Please Wait' : 'Sign In'}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </ScrollView>
    </HideKeyboard>
  );
};

export default connect(null, {checkAuth})(Login);
