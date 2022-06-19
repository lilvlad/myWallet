import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {Alert, ToastAndroid} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [verified, setVerified] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            const user = await auth().signInWithEmailAndPassword(
              email,
              password,
            );
            //console.log(user);
            if (auth().currentUser.emailVerified) {
              ToastAndroid.show(
                'Welcome Back!',
                ToastAndroid.CENTER,
                ToastAndroid.SHORT,
                setVerified(true),
              );
            } else {
              Alert.alert(
                'Account verification',
                'A reminder to verify your account, an email was ent to your inbox when registering account',
              );
              setVerified(false);
            }
          } catch (e) {
            console.log(e);
            Alert.alert('Error', e.message);
          }
        },
        googleLogin: async () => {
          try {
            // Get the users ID token
            const {idToken} = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential =
              auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            await auth()
              .signInWithCredential(googleCredential)
              // Use it only when user Sign's up,
              // so create different social signup function
              .then(() => {
                //Once the user creation has happened successfully, we can add the currentUser into firestore
                //with the appropriate details.
                // console.log('current User', auth().currentUser);
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .set({
                    fname: '',
                    lname: '',
                    email: auth().currentUser.email,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: null,
                  })
                  //   //ensure we catch any errors at this stage to advise us if something does go wrong
                  .catch(error => {
                    console.log(
                      'Something went wrong with added user to firestore: ',
                      error,
                    );
                  });
              })
              //we need to catch the whole sign up process if it fails too.
              .catch(error => {
                console.log('Something went wrong with sign up: ', error);
              });
          } catch (error) {
            console.log({error});
          }
        },

        register: async (email, password) => {
          try {
            await auth()
              .createUserWithEmailAndPassword(email, password)
              .then(() => {
                //Once the user creation has happened successfully, we can add the currentUser into firestore
                //with the appropriate details.
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .set({
                    fname: '',
                    lname: '',
                    email: email,
                    password: password,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: null,
                  })

                  //ensure we catch any errors at this stage to advise us if something does go wrong
                  .catch(error => {
                    console.log(
                      'Something went wrong with adding user to firestore: ',
                      error,
                    );
                    Alert.alert('Error', error.message);
                  });
              })
              //we need to catch the whole sign up process if it fails too.
              .catch(error => {
                console.log('Something went wrong with sign up: ', error);
                Alert.alert('Error', error.message);
              });
            //send verification email
            await auth().currentUser.sendEmailVerification();
            Alert.alert(
              'Account verification',
              'Please check your email, there was sent an email to verify your account',
            );
          } catch (e) {
            console.log(e);
            Alert.alert('Error', e.message);
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.log(e);
            Alert.alert('Error', e.message);
          }
        },
        resetPassword: async email => {
          try {
            await auth().sendPasswordResetEmail(email);
            ToastAndroid.show(
              'An email was sent to reset your password',
              ToastAndroid.CENTER,
              ToastAndroid.LONG,
            );
            /*    Alert.alert('Password reset', 'Please check your email'); */
          } catch (e) {
            console.log(e);
            Alert.alert('Error', e.message);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
