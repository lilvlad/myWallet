import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Linking, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';

import DrawerContent from '../components/DrawerContent';
import MainTabScreen from './MainTab';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CalendarScreen from '../screens/CalendarScreen';
import AddPostScreen from '../screens/AddPostScreen';
import AllPostsScreen from '../screens/AllPostsScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import CustomDrawer from '../components/CustomDrawer';
import MessagesScreen from '../screens/MessagesScreen';

const Drawer = createDrawerNavigator();
const HomeStack = createNativeStackNavigator();
const CalendarStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      initialRouteName="Home"
      screenOptions={{
        //here is the option that drags the whole screen
        drawerType: 'slide',
        headerShown: false,
        drawerLabelStyle: {
          marginLeft: -25,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,
        },
      }}>
      <Drawer.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          drawerIcon: ({color}) => (
            <Icon name="ios-home" size={22} color={color} />
          ),

          headerTitleAlign: 'center',
          headerShown: false,
          headerTitleStyle: {
            color: '#2e64e5',
            fontFamily: 'Kufam-SemiBoldItalic',
            fontSize: 24,
          },
          headerStyle: {
            shadowColor: '#fff',
            elevation: 0,
          },
          headerRight: () => (
            <View style={{marginRight: 10}}>
              <MaterialCommunityIcons.Button
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
      <Drawer.Screen
        name="Calendar"
        component={CalendarStackScreen}
        options={{
          drawerIcon: ({color}) => (
            <Icon name="ios-calendar" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          drawerIcon: ({color}) => (
            <Icon name="ios-person" size={22} color={color} />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="Dev Screen"
        component={MessagesScreen}
        options={{
          drawerIcon: ({color}) => (
            <Icon name="battery-charging-outline" size={22} color={color} />
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

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
        //headerSearchBarOptions: {placeholder: 'Search'},
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
            <Icon name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ), */
      }}
    />
    <HomeStack.Screen
      name="AllPosts"
      component={AllPostsScreen}
      options={{
        title: 'All Posts',
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#2e64e515',
          shadowRadius: 0,
          shadowOpacity: 0,
          elevation: 0,
        },

        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Icon name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      }}
    />
    <HomeStack.Screen
      name="Favorite"
      component={FavoriteScreen}
      options={{
        title: 'Favorites',
        headerTitleAlign: 'center',

        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#2e64e515',
          shadowRadius: 0,
          shadowOpacity: 0,
          elevation: 0,
        },

        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Icon name="arrow-back" size={25} color="#2e64e5" />
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
            <Icon name="arrow-back" size={25} color="#2e64e5" />
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
            style={{marginRight: 10}}
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
      name="Profile Screen"
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
          backgroundColor: '#fff',
          shadowColor: '#fff',
          shadowRadius: 0,
          shadowOpacity: 0,
          elevation: 0,
        },

        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Icon name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      }}
    />
  </ProfileStack.Navigator>
);
