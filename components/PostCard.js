import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';

const PostCard = ({item, onDelete, onLike, onPress, onEdit}) => {
  const {user, logout} = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  likeIcon = item.liked ? 'heart' : 'heart-outline';
  likeIconColor = item.liked ? '#2e64e5' : '#333';

  if (item.likes == 1) {
    likeText = 'Favorite';
  } else {
    likeText = 'Add to Favorites';
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

  return (
    <Card key={item.id}>
      <UserInfo>
        <UserImg
          source={{
            uri: userData
              ? userData.userImg ||
                'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
              : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
          }}
        />
        <UserName>
          {userData ? userData.fname || 'Test' : 'Test'}{' '}
          {userData ? userData.lname || 'User' : 'User'}
        </UserName>
        <PostTime>{moment(item.postTime.toDate()).fromNow()}</PostTime>
        {/* <InteractionWrapper>
          {user.uid == item.userId ? (
            <Interaction onPress={() => onDelete(item.id)}>
              <Ionicons name="pencil-sharp" size={25} />
            </Interaction>
          ) : null}
        </InteractionWrapper> */}
      </UserInfo>
      <PostText>{item.post}</PostText>
      {/*{item.postImg != null ? <PostImg source={{uri: item.postImg}} /> : null}*/}
      {item.postImg != null ? (
        <ProgressiveImage
          defaultImageSource={require('../assets/default-img.jpg')}
          source={{uri: item.postImg}}
          style={{width: 350, height: 250, borderRadius: 10}}
          resizeMode="cover"
        />
      ) : null}
      {/*<PostImg source={require('../assets/posts/post-img-1.jpg')} />*/}
      <InteractionWrapper>
        <Interaction active={item.liked} onPress={() => onLike(item.id)}>
          <Ionicons name={likeIcon} size={25} color={likeIconColor} />
          <InteractionText>{likeText}</InteractionText>
        </Interaction>
        <Interaction onPress={() => onEdit(item.id)}>
          <Ionicons name="pencil-sharp" size={25} />
          <InteractionText active={item.liked}>Edit</InteractionText>
        </Interaction>
        {user.uid == item.userId ? (
          <Interaction onPress={() => onDelete(item.id)}>
            <Ionicons name="md-trash-bin" size={25} />
            <InteractionText active={item.liked}>Delete</InteractionText>
          </Interaction>
        ) : null}
      </InteractionWrapper>
    </Card>
  );
};

export default PostCard;
