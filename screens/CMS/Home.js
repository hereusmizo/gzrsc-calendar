import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import React from 'react';
import getColor from '../../components/getColor';
import {logout} from '../../actions';
import {connect} from 'react-redux';

const Home = ({logout, navigation}) => {
  const OPTIONS = [
    {
      id: 1,
      name: 'Academic Calendar Control',
      route: 'CalendarControl',
    },
    {
      id: 2,
      name: 'Home Assignment Control',
      route: 'AssignmentControl',
    },
    {
      id: 4,
      name: 'Course Creation',
      route: 'CourseCreation',
    },
    {
      id: 5,
      name: 'Student Creation',
      route: 'StudentCreation',
    },
    {
      id: 6,
      name: 'Teacher Creation',
      route: 'TeacherCreation',
    },
    {
      id: 3,
      name: 'Logout',
    },
  ];
  return (
    <ScrollView
      style={{backgroundColor: 'white', display: 'flex', flexGrow: 1}}>
      <View
        style={{
          alignItems: 'center',
        }}>
        <Image
          source={require('../../assets/logo.png')}
          style={{height: 80, width: 80, marginTop: 10, marginBottom: 20}}
        />
      </View>
      {OPTIONS.map(item => {
        return (
          <TouchableOpacity
            onPress={() => {
              if (item.id === 3) {
                logout();
              } else {
                navigation.navigate(item.route);
              }
            }}
            key={item.id}
            style={{
              flex: 1,
              marginHorizontal: 10,
              marginVertical: 10,
              elevation: 5,
              borderColor: '#ddd',
              borderWidth: 0.5,
              backgroundColor:
                item.id === 3 ? getColor.secondary : getColor.primary,
              borderRadius: 5,
              padding: 15,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontWeight: '500',
                fontSize: 16,
              }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default connect(null, {logout})(Home);
