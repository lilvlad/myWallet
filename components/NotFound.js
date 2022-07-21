import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dimentions, windowHeight, windowWidth} from '../utils/Dimentions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const NotFound = ({notfoundText, iconName, notfoundDescription, iconShow}) => {
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
      <Text
        style={{
          marginTop: 20,
          fontSize: 28,
          color: '#000',
          fontWeight: 'bold',
          textTransform: 'uppercase',
        }}>
        {notfoundText}
      </Text>

      <Text
        style={{
          fontSize: 18,
          color: '#777',
        }}>
        {notfoundDescription}
        {iconShow && (
          <MaterialCommunityIcons
            name="camera-plus"
            size={32}
            backgroundColor="#fff"
            color="#2e64e5"
          />
        )}
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
