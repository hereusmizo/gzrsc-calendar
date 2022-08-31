import {Text} from 'react-native';
import React from 'react';

const MyText = ({children, style, weight}) => {
  const getFont = () => {
    if (weight === 1) {
      return 'OpenSans-SemiBold';
    } else if (weight === 2) {
      return 'OpenSans-Bold';
    } else if (weight === 3) {
      return 'OpenSans-ExtraBold';
    } else {
      return 'OpenSans-Regular';
    }
  };
  return <Text style={{...style, fontFamily: getFont()}}>{children}</Text>;
};

export default MyText;
