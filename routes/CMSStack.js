import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/CMS/Home';
import CalendarControl from '../screens/CMS/CalendarControl';
import AssignmentControl from '../screens/CMS/AssignmentControl';

const Stack = createStackNavigator();
const CMSStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={() => {
          return {
            headerTitle: 'CMS',
            headerTitleAlign: 'center',
            headerTitleStyle: {fontSize: 16},
            headerStyle: {
              borderBottomWidth: 0.8,
              borderColor: '#ddd',
            },
          };
        }}
        name="Home"
        component={Home}
      />
      <Stack.Screen
        options={() => {
          return {
            headerTitle: 'Academic Calendar Control',
            headerTitleAlign: 'center',
            headerTitleStyle: {fontSize: 16},
            headerStyle: {
              borderBottomWidth: 0.8,
              borderColor: '#ddd',
            },
          };
        }}
        name="CalendarControl"
        component={CalendarControl}
      />
      <Stack.Screen
        options={() => {
          return {
            headerTitle: 'Home Assignment Control',
            headerTitleAlign: 'center',
            headerTitleStyle: {fontSize: 16},
            headerStyle: {
              borderBottomWidth: 0.8,
              borderColor: '#ddd',
            },
          };
        }}
        name="AssignmentControl"
        component={AssignmentControl}
      />
    </Stack.Navigator>
  );
};

export default CMSStack;
