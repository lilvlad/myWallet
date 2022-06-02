import React from 'react';
import {View} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CalendarScreen from '../screens/CalendarScreen';
import AddPostScreen from '../screens/AddPostScreen';
import AllPostsScreen from '../screens/AllPostsScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const HomeStack = createNativeStackNavigator();
const CalendarStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
  <Tab.Navigator activeColor="#fff">
    <Tab.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarColor: '#009387',
        tabBarIcon: ({color}) => (
          <Icon name="ios-home" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Calendar"
      component={CalendarStackScreen}
      options={{
        tabBarLabel: 'Calendar',
        tabBarColor: '#2e64e5',
        tabBarIcon: ({color}) => (
          <Icon name="ios-calendar" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileStackScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarColor: '#694fad',
        tabBarIcon: ({color}) => (
          <Icon name="ios-person" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default MainTabScreen;

const HomeStackScreen = ({navigation}) => (
  <HomeStack.Navigator screenOptions={{headerShadowVisible: false}}>
    <HomeStack.Screen
      name="myWallet"
      component={HomeScreen}
      options={{
        headerTitleAlign: 'center',

        headerTitleStyle: {
          color: '#2e64e5',
          fontFamily: 'Kufam-SemiBoldItalic',
          fontSize: 24,
        },
        headerStyle: {
          shadowColor: '#fff',
          elevation: 0,
        },
        headerLeft: () => (
          <Icon
            name="ios-menu"
            size={25}
            backgroundColor="#fff"
            color="#000"
            onPress={() => navigation.openDrawer()}></Icon>
        ),
        headerRight: () => (
          <View style={{marginRight: 10}}>
            <MaterialCommunityIcons
              name="camera-plus"
              size={32}
              backgroundColor="#fff"
              color="#2e64e5"
              onPress={() => navigation.navigate('AddPost')}
            />
          </View>
        ),
      }}
    />
    <HomeStack.Screen
      name="AddPost"
      component={AddPostScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',

        headerStyle: {
          backgroundColor: '#2e64e515',
          shadowColor: '#2e64e515',
          shadowRadius: 0,
          shadowOpacity: 0,
          elevation: 0,
        },
        headerBackTitleVisible: false,

        /* headerRight: () => (
          <SubmitBtn onPress={route.submitPost} style={{marginBottom: 15}}>
            <SubmitBtnText>Post</SubmitBtnText>
          </SubmitBtn>
        ), */
        /* headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ), */
      }}
    />
    <HomeStack.Screen
      name="AllPosts"
      component={AllPostsScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#F2F2F2',
          shadowColor: '#2e64e515',
          shadowRadius: 0,
          shadowOpacity: 0,
          elevation: 0,
        },

        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      }}
    />
    <HomeStack.Screen
      name="Favorite"
      component={FavoriteScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',

        headerStyle: {
          backgroundColor: '#F2F2F2',
          shadowColor: '#fff',
          shadowRadius: 0,
          shadowOpacity: 0,
          elevation: 0,
        },

        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      }}
    />
    <HomeStack.Screen
      name="Documents"
      component={DocumentsScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#F2F2F2',
          shadowColor: '#2e64e515',
          shadowRadius: 0,
          shadowOpacity: 0,
          elevation: 0,
        },

        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      }}
    />
  </HomeStack.Navigator>
);

const CalendarStackScreen = ({navigation}) => (
  <CalendarStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#2e64e5',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <CalendarStack.Screen
      name="Calendar Screen"
      component={CalendarScreen}
      options={{
        headerLeft: () => (
          <Icon
            name="ios-menu"
            size={25}
            backgroundColor="#2e64e5"
            color={'#fff'}
            onPress={() => navigation.openDrawer()}></Icon>
        ),
      }}
    />
  </CalendarStack.Navigator>
);
const ProfileStackScreen = ({navigation}) => (
  <ProfileStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#2e64e5',
      },
      //headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <ProfileStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        headerShown: false,
        headerLeft: () => (
          <Icon
            name="ios-menu"
            size={25}
            backgroundColor="#2e64e5"
            onPress={() => navigation.openDrawer()}></Icon>
        ),
      }}
    />
    <ProfileStack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#F2F2F2',
          shadowColor: '#fff',
          shadowRadius: 0,
          shadowOpacity: 0,
          elevation: 0,
        },

        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      }}
    />
  </ProfileStack.Navigator>
);
