import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logout} from '../actions';
import {connect} from 'react-redux';
import api from '../api/api';
import TextInputStyle from '../components/TextInputStyle';
import {Picker} from '@react-native-picker/picker';

const UserList = ({logout, course}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectCourse, setSelectCourse] = useState(null);
  const [data, setData] = useState([]);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  }, [refreshing]);
  useEffect(() => {
    if (selectCourse) fetchData();
    else setData([]);
  }, [selectCourse]);

  const fetchData = async () => {
    let token;
    if (await AsyncStorage.getItem('admin-auth'))
      token = await AsyncStorage.getItem('admin-auth');
    else if (await AsyncStorage.getItem('teacher-auth'))
      token = await AsyncStorage.getItem('teacher-auth');
    else token = null;
    if (token) {
      try {
        const response = await api.get(
          `/api/malsawma/student/${selectCourse}`,
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        );
        setData(response.data.data);
      } catch (error) {
        setData([]);
      }
    } else {
      return logout();
    }
  };

  const renderData = () => {
    if (data.length) {
      return data.map((item, index) => {
        return (
          <TouchableOpacity
            disabled
            // onLongPress={() => {
            //   Alert.alert(item.rollno, item.name, [
            //     {
            //       text: 'Delete',
            //       onPress: () => {
            //         onDelete(item.id);
            //       },
            //     },
            //     {
            //       text: 'Edit',
            //       onPress: () => {
            //         setId(item.id);
            //         setFormValues(item);
            //         setOpenFormDialog(true);
            //       },
            //     },
            //     {
            //       text: 'Close',
            //       style: 'cancel',
            //     },
            //   ]);
            // }}
            key={item.id}
            style={{
              flex: 1,
              padding: 8,
              marginVertical: 5,
              marginHorizontal: 8,
              backgroundColor: 'white',
              borderColor: '#ddd',
              borderWidth: 0.5,
              elevation: 2,
              borderRadius: 8,
            }}>
            <Text style={{fontWeight: '500'}}>Roll No. {item.rollno}</Text>
            <Text style={{marginTop: 5}}>Name: {item.name}</Text>
          </TouchableOpacity>
        );
      });
    } else {
      return (
        <View>
          <Text
            style={{textAlign: 'center', marginTop: 250, fontWeight: '500'}}>
            Please Select Any Course
          </Text>
        </View>
      );
    }
  };
  const renderCourse = () => {
    if (course.length) {
      return course.map(item => (
        <Picker.Item label={item.name} key={item.id} value={item.id} />
      ));
    }
  };

  return (
    <View style={{backgroundColor: '#fff', height: '100%'}}>
      <Text
        style={{
          color: 'black',
          fontSize: 12,
          marginTop: 5,
          marginHorizontal: 10,
        }}>
        Select Course
      </Text>
      <View style={{...TextInputStyle, padding: 0, height: 44}}>
        <Picker
          mode="dropdown"
          style={{marginTop: -5}}
          selectedValue={selectCourse}
          onValueChange={value => setSelectCourse(value)}>
          <Picker.Item label="-" value={null || ''} />
          {renderCourse()}
        </Picker>
      </View>

      <ScrollView
        style={{marginTop: 10}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {data.length ? (
          <Text
            style={{textAlign: 'center', fontWeight: '600', marginBottom: 5}}>
            TOTAL STUDENT: {data.length}
          </Text>
        ) : (
          ''
        )}

        {renderData()}
      </ScrollView>
    </View>
  );
};
const mapStateToProps = state => {
  return {course: state.course};
};
export default connect(mapStateToProps, {logout})(UserList);
