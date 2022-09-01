import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import React from 'react';
import {connect} from 'react-redux';
import {logout} from '../actions';
import getColor from '../components/getColor';

const StudentProfile = ({profile, course, logout}) => {
  if (Object.keys(profile).length) {
    const foundCourse = course.length
      ? course.find(item => item.id === profile.course)
      : null;
    const renderData = () => {
      return (
        <>
          <View
            style={{
              display: 'flex',
              marginHorizontal: 20,
              marginVertical: 5,
              flexDirection: 'row',
            }}>
            <View style={{flex: 1}}>
              <Text>Student Roll Number:</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={{textAlign: 'right', fontWeight: '500'}}>
                {profile.rollno}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              marginHorizontal: 20,
              marginVertical: 5,
              flexDirection: 'row',
            }}>
            <View style={{flex: 1}}>
              <Text>Student Name:</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={{textAlign: 'right', fontWeight: '500'}}>
                {profile.name}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              marginHorizontal: 20,
              marginVertical: 5,
              flexDirection: 'row',
            }}>
            <View style={{flex: 1}}>
              <Text>Course:</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={{textAlign: 'right', fontWeight: '500'}}>
                {foundCourse ? foundCourse.name : ''}
              </Text>
            </View>
          </View>
        </>
      );
    };
    return (
      <View style={{backgroundColor: '#fff', height: '100%'}}>
        <ScrollView style={{marginTop: 10}}>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 10,
              marginBottom: 20,
            }}>
            <Image
              style={{
                width: 80,
                height: 80,
              }}
              source={require('../assets/default-user.png')}
            />
          </View>
          {renderData()}

          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Logout Account?',
                'Are you sure you want to logout your account?',
                [
                  {
                    text: 'Yes',
                    onPress: async () => {
                      return logout();
                    },
                  },
                  {
                    text: 'No',
                    style: 'cancel',
                  },
                ],
              );
            }}
            style={{
              flex: 1,
              marginHorizontal: 10,
              marginTop: 30,
              elevation: 5,

              borderColor: '#ddd',
              borderWidth: 0.5,
              backgroundColor: getColor.secondary,
              borderRadius: 5,
              padding: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontWeight: '500',
                fontSize: 16,
              }}>
              Logout
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  } else {
    return (
      <View style={{backgroundColor: '#fff', height: '100%'}}>
        <Text>Please Wait...</Text>
      </View>
    );
  }
};
const mapStateToProps = state => {
  return {profile: state.profile, course: state.course};
};
export default connect(mapStateToProps, {logout})(StudentProfile);
