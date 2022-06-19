import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dimentions, windowHeight, windowWidth} from '../utils/Dimentions';
const NotFound = ({notfoundText, iconName}) => {
  return (
    <View style={styles.container}>
      {/* <Ionicons name={iconName} size={128} /> */}
      {/* <Image
        source={require('../assets/noPostsFound.png')}
        style={{width: 200, height: 200}}
      /> */}
      <Image
        source={require('../assets/noPostsFound.gif')}
        style={{width: 450, height: 150}}
      />
      <Text style={{marginTop: 20, fontSize: 24, color: '#000'}}>
        {notfoundText}
      </Text>
    </View>
  );
};
export default NotFound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.75,
    zIndex: -1,
  },
});
