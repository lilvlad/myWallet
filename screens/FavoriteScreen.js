import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  ToastAndroid,
  TextInput,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PostCard from '../components/PostCard';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {Container} from '../styles/FeedStyles';
import {AuthContext} from '../navigation/AuthProvider';
import FolderButton from '../components/FolderButton';
import {color} from 'react-native-reanimated';
import {SearchBar} from '../components/SearchBar';

const FavoriteScreen = ({navigation, route, value, onClear, onChangeText}) => {
  const {user, logout} = useContext(AuthContext);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [refresh, setRefresh] = useState(1);
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [resultNotFound, setResultNotFound] = useState(false);

  const handleOnSearchInput = post => {
    setSearchQuery(post);
    if (!post.trim()) {
      setSearchQuery('');
      setResultNotFound(false);
      return setPosts();
    }
  };

  const fetchPosts = async () => {
    try {
      const list = [];

      await firestore()
        .collection('posts')
        .where('userId', '==', user.uid)
        .where('liked', '==', true)
        .orderBy('postTime', 'desc')
        .get()
        .then(querySnapshot => {
          console.log('Total Posts: ', querySnapshot.size);

          querySnapshot.forEach(doc => {
            const {userId, post, postImg, postTime, likes, liked} = doc.data();
            list.push({
              id: doc.id,
              userId,
              userName: userData ? userData.fname || 'New' : 'New',
              userImg: userData
                ? userData.userImg ||
                  'https://img.favpng.com/12/24/20/user-profile-get-em-cardiovascular-disease-zingah-png-favpng-9ctaweJEAek2WaHBszecKjXHd.jpg'
                : 'https://img.favpng.com/12/24/20/user-profile-get-em-cardiovascular-disease-zingah-png-favpng-9ctaweJEAek2WaHBszecKjXHd.jpg',
              postTime: postTime,
              post,
              postImg,
              liked: liked,
              likes,
            });
          });
        });

      setPosts(list);

      if (loading) {
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refresh]);

  useEffect(() => {
    fetchPosts();
    setDeleted(false);
  }, [deleted]);

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getUser();
    fetchPosts();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, loading]);

  const handleDelete = postId => {
    Alert.alert(
      'Delete post',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => deletePost(postId),
        },
      ],
      {cancelable: false},
    );
  };

  const handleLike = async (liked, postId) => {
    try {
      if (!liked) {
        const done = await firestore()
          .collection('posts')
          .doc(postId)
          .set({liked: true}, {merge: true})
          .then(() => setRefresh(refresh + 1));
        ToastAndroid.show(
          'Added to favorites',
          ToastAndroid.CENTER,
          ToastAndroid.SHORT,
        );
      } else {
        const unliked = await firestore()
          .collection('posts')
          .doc(postId)
          .set({liked: false}, {merge: true})
          .then(() => setRefresh(refresh + 1));
        ToastAndroid.show(
          'Removed from favorites',
          ToastAndroid.CENTER,
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      ToastAndroid.show(
        'Something Went Wrong!',
        ToastAndroid.CENTER,
        ToastAndroid.SHORT,
      );
    }
  };
  const handleEdit = post => {
    navigation.navigate('AddPost', {post: post});
  };

  const deletePost = postId => {
    firestore()
      .collection('posts')
      .doc(postId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const {postImg} = documentSnapshot.data();

          if (postImg != null) {
            const storageRef = storage().refFromURL(postImg);
            const imageRef = storage().ref(storageRef.fullPath);

            imageRef
              .delete()
              .then(() => {
                console.log(`${postImg} has been deleted successfully.`);
                deleteFirestoreData(postId);
              })
              .catch(e => {
                console.log('Error while deleting the image. ', e);
              });
            // If the post image is not available
          } else {
            deleteFirestoreData(postId);
          }
        }
      });
  };

  const deleteFirestoreData = postId => {
    firestore()
      .collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
        ToastAndroid.show(
          'Your post has been deleted successfully!',
          ToastAndroid.CENTER,
          ToastAndroid.SHORT,
        );
        setDeleted(true);
      })
      .catch(e => console.log('Error deleting posst.', e));
  };

  const ListHeader = () => {
    return null;
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      {loading ? (
        <>
          <ScrollView
            style={{flex: 1, margin: 10}}
            contentContainerStyle={{alignItems: 'center'}}
            showsVerticalScrollIndicator={false}>
            <SkeletonPlaceholder>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{width: 60, height: 60, borderRadius: 50}} />
                <View style={{marginLeft: 20}}>
                  <View style={{width: 120, height: 20, borderRadius: 4}} />
                  <View
                    style={{
                      marginTop: 6,
                      width: 80,
                      height: 20,
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>
              <View style={{marginTop: 10, marginBottom: 30}}>
                <View style={{width: 300, height: 20, borderRadius: 4}} />
                <View
                  style={{
                    marginTop: 6,
                    width: 250,
                    height: 20,
                    borderRadius: 4,
                  }}
                />
                <View
                  style={{
                    marginTop: 6,
                    width: 350,
                    height: 200,
                    borderRadius: 4,
                  }}
                />
              </View>
            </SkeletonPlaceholder>
            <SkeletonPlaceholder>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{width: 60, height: 60, borderRadius: 50}} />
                <View style={{marginLeft: 20}}>
                  <View style={{width: 120, height: 20, borderRadius: 4}} />
                  <View
                    style={{
                      marginTop: 6,
                      width: 80,
                      height: 20,
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>
              <View style={{marginTop: 10, marginBottom: 30}}>
                <View style={{width: 300, height: 20, borderRadius: 4}} />
                <View
                  style={{
                    marginTop: 6,
                    width: 250,
                    height: 20,
                    borderRadius: 4,
                  }}
                />
                <View
                  style={{
                    marginTop: 6,
                    width: 350,
                    height: 200,
                    borderRadius: 4,
                  }}
                />
              </View>
            </SkeletonPlaceholder>
          </ScrollView>
        </>
      ) : (
        <>
          <Container>
            <FlatList
              data={posts}
              renderItem={({item}) => (
                <PostCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onLike={handleLike}
                  onEdit={handleEdit}
                  onPress={() =>
                    navigation.navigate('HomeProfile', {userId: item.userId})
                  }
                />
              )}
              keyExtractor={item => item.id}
              ListHeaderComponent={ListHeader}
              ListFooterComponent={ListHeader}
              showsVerticalScrollIndicator={false}
            />
          </Container>
        </>
      )}
    </SafeAreaView>
  );
};

export default FavoriteScreen;
