import React, {useContext, useEffect, useState} from 'react';
import {View, Text, ImageBackground, Image, StyleSheet} from 'react-native';
import {useTheme, Drawer} from 'react-native-paper';
import {UserImg, UserName} from '../styles/FeedStyles';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';

import {AuthContext} from '../navigation/AuthProvider';
import {TouchableOpacity} from 'react-native-gesture-handler';

const CustomDrawer = props => {
  const paperTheme = useTheme();
  const {user, logout} = useContext(AuthContext);
  const {signOut, toggleTheme} = React.useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: '#f2f2f2'}}>
        <Drawer.Section style={styles.drawerSection}>
          <View style={styles.userInfoSection}>
            {/* profile user */}
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Profile')}>
              <UserImg
                style={styles.userImg}
                source={{
                  uri: userData
                    ? userData.userImg ||
                      'https://img.favpng.com/12/24/20/user-profile-get-em-cardiovascular-disease-zingah-png-favpng-9ctaweJEAek2WaHBszecKjXHd.jpg'
                    : 'https://img.favpng.com/12/24/20/user-profile-get-em-cardiovascular-disease-zingah-png-favpng-9ctaweJEAek2WaHBszecKjXHd.jpg',
                }}
              />
              <UserName style={styles.userName}>
                {userData ? userData.fname || 'New' : 'New'}{' '}
                {userData ? userData.lname || 'User' : 'User'}
              </UserName>
            </TouchableOpacity>
          </View>
        </Drawer.Section>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Ionicons name="share-social-outline" color={color} size={size} />
          )}
          label="Tell a Friend"
          onPress={() => logout()}
        />
        <DrawerItem
          icon={({color, size}) => (
            <Ionicons name="exit-outline" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={() => logout()}
        />
      </Drawer.Section>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    padding: 5,
  },
  userImg: {
    height: 125,
    width: 125,
    borderRadius: 75,
  },
  userInfoSection: {
    paddingBottom: 10,
    paddingTop: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 5,
  },
  drawerSection: {},
  bottomDrawerSection: {
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
