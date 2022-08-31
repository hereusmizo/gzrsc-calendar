import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import api from '../../api/api';

const HomeAssignment = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/malsawma/assignment`);
      setData(response.data.data);
    } catch (error) {
      setData([]);
    }
  };

  const renderData = () => {
    if (data.length) {
      return data.map(item => {
        return (
          <TouchableOpacity
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

  return (
    <View style={{backgroundColor: '#fff', height: '100%'}}>
      <ScrollView style={{marginTop: 10}}>{renderData()}</ScrollView>
    </View>
  );
};

export default HomeAssignment;
