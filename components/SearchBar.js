import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';

export const SearchBar = ({containerStyle, value, onClear, onChangeText}) => {
  return (
    <View style={[styles.container, {...containerStyle}]}>
      <Icons name="search" size={20} color="#777" style={styles.searchIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.searchBar}
        placeholder="Search here..."
      />

      {value ? (
        <Icons
          name="close"
          size={20}
          color="#777"
          onPress={onClear}
          style={styles.clearIcon}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    borderWidth: 1,
    borderColor: '#777',
    height: 40,
    borderRadius: 15,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 33,
    fontSize: 18,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    margin: 10,
  },
  container: {
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  clearIcon: {
    position: 'absolute',
    right: 20,
  },
  searchIcon: {
    position: 'absolute',
    paddingLeft: 20,
    zIndex: 1,
  },
});
