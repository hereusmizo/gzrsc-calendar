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

const AssignmentControl = ({logout}) => {
  const [id, setId] = useState(null);
  const [data, setData] = useState([]);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [formValues, setFormValues] = useState({
    title: '',
    body: '',
  });
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem('admin-auth');
    if (token) {
      try {
        const response = await api.get(`/api/malsawma/assignment`, {
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
        'Cannot submit empty title assignment',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    }
    const token = await AsyncStorage.getItem('admin-auth');

    if (token) {
      try {
        if (id) {
          await api.patch(
            `/api/malsawma/assignment/${id}`,
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
            `/api/malsawma/assignment`,
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
        await api.delete(`/api/malsawma/assignment/${deleteId}`, {
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
      return data.map(item => {
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
                New Home Assignment
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
                fontSize: 12,
                marginTop: 5,
                marginHorizontal: 10,
              }}>
              Title of Assignment *
            </Text>
            <TextInput
              placeholder="Title of Assignment"
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
              Description of Assignment
            </Text>
            <TextInput
              multiline
              numberOfLines={10}
              placeholder="Description of Assignment..."
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
            Add Assignment
          </Text>
        </View>
      </TouchableHighlight>
      <ScrollView style={{marginTop: 10}}>{renderData()}</ScrollView>
      {renderFormDialog()}
    </View>
  );
};

export default connect(null, {logout})(AssignmentControl);
