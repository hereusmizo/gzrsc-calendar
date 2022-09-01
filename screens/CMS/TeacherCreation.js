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
import getColor from '../../components/getColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logout} from '../../actions';
import {connect} from 'react-redux';
import api from '../../api/api';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PrimaryActiveButtonStyle from '../../components/PrimaryActiveButtonStyle';
import TextInputStyle from '../../components/TextInputStyle';

const TeacherCreation = ({logout}) => {
  const [id, setId] = useState(null);
  const [data, setData] = useState([]);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem('admin-auth');
    if (token) {
      try {
        const response = await api.get(`/api/malsawma/teacher`, {
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
    if (
      !formValues.name ||
      !formValues.email ||
      !formValues.password ||
      !formValues.confirm
    ) {
      if (formValues.password === formValues.confirm) {
        return ToastAndroid.showWithGravity(
          'Password must be exactly same! Please try again!',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        );
      }
      return ToastAndroid.showWithGravity(
        'Please fill up all the required fields!',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    }
    const token = await AsyncStorage.getItem('admin-auth');

    if (token) {
      try {
        if (id) {
          await api.patch(
            `/api/malsawma/teacher/${id}`,
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
            `/api/malsawma/teacher`,
            {...formValues},
            {
              headers: {
                Authorization: 'Bearer ' + token,
              },
            },
          );
        }
        fetchData();
        setOpenFormDialog(false);
        setFormValues({name: '', email: '', password: '', confirm: ''});
        return ToastAndroid.showWithGravity(
          'Submitted Successfully',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        );
      } catch (error) {
        if (error.response) {
          return ToastAndroid.showWithGravity(
            'Email Address already exists! Try another email.',
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
        await api.delete(`/api/malsawma/teacher/${deleteId}`, {
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
    if (data.length) {
      return data.map((item, index) => {
        return (
          <TouchableOpacity
            onLongPress={() => {
              Alert.alert('Teacher', item.name, [
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
              {index + 1}) {item.name}
            </Text>
            <Text style={{marginTop: 5}}>{item.email}</Text>
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
              name: '',
              email: '',
              password: '',
              confirm: '',
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
                Teacher Creation
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
                    name: '',
                    email: '',
                    password: '',
                    confirm: '',
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
                fontSize: 12,
                marginTop: 5,
                marginHorizontal: 10,
              }}>
              Name of Teacher *
            </Text>
            <TextInput
              placeholder="Name of Teacher"
              style={{...TextInputStyle, textAlignVertical: 'top'}}
              value={formValues.name}
              onChangeText={value => {
                setFormValues({
                  ...formValues,
                  name: value,
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
              Email Address *
            </Text>
            <TextInput
              keyboardType="email-address"
              placeholder="Email Address"
              style={{...TextInputStyle, textAlignVertical: 'top'}}
              value={formValues.email}
              onChangeText={value => {
                setFormValues({
                  ...formValues,
                  email: value,
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
              Password *
            </Text>
            <TextInput
              placeholder="Password"
              secureTextEntry
              //   keyboardType="visible-password"
              style={{...TextInputStyle, textAlignVertical: 'top'}}
              value={formValues.password}
              onChangeText={value => {
                setFormValues({
                  ...formValues,
                  password: value,
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
              Retype Password *
            </Text>
            <TextInput
              placeholder="Retype Password"
              style={{...TextInputStyle, textAlignVertical: 'top'}}
              value={formValues.confirm}
              onChangeText={value => {
                setFormValues({
                  ...formValues,
                  confirm: value,
                });
              }}
            />
          </ScrollView>
          <TouchableOpacity
            onPress={onSubmit}
            style={{
              ...PrimaryActiveButtonStyle,
              position: 'absolute',
              bottom: 20,
              left: 20,
              right: 20,
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
      <TouchableHighlight
        underlayColor={getColor.primaryUnderlay}
        onPress={() => {
          setOpenFormDialog(true);
        }}
        style={{...PrimaryActiveButtonStyle, marginTop: 10}}>
        <View>
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: 14,
            }}>
            Add New Teacher
          </Text>
        </View>
      </TouchableHighlight>
      <ScrollView style={{marginTop: 10}}>{renderData()}</ScrollView>
      {renderFormDialog()}
    </View>
  );
};

export default connect(null, {logout})(TeacherCreation);
