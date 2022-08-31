import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  Modal,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Calendar} from 'react-native-calendars';
import dayjs from 'dayjs';
import getColor from '../../components/getColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logout} from '../../actions';
import {connect} from 'react-redux';
import api from '../../api/api';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PrimaryActiveButtonStyle from '../../components/PrimaryActiveButtonStyle';
import TextInputStyle from '../../components/TextInputStyle';

const CalendarControl = ({logout}) => {
  const [selectedDate, setSelectedDate] = useState(
    dayjs(new Date()).format('YYYY-MM-DD'),
  );
  const [id, setId] = useState(null);
  const [data, setData] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [formValues, setFormValues] = useState({
    title: '',
    body: '',
  });
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
    const token = await AsyncStorage.getItem('admin-auth');
    if (token) {
      try {
        const response = await api.get(`/api/malsawma/calendar`, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        setData(response.data.data);
      } catch (error) {
        setData([]);
      }
    } else {
      return logout();
    }
  };

  const onSubmit = async () => {
    if (!formValues.title) {
      return ToastAndroid.showWithGravity(
        'Cannot submit empty title event',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    }
    const token = await AsyncStorage.getItem('admin-auth');

    if (token) {
      try {
        if (id) {
          await api.patch(
            `/api/malsawma/calendar/${id}`,
            {...formValues},
            {
              headers: {
                Authorization: 'Bearer ' + token,
              },
            },
          );
          setId(null);
        } else {
          await api.post(
            `/api/malsawma/calendar`,
            {...formValues, date: dayjs(selectedDate).format('YYYY-MM-DD')},
            {
              headers: {
                Authorization: 'Bearer ' + token,
              },
            },
          );
        }
        fetchData();
        setOpenFormDialog(false);
        setFormValues({title: '', body: ''});
        return ToastAndroid.showWithGravity(
          'Submitted Successfully',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        );
      } catch (error) {
        if (error.response) {
          return ToastAndroid.showWithGravity(
            'Sorry something went wrong! Please try again!',
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
      return logout();
    }
  };
  const onDelete = async deleteId => {
    const token = await AsyncStorage.getItem('admin-auth');

    if (token) {
      try {
        await api.delete(`/api/malsawma/calendar/${deleteId}`, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });

        fetchData();

        return ToastAndroid.showWithGravity(
          'Deleted Successfully',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        );
      } catch (error) {
        if (error.response) {
          return ToastAndroid.showWithGravity(
            'Sorry something went wrong! Please try again!',
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
      return logout();
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
              onLongPress={() => {
                Alert.alert(item.title, item.body, [
                  {
                    text: 'Delete',
                    onPress: () => {
                      onDelete(item.id);
                    },
                  },
                  {
                    text: 'Edit',
                    onPress: () => {
                      setId(item.id);
                      setFormValues(item);
                      setOpenFormDialog(true);
                    },
                  },
                  {
                    text: 'Close',
                    style: 'cancel',
                  },
                ]);
              }}
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
              <Text style={{fontWeight: '500'}}>
                Date: {dayjs(item.date).format('DD MMMM YYYY')}
              </Text>
              <Text style={{fontWeight: '500'}}>{item.title}</Text>
              <Text style={{marginTop: 5}}>{item.body}</Text>
            </TouchableOpacity>
          );
        });
    }
  };

  const renderFormDialog = () => {
    if (openFormDialog) {
      return (
        <Modal
          animationType="slide"
          visible={openFormDialog}
          onRequestClose={() => {
            setId(null);
            setOpenFormDialog(false);
            setFormValues({
              title: '',
              body: '',
            });
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              marginTop: 10,
            }}>
            <View
              style={{
                flexGrow: 1,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  marginLeft: 10,
                }}>
                New Calendar Event
              </Text>
            </View>
            <View
              style={{
                marginRight: 8,
                flexShrink: 1,
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setId(null);
                  setOpenFormDialog(false);
                  setFormValues({
                    title: '',
                    body: '',
                  });
                }}>
                <AntDesign name="closecircleo" size={25} />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              borderBottomColor: '#ddd',
              borderBottomWidth: 1,
              marginVertical: 12,
            }}
          />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{
              height: Dimensions.get('window').height,
              marginHorizontal: 8,
              marginBottom: 70,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                textAlign: 'center',
                fontWeight: '500',

                marginHorizontal: 10,
              }}>
              Date: {dayjs(selectedDate).format('DD MMMM YYYY')}
            </Text>
            <Text
              style={{
                color: 'black',
                fontSize: 12,
                marginTop: 5,
                marginHorizontal: 10,
              }}>
              Title of Event *
            </Text>
            <TextInput
              placeholder="Title of Event"
              style={{...TextInputStyle, textAlignVertical: 'top'}}
              value={formValues.title}
              onChangeText={value => {
                setFormValues({
                  ...formValues,
                  title: value,
                });
              }}
            />
            <Text
              style={{
                color: 'black',
                fontSize: 12,
                marginTop: 5,
                marginHorizontal: 10,
              }}>
              Description of event
            </Text>
            <TextInput
              multiline
              numberOfLines={10}
              placeholder="Description of event..."
              style={{...TextInputStyle, textAlignVertical: 'top'}}
              value={formValues.body}
              onChangeText={value => {
                setFormValues({
                  ...formValues,
                  body: value,
                });
              }}
            />
          </ScrollView>
          <TouchableOpacity
            onPress={onSubmit}
            style={{
              ...PrimaryActiveButtonStyle,
              marginTop: 20,
              marginBottom: 50,
              marginHorizontal: 10,
            }}>
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              {id ? 'Update' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </Modal>
      );
    }
  };
  return (
    <View style={{backgroundColor: '#fff', height: '100%'}}>
      <Calendar
        style={{marginTop: -10}}
        theme={{
          todayTextColor: '#fff',
          todayBackgroundColor: getColor.primary,
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
        onDayPress={e => {
          setSelectedDate(e.dateString);
        }}
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
      <TouchableHighlight
        underlayColor={getColor.primaryUnderlay}
        onPress={() => {
          setOpenFormDialog(true);
        }}
        style={PrimaryActiveButtonStyle}>
        <View>
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: 14,
            }}>
            Add Event
          </Text>
        </View>
      </TouchableHighlight>
      <ScrollView style={{marginTop: 10}}>{renderData()}</ScrollView>
      {renderFormDialog()}
    </View>
  );
};

export default connect(null, {logout})(CalendarControl);
