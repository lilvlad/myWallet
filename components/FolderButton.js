import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimentions';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FolderButton = ({buttonTitle, iconType, ...rest}) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={{alignItems: 'center'}} {...rest}>
        <MaterialCommunityIcons
          style={styles.iconStyle}
          name={iconType}
          size={76}
          color="#666"
        />
        <Text style={styles.buttonText}>{buttonTitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FolderButton;

const styles = StyleSheet.create({
  buttonContainer: {
    width: '30%',
    backgroundColor: '#2e64e515',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    fontFamily: 'Lato-Regular',
  },
});
