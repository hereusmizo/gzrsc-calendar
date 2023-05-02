import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/CMS/Home';
import CalendarControl from '../screens/CMS/CalendarControl';
import AssignmentControl from '../screens/CMS/AssignmentControl';
import CourseCreation from '../screens/CMS/CourseCreation';
import TeacherCreation from '../screens/CMS/TeacherCreation';
import StudentCreation from '../screens/CMS/StudentCreation';

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
            headerTitle: 'Notice Control',
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
      <Stack.Screen
        options={() => {
          return {
            headerTitle: 'Course Creation',
            headerTitleAlign: 'center',
            headerTitleStyle: {fontSize: 16},
            headerStyle: {
              borderBottomWidth: 0.8,
              borderColor: '#ddd',
            },
          };
        }}
        name="CourseCreation"
        component={CourseCreation}
      />
      <Stack.Screen
        options={() => {
          return {
            headerTitle: 'Student Creation',
            headerTitleAlign: 'center',
            headerTitleStyle: {fontSize: 16},
            headerStyle: {
              borderBottomWidth: 0.8,
              borderColor: '#ddd',
            },
          };
        }}
        name="StudentCreation"
        component={StudentCreation}
      />
      <Stack.Screen
        options={() => {
          return {
            headerTitle: "Students' Union",
            headerTitleAlign: 'center',
            headerTitleStyle: {fontSize: 16},
            headerStyle: {
              borderBottomWidth: 0.8,
              borderColor: '#ddd',
            },
          };
        }}
        name="TeacherCreation"
        component={TeacherCreation}
      />
    </Stack.Navigator>
  );
};

export default CMSStack;
