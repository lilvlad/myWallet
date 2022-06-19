import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import TestScreen from '../screens/TestScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import TermsofServiceScreen from '../screens/TermsofServiceScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  let routeName;

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });

    GoogleSignin.configure({
      webClientId:
        '223640559177-7r3vd9l319005l8qdjbve23lphedd1mp.apps.googleusercontent.com',
    });
  }, []);

  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch == true) {
    routeName = 'Onboarding';
  } else {
    routeName = 'Login';
  }

  return (
    <Stack.Navigator initialRouteName={routeName}>
      <Stack.Screen
        options={{headerShown: false}}
        name="Onboarding"
        component={OnboardingScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Signup"
        component={SignupScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Test"
        component={TestScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Terms"
        component={TermsofServiceScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
