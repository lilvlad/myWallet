import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Drawer} from 'react-native-paper';
import {UserImg, UserName} from '../styles/FeedStyles';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';

import {AuthContext} from '../navigation/AuthProvider';
import {TouchableOpacity} from 'react-native-gesture-handler';

const DrawerContent = (props, route) => {
  const {user, logout} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
    if (loading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <Drawer.Section style={styles.drawerSection}>
          <View style={styles.userInfoSection}>
            {/* profile user */}
            {loading ? (
              <>
                <SkeletonPlaceholder>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        width: 150,
                        height: 150,
                        borderRadius: 100,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 10,
                    }}>
                    <View style={{width: 150, height: 25, borderRadius: 4}} />
                  </View>
                </SkeletonPlaceholder>
              </>
            ) : (
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
            )}
          </View>
        </Drawer.Section>
        <View style={styles.drawerContent}>
          <Drawer.Section>
            <DrawerItemList {...props} />
          </Drawer.Section>
          <Drawer.Section title="Post Tabs" color="red" backgroundColor="#fff">
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="folder-image" color={color} size={size} />
              )}
              label="All Posts"
              onPress={() => {
                props.navigation.navigate('AllPosts');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="folder-heart" color={color} size={size} />
              )}
              label="Liked Posts"
              onPress={() => {
                props.navigation.navigate('Favorite');
              }}
            />
            {/* <DrawerItem
              icon={({color, size}) => (
                <Icon name="folder-google-drive" color={color} size={size} />
              )}
              label="Documents"
              onPress={() => {
                props.navigation.navigate('Documents');
              }}
            /> */}
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="share-outline" color={color} size={size} />
          )}
          label="Tell your friends"
          onPress={() => {}}
        />
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={() => logout()}
        />
      </Drawer.Section>
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userImg: {
    height: 125,
    width: 125,
    borderRadius: 75,
    borderWidth: 3,
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
    textAlign: 'center',
  },
  drawerSection: {
    activeTintColor: 'red',
  },

  bottomDrawerSection: {
    borderTopColor: '#f4f4f4',
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
