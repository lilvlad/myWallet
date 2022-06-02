import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';

const NotFound = () => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <Icons name="ios-sad" size={90} />
      <Text style={{marginTop: 20, fontSize: 20}}>Result Not Found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
    zIndex: -1,
  },
});

export default NotFound;
