import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Alert,
  ToastAndroid,
  Keyboard,
  Touchable,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {
  TextInput,
  AnimatedFAB,
  FAB,
  ActivityIndicator,
} from 'react-native-paper';

import {
  InputWrapper,
  AddImage,
  SubmitBtn,
  SubmitBtnText,
  StatusWrapper,
} from '../styles/AddPost';
import {AuthContext} from '../navigation/AuthProvider';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';

const AddPostScreen = () => {
  const {user, logout} = useContext(AuthContext);

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);

  const handleOnChangeText = (content, valueFor) => {
    if (valueFor === 'post') setPost(content);
  };

  const handleKeyboardClose = () => {
    Keyboard.dismiss();
  };

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 1200,
      height: 780,
      cropping: true,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  const chooseDocumentFromLibrary = () => {
    try {
      const res = DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res.uri, res.type, res.name, res.size);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };
  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      cropping: true,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  const submitPost = async () => {
    const imageUrl = await uploadImage();
    console.log('Image Url: ', imageUrl);
    console.log('Post: ', post);

    firestore()
      .collection('posts')
      .add({
        userId: user.uid,
        post: post,
        postImg: imageUrl,
        postTime: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        console.log('Post Added!');
        /*Alert.alert(
          'Post published!',
          'Your post has been published Successfully!',
        );*/
        ToastAndroid.show(
          'Your post has been published Successfully!',
          ToastAndroid.CENTER,
          ToastAndroid.SHORT,
        );
        setPost(null);
      })
      .catch(error => {
        console.log(
          'Something went wrong with adding this post to firestore.',
          error,
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

  return (
    <>
      <TouchableWithoutFeedback onPress={handleKeyboardClose}>
        <InputWrapper>
          {image != null ? <AddImage source={{uri: image}} /> : null}

          <TextInput
            label="Write something..."
            value={post}
            onChangeText={content => setPost(content)}
            mode="outlined"
            multiline={true}
            style={styles.input}
            activeOutlineColor="#2e64e5"
            maxLength={250}
          />

          {/*  {post.trim() ? (
            <StatusWrapper>
              <AnimatedFAB
                animateFrom="right"
                extended="true"
                icon="plus"
                label="Post"
                onPress={submitPost}
                style={{backgroundColor: '#2e64e5'}}
              />
            </StatusWrapper>
          ) : (
            <StatusWrapper>
              <AnimatedFAB
                disabled={'false'}
                animateFrom="right"
                icon="plus"
                label="Post"
                onPress={submitPost}
              />
            </StatusWrapper>
          )} */}

          {uploading ? (
            <StatusWrapper>
              <Text>{transferred} % Completed!</Text>
              <ActivityIndicator size="large" color="#0000ff" />
            </StatusWrapper>
          ) : (
            <StatusWrapper style={{margin: 10}}>
              <AnimatedFAB
                animateFrom="right"
                extended="true"
                icon="check"
                label="Post"
                onPress={submitPost}
                style={{backgroundColor: '#2e64e5'}}
              />
            </StatusWrapper>
          )}
        </InputWrapper>
        <ActionButton buttonColor="#2e64e5">
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="Take Photo"
            onPress={takePhotoFromCamera}>
            <Icon name="camera-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#3498db"
            title="Upload from Library"
            onPress={choosePhotoFromLibrary}>
            <Icon name="md-images-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#B22222"
            title="Upload Document"
            onPress={chooseDocumentFromLibrary}>
            <Icon name="md-document" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </TouchableWithoutFeedback>
    </>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  input: {
    fontSize: 18,
    width: 375,
  },
});