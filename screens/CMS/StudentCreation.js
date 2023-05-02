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
import {Picker} from '@react-native-picker/picker';
import Barcode from 'react-native-barcode-builder';

const StudentCreation = ({logout, course}) => {
  const [id, setId] = useState(null);
  const [selectCourse, setSelectCourse] = useState(null);
  const [data, setData] = useState([]);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    rollno: '',
    course: '',
    password: '',
    confirm: '',
    contact: '',
    library_id: '',
  });
  useEffect(() => {
    if (selectCourse) fetchData();
    else setData([]);
  }, [selectCourse]);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem('admin-auth');
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

  const onSubmit = async () => {
    if (
      !formValues.name ||
      !formValues.rollno ||
      !formValues.course ||
      !formValues.contact ||
      !formValues.password ||
      !formValues.confirm
    ) {
      return ToastAndroid.showWithGravity(
        'Please fill up all the required fields!',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    }
    if (formValues.password !== formValues.confirm) {
      return ToastAndroid.showWithGravity(
        'Password must be exactly same! Please try again!',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    }
    const token = await AsyncStorage.getItem('admin-auth');

    if (token) {
      try {
        if (id) {
          await api.patch(
            `/api/malsawma/student/${id}`,
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
            `/api/malsawma/student`,
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
        setFormValues({
          name: '',
          rollno: '',
          course: '',
          password: '',
          confirm: '',
          contact: '',
          library_id: '',
        });
        return ToastAndroid.showWithGravity(
          'Submitted Successfully',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        );
      } catch (error) {
        if (error.response) {
          return ToastAndroid.showWithGravity(
            'Roll No. already exists! Try another email.',
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
        await api.delete(`/api/malsawma/student/${deleteId}`, {
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
              Alert.alert(item.rollno, `${item.name} (${item.contact})`, [
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
              {index + 1}
              {')'} {item.rollno}
            </Text>
            <Text style={{marginTop: 5}}>{item.name}</Text>
            <Text style={{marginTop: 5, marginBottom: 10}}>
              Contact: {item.contact}
            </Text>

            {item.library_id && (
              <Barcode
                height={60}
                value={item.library_id}
                format="CODE128"
                width={5}
                text={`Library ID: ${item.library_id}`}
              />
            )}
          </TouchableOpacity>
        );
      });
    }
  };
  const renderCourse = () => {
    if (course.length) {
      return course.map(item => (
        <Picker.Item label={item.name} key={item.id} value={item.id} />
      ));
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
              rollno: '',
              course: '',
              password: '',
              confirm: '',
              contact: '',
              library_id: '',
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
                Student Creation
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
                    rollno: '',
                    course: '',
                    password: '',
                    confirm: '',
                    contact: '',
                    library_id: '',
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
              Name of Student *
            </Text>
            <TextInput
              placeholder="Name of Student"
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
              Roll Number *
            </Text>
            <TextInput
              placeholder="Roll Number"
              style={{...TextInputStyle, textAlignVertical: 'top'}}
              value={formValues.rollno}
              onChangeText={value => {
                setFormValues({
                  ...formValues,
                  rollno: value,
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
              Select Course *
            </Text>
            <View style={{...TextInputStyle, padding: 0, height: 44}}>
              <Picker
                mode="dropdown"
                style={{marginTop: -5}}
                selectedValue={formValues.course}
                onValueChange={value =>
                  setFormValues({...formValues, course: value})
                }>
                <Picker.Item label="-" value={null || ''} />
                {renderCourse()}
              </Picker>
            </View>
            <Text
              style={{
                color: 'black',
                fontSize: 12,
                marginTop: 5,
                marginHorizontal: 10,
              }}>
              Contact *
            </Text>
            <TextInput
              placeholder="Contact"
              keyboardType="number-pad"
              style={{...TextInputStyle, textAlignVertical: 'top'}}
              value={formValues.contact}
              onChangeText={value => {
                setFormValues({
                  ...formValues,
                  contact: value,
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
              Library ID
            </Text>
            <TextInput
              placeholder="Library ID"
              style={{...TextInputStyle, textAlignVertical: 'top'}}
              value={formValues.library_id}
              onChangeText={value => {
                setFormValues({
                  ...formValues,
                  library_id: value,
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
            Add New Student
          </Text>
        </View>
      </TouchableHighlight>
      <ScrollView style={{marginTop: 10}}>{renderData()}</ScrollView>
      {renderFormDialog()}
    </View>
  );
};
const mapStateToProps = state => {
  return {course: state.course};
};
export default connect(mapStateToProps, {logout})(StudentCreation);
