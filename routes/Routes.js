import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {checkAuth, fetchDecoded, logout} from '../actions';
import Calendar from '../screens/Home';
import Login from '../screens/Login';
import CMSStack from './CMSStack';

const Tab = createBottomTabNavigator();
const Routes = props => {
  const {checkAuth, fetchDecoded, auth} = props;
  const initialRoute = 'HomeStack';

  useEffect(() => {
    checkAuth();
    if (auth) {
      fetchDecoded();
    }
  }, [auth]);

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
            headerTitle: 'Home Assignment',
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
            tabBarLabel: 'Home Assignment',
          }}
          name="HomeAssignment"
          component={Calendar}
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
          component={auth ? CMSStack : Login}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};
export default connect(mapStateToProps, {
  checkAuth,
  fetchDecoded,
  logout,
})(Routes);
