import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Calendar} from 'react-native-calendars';
import dayjs from 'dayjs';
import getColor from '../components/getColor';
import api from '../api/api';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(
    dayjs(new Date()).format('YYYY-MM-DD'),
  );
  const [data, setData] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (data.length) {
      assignMarkDates();
    }
  }, [data.length]);
  const assignMarkDates = () => {
    let marked = {};
    data.forEach(async item => {
      marked = {
        ...marked,
        [dayjs(item.date).format('YYYY-MM-DD')]: {
          selected: true,
          selectedColor: getColor.success,
        },
      };
    });
    setMarkedDates(marked);
  };

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/malsawma/calendar`);
      setData(response.data.data);
    } catch (error) {
      setData([]);
    }
  };

  const renderData = () => {
    const selectedMonth = dayjs(selectedDate).format('MM');
    if (data.length) {
      return data
        .filter(item => dayjs(item.date).format('MM') === selectedMonth)
        .map(item => {
          return (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(item.title, item.body);
              }}
              key={item.id}
              style={{
                flex: 1,
                padding: 10,
                marginVertical: 5,
                marginHorizontal: 8,
                backgroundColor: 'white',
                borderColor: '#ddd',
                borderWidth: 0.5,
                elevation: 2,
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{flexShrink: 1}}>
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: 20,
                    color: getColor.primary,
                  }}>
                  {dayjs(item.date).format('DD')}
                </Text>
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    color: getColor.primary,
                  }}>
                  {dayjs(item.date).format('ddd')}
                </Text>
              </View>
              <View style={{flexGrow: 1, marginLeft: 15}}>
                <Text style={{fontWeight: '500', fontSize: 16}}>
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          );
        });
    }
  };

  return (
    <View style={{backgroundColor: '#fff', height: '100%'}}>
      <Calendar
        style={{marginTop: -10}}
        theme={{
          todayTextColor: '#fff',
          todayDotColor: getColor.primary,
          arrowColor: 'black',
          textMonthFontWeight: 'bold',
          'stylesheet.calendar.header': {
            week: {
              marginTop: 0,
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
          },
        }}
        markedDates={{
          [selectedDate]: {
            selected: true,
            marked: true,
            selectedColor: getColor.secondary,
            dotColor: getColor.secondary,
          },
          ...markedDates,
        }}
        current={selectedDate}
        onMonthChange={e => setSelectedDate(e.dateString)}
        monthFormat={'MMMM, yyyy'}
        disableAllTouchEventsForDisabledDays={true}
      />
      <View
        style={{
          borderBottomColor: '#ddd',
          borderBottomWidth: 1,
          marginBottom: 10,
        }}
      />

      <ScrollView style={{marginTop: 10}}>{renderData()}</ScrollView>
    </View>
  );
};

export default Home;
