import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Linking, Pressable} from 'react-native';

import {
  Container,
  Card,
  UserInfo,
  UserImg,
  UserName,
  UserInfoText,
  PostTime,
  PostText,
  PostImg,
  InteractionWrapper,
  Interaction,
  InteractionText,
  Divider,
} from '../styles/FeedStyles';
import ProgressiveImage from './ProgressiveImage';
import {AuthContext} from '../navigation/AuthProvider';
import moment from 'moment';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import {View} from 'react-native-animatable';
import LottieView from 'lottie-react-native';

const PostCard = ({item, onDelete, onLike, onPress, onEdit}) => {
  const {user, logout} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  /* likeIcon = item.liked ? 'heart' : 'heart-outline';
  likeIconColor = item.liked ? '#2e64e5' : '#333'; */

  /* console.log(item); */

  const animation = React.useRef(null);
  const isFirstRun = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRun.current) {
      if (item.liked) {
        //static liked
        animation.current.play(80, 80);
      } else {
        //static not liked
        animation.current.play(0, 0);
      }
      isFirstRun.current = false;
    } else if (item.liked) {
      //animatin when liked
      animation.current.play(3, 80);
    } else {
      //animation to go back to the not liked
      animation.current.play(0, 0);
    }
  }, [item.liked]);

  if (item.liked == 1) {
    likeText = 'Liked';
  } else {
    likeText = 'Like';
  }

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(item.userId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          //console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  const openImage = () => {
    Linking.openURL(item.postImg);
  };

  return (
    <Card key={item.id}>
      <UserInfo>
        <UserImg
          source={{
            uri: userData
              ? userData.userImg ||
                'https://img.favpng.com/12/24/20/user-profile-get-em-cardiovascular-disease-zingah-png-favpng-9ctaweJEAek2WaHBszecKjXHd.jpg'
              : 'https://img.favpng.com/12/24/20/user-profile-get-em-cardiovascular-disease-zingah-png-favpng-9ctaweJEAek2WaHBszecKjXHd.jpg',
          }}
        />
        <UserInfoText>
          <UserName>
            {userData ? userData.fname || 'New' : 'New'}{' '}
            {userData ? userData.lname || 'User' : 'User'}
          </UserName>
          <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
        </UserInfoText>
      </UserInfo>
      <PostText>{item.post}</PostText>

      {/*{item.postImg != null ? <PostImg source={{uri: item.postImg}} /> : null}*/}
      {item.postImg != null ? (
        <View style={{zIndex: 999}}>
          <Pressable onPress={() => Linking.openURL(item.postImg)}>
            <ProgressiveImage
              defaultImageSource={require('../assets/default-img.jpg')}
              source={{uri: item.postImg}}
              style={{width: 350, height: 225, borderRadius: 10}}
            />
          </Pressable>
        </View>
      ) : null}
      {/*<PostImg source={require('../assets/posts/post-img-1.jpg')} />*/}
      <InteractionWrapper>
        <Interaction
          active={item.liked}
          onPress={() => onLike(item.liked, item.id)}>
          {/* <Ionicons name={likeIcon} size={25} color={likeIconColor} /> */}
          <LottieView
            ref={animation}
            style={{
              height: 80,
              marginTop: -13,
              marginBottom: -40,
              marginLeft: -20,
              marginRight: -55,
            }}
            source={require('../assets/like.json')}
            autoPlay={false}
            loop={false}
          />
          <InteractionText>{likeText}</InteractionText>
        </Interaction>
        <Interaction onPress={() => onEdit(item)}>
          <MaterialIcon name="edit" size={25} />
          <InteractionText>Edit</InteractionText>
        </Interaction>
        {user.uid == item.userId ? (
          <Interaction onPress={() => onDelete(item.id)}>
            <MaterialIcon name="delete" size={25} />
            <InteractionText>Delete</InteractionText>
          </Interaction>
        ) : null}
      </InteractionWrapper>
    </Card>
  );
};

export default PostCard;
