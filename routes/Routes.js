import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  checkAuth,
  fetchCourse,
  fetchDecoded,
  fetchProfile,
  logout,
} from '../actions';
import Calendar from '../screens/Home';
import HomeAssignment from '../screens/HomeAssignment';
import AssignmentControl from '../screens/CMS/AssignmentControl';
import CalendarControl from '../screens/CMS/CalendarControl';
import Login from '../screens/Login';
import CMSStack from './CMSStack';
import StudentProfile from '../screens/StudentProfile';
import TeacherProfile from '../screens/TeacherProfile';
import UserList from '../screens/UserList';

const Tab = createBottomTabNavigator();
const Routes = props => {
  const {checkAuth, fetchDecoded, auth, fetchCourse, fetchProfile} = props;
  const initialRoute = 'HomeStack';

  useEffect(() => {
    checkAuth();
    if (auth) {
      fetchProfile();
      fetchDecoded();
      fetchCourse();
    }
  }, [auth]);

  if (auth === 1) {
    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            lazy: true,
            keyboardHidesTabBar: true,
            activeTintColor: 'black',
            tabBarActiveTintColor: 'black',
            headerShown: false,

            style: {
              paddingBottom: 5,
              paddingTop: 3,
            },
          }}>
          <Tab.Screen
            options={{
              headerTitle: 'Academic Calendar',
              headerShown: true,
              headerTitleAlign: 'center',
              headerTitleStyle: {fontSize: 16},
              headerStyle: {
                borderBottomWidth: 0.8,
                borderColor: '#ddd',
              },

              tabBarIcon: ({focused}) => {
                return (
                  <Icon
                    color="black"
                    name={focused ? 'calendar' : 'calendar-outline'}
                    size={30}
                  />
                );
              },
              tabBarLabel: 'Academic Calendar',
            }}
            name="Calendar"
            component={Calendar}
          />
          <Tab.Screen
            options={{
              headerTitle: 'Notice',
              headerShown: true,
              headerTitleAlign: 'center',
              headerTitleStyle: {fontSize: 16},
              headerStyle: {
                borderBottomWidth: 0.8,
                borderColor: '#ddd',
              },
              tabBarIcon: ({focused}) => {
                return (
                  <Icon
                    color="black"
                    name={focused ? 'folder-table' : 'folder-table-outline'}
                    size={30}
                  />
                );
              },
              tabBarLabel: 'Notice',
            }}
            name="HomeAssignment"
            component={HomeAssignment}
          />
          <Tab.Screen
            options={{
              headerTitle: 'User List',
              headerShown: true,
              headerTitleAlign: 'center',
              headerTitleStyle: {fontSize: 16},
              headerStyle: {
                borderBottomWidth: 0.8,
                borderColor: '#ddd',
              },
              tabBarIcon: ({focused}) => {
                return (
                  <Icon
                    color="black"
                    name={focused ? 'view-list' : 'view-list-outline'}
                    size={30}
                  />
                );
              },
              tabBarLabel: 'User List',
            }}
            name="UserList"
            component={UserList}
          />
          <Tab.Screen
            options={{
              tabBarIcon: ({focused}) => {
                return (
                  <Icon
                    color="black"
                    name={focused ? 'account-box' : 'account-box-outline'}
                    size={30}
                  />
                );
              },
              tabBarLabel: 'CMS',
            }}
            name="Login"
            component={CMSStack}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  } else if (auth === 2) {
    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            lazy: true,
            keyboardHidesTabBar: true,
            activeTintColor: 'black',
            tabBarActiveTintColor: 'black',
            headerShown: false,

            style: {
              paddingBottom: 5,
              paddingTop: 3,
            },
          }}>
          <Tab.Screen
            options={{
              headerTitle: 'Academic Calendar',
              headerShown: true,
              headerTitleAlign: 'center',
              headerTitleStyle: {fontSize: 16},
              headerStyle: {
                borderBottomWidth: 0.8,
                borderColor: '#ddd',
              },

              tabBarIcon: ({focused}) => {
                return (
                  <Icon
                    color="black"
                    name={focused ? 'calendar' : 'calendar-outline'}
                    size={30}
                  />
                );
              },
              tabBarLabel: 'Academic Calendar',
            }}
            name="Calendar"
            component={Calendar}
          />
          <Tab.Screen
            options={{
              headerTitle: 'Notice',
              headerShown: true,
              headerTitleAlign: 'center',
              headerTitleStyle: {fontSize: 16},
              headerStyle: {
                borderBottomWidth: 0.8,
                borderColor: '#ddd',
              },
              tabBarIcon: ({focused}) => {
                return (
                  <Icon
                    color="black"
                    name={focused ? 'folder-table' : 'folder-table-outline'}
                    size={30}
                  />
                );
              },
              tabBarLabel: 'Notice',
            }}
            name="HomeAssignment"
            component={HomeAssignment}
          />

          <Tab.Screen
            options={{
              headerTitle: 'My Profile',
              headerShown: true,
              headerTitleAlign: 'center',
              headerTitleStyle: {fontSize: 16},
              headerStyle: {
                borderBottomWidth: 0.8,
                borderColor: '#ddd',
              },
              tabBarIcon: ({focused}) => {
                return (
                  <Icon
                    color="black"
                    name={focused ? 'account-circle' : 'account-circle-outline'}
                    size={30}
                  />
                );
              },
              tabBarLabel: 'My Profile',
            }}
            name="StudentProfile"
            component={StudentProfile}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  } else if (auth === 3) {
    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            lazy: true,
            keyboardHidesTabBar: true,
            activeTintColor: 'black',
            tabBarActiveTintColor: 'black',
            headerShown: false,

            style: {
              paddingBottom: 5,
              paddingTop: 3,
            },
          }}>
          <Tab.Screen
            options={{
              headerTitle: 'Academic Calendar',
              headerShown: true,
              headerTitleAlign: 'center',
              headerTitleStyle: {fontSize: 16},
              headerStyle: {
                borderBottomWidth: 0.8,
                borderColor: '#ddd',
              },

              tabBarIcon: ({focused}) => {
                return (
                  <Icon
                    color="black"
                    name={focused ? 'calendar' : 'calendar-outline'}
                    size={30}
                  />
                );
              },
              tabBarLabel: 'Academic Calendar',
            }}
            name="Calendar"
            component={CalendarControl}
          />
          <Tab.Screen
            options={{
              headerTitle: 'Notice',
              headerShown: true,
              headerTitleAlign: 'center',
              headerTitleStyle: {fontSize: 16},
              headerStyle: {
                borderBottomWidth: 0.8,
                borderColor: '#ddd',
              },
              tabBarIcon: ({focused}) => {
                return (
                  <Icon
                    color="black"
                    name={focused ? 'folder-table' : 'folder-table-outline'}
                    size={30}
                  />
                );
              },
              tabBarLabel: 'Notice',
            }}
            name="HomeAssignment"
            component={AssignmentControl}
          />
          <Tab.Screen
            options={{
              headerTitle: 'User List',
              headerShown: true,
              headerTitleAlign: 'center',
              headerTitleStyle: {fontSize: 16},
              headerStyle: {
                borderBottomWidth: 0.8,
                borderColor: '#ddd',
              },
              tabBarIcon: ({focused}) => {
                return (
                  <Icon
                    color="black"
                    name={focused ? 'view-list' : 'view-list-outline'}
                    size={30}
                  />
                );
              },
              tabBarLabel: 'User List',
            }}
            name="UserList"
            component={UserList}
          />
          <Tab.Screen
            options={{
              headerTitle: 'My Profile',
              headerShown: true,
              headerTitleAlign: 'center',
              headerTitleStyle: {fontSize: 16},
              headerStyle: {
                borderBottomWidth: 0.8,
                borderColor: '#ddd',
              },
              tabBarIcon: ({focused}) => {
                return (
                  <Icon
                    color="black"
                    name={focused ? 'account-circle' : 'account-circle-outline'}
                    size={30}
                  />
                );
              },
              tabBarLabel: 'My Profile',
            }}
            name="TeacherProfile"
            component={TeacherProfile}
          />
          {/* <Tab.Screen
            options={{
              tabBarIcon: ({focused}) => {
                return (
                  <Icon
                    color="black"
                    name={focused ? 'account-box' : 'account-box-outline'}
                    size={30}
                  />
                );
              },
              tabBarLabel: 'CMS',
            }}
            name="Login"
            component={CMSStack}
          /> */}
        </Tab.Navigator>
      </NavigationContainer>
    );
  } else {
    return <Login />;
  }
};
const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};
export default connect(mapStateToProps, {
  checkAuth,
  fetchDecoded,
  fetchProfile,
  fetchCourse,
  logout,
})(Routes);
