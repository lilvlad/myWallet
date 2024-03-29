import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Alert,
  ToastAndroid,
  Touchable,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FormButton from '../components/FormButton';

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';

import {AuthContext} from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

const EditProfileScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext);
  const {verified, setVerified} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState(null);

  const [data, setData] = React.useState({
    mail: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidMail: true,
    isValidPassword: true,
  });

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const sendVerification = () => {
    try {
      //send verification email
      auth().currentUser.sendEmailVerification();
      Alert.alert(
        'Account verification',
        'Please check your email, there was sent an email to verify your account',
      );
    } catch (e) {
      console.log(e);
      Alert.alert('Error', e.message);
    }
  };

  const getUser = async () => {
    const currentUser = await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          //console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  const handleUpdate = async () => {
    let imgUrl = await uploadImage();

    if (imgUrl == null && userData.userImg) {
      imgUrl = userData.userImg;
    }

    firestore()
      .collection('users')
      .doc(user.uid)
      .update({
        fname: userData.fname,
        lname: userData.lname,
        about: userData.about,
        //phone: userData.phone,
        //country: userData.country,
        //city: userData.city,
        userImg: imgUrl,
      })
      .then(() => {
        navigation.goBack();
        console.log('User Updated!');
        /*Alert.alert(
          'Profile Updated!',
          'Your profile has been updated successfully.',
        );*/
        ToastAndroid.show(
          'Your profile has been updated successfully!',
          ToastAndroid.CENTER,
          ToastAndroid.SHORT,
        );
      });
  };

  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
      this.bs.current.snapTo(1);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
      this.bs.current.snapTo(1);
    });
  };

  renderInner = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={takePhotoFromCamera}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={choosePhotoFromLibrary}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => this.bs.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  bs = React.createRef();
  fall = new Animated.Value(1);

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={this.bs}
        snapPoints={[330, -5]}
        renderContent={this.renderInner}
        renderHeader={this.renderHeader}
        initialSnap={1}
        callbackNode={this.fall}
        enabledGestureInteraction={true}
      />
      <Animated.View
        style={{
          margin: 20,
          opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
              <View
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ImageBackground
                  source={{
                    uri: image
                      ? image
                      : userData
                      ? userData.userImg ||
                        'https://img.favpng.com/12/24/20/user-profile-get-em-cardiovascular-disease-zingah-png-favpng-9ctaweJEAek2WaHBszecKjXHd.jpg'
                      : 'https://img.favpng.com/12/24/20/user-profile-get-em-cardiovascular-disease-zingah-png-favpng-9ctaweJEAek2WaHBszecKjXHd.jpg',
                  }}
                  style={{height: 100, width: 100}}
                  imageStyle={{borderRadius: 15}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <MaterialCommunityIcons
                      name="camera"
                      size={35}
                      color="#000"
                      style={{
                        opacity: 0.7,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: '#000',
                        borderRadius: 10,
                      }}
                    />
                  </View>
                </ImageBackground>
              </View>
            </TouchableOpacity>
            <Text
              style={{
                marginTop: 10,
                fontSize: 18,
                fontWeight: 'bold',
                color: '#333333',
              }}>
              {userData ? userData.fname : ''} {userData ? userData.lname : ''}
            </Text>
            <Text>User ID: {user.uid}</Text>
          </View>
          <View style={styles.action}>
            {auth().currentUser.emailVerified ? (
              <>
                <MaterialCommunityIcons
                  name="email-check-outline"
                  color="#333333"
                  size={25}
                  onPress={() =>
                    ToastAndroid.show(
                      'Email verified',
                      ToastAndroid.CENTER,
                      ToastAndroid.SHORT,
                    )
                  }
                />
                <TextInput
                  placeholder="No Email Found"
                  placeholderTextColor="#666666"
                  value={userData ? userData.email : ''}
                  style={styles.textInput}
                  editable={false}
                />
              </>
            ) : (
              <>
                <MaterialCommunityIcons
                  name="email-remove-outline"
                  color="#333333"
                  size={25}
                  onPress={() =>
                    ToastAndroid.show(
                      'Email not verified',
                      ToastAndroid.CENTER,
                      ToastAndroid.SHORT,
                    )
                  }
                />

                <TextInput
                  placeholder="No Email Found"
                  placeholderTextColor="#666666"
                  value={userData ? userData.email : ''}
                  style={styles.textInput}
                  editable={false}
                />
                <Pressable onPress={sendVerification}>
                  <MaterialCommunityIcons
                    name="email-send"
                    color="#333333"
                    size={25}
                  />
                </Pressable>
              </>
            )}
          </View>

          <View style={styles.action}>
            {data.secureTextEntry ? (
              <MaterialCommunityIcons
                name="lock-outline"
                color="#333333"
                size={25}
              />
            ) : (
              <MaterialCommunityIcons
                name="lock-open-outline"
                color="#333333"
                size={25}
              />
            )}
            <TextInput
              value={userData ? userData.password : ''}
              placeholder="No Password"
              placeholderTextColor="#666"
              secureTextEntry={data.secureTextEntry ? true : false}
              style={styles.textInput}
              editable={false}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              {data.secureTextEntry ? (
                <Feather
                  name="eye-off"
                  color="grey"
                  size={22}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              ) : (
                <Feather
                  name="eye"
                  color="grey"
                  size={22}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.action}>
            <MaterialCommunityIcons
              name="account-outline"
              color="#333333"
              size={25}
            />
            <TextInput
              placeholder="First Name"
              placeholderTextColor="#666666"
              autoCorrect={false}
              value={userData ? userData.fname : ''}
              onChangeText={txt => setUserData({...userData, fname: txt})}
              style={styles.textInput}
            />
          </View>
          <View style={styles.action}>
            <MaterialCommunityIcons
              name="account-multiple-outline"
              color="#333333"
              size={25}
            />
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#666666"
              value={userData ? userData.lname : ''}
              onChangeText={txt => setUserData({...userData, lname: txt})}
              autoCorrect={false}
              style={styles.textInput}
            />
          </View>
          <View style={styles.action}>
            <MaterialCommunityIcons
              name="clipboard-account-outline"
              color="#333333"
              size={25}
            />
            <TextInput
              multiline
              numberOfLines={3}
              placeholder="About Me"
              placeholderTextColor="#666666"
              value={userData ? userData.about : ''}
              onChangeText={txt => setUserData({...userData, about: txt})}
              autoCorrect={true}
              style={[styles.textInput, {height: 40}]}
            />
          </View>
          <FormButton buttonTitle="Update" onPress={handleUpdate} />
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    width: '100%',
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
    color: '#000',
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#2e64e5',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#000',
  },
});
