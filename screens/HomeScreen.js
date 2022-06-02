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
import {Container, FolderContainer} from '../styles/FeedStyles';
import {AuthContext} from '../navigation/AuthProvider';
import FolderButton from '../components/FolderButton';
import {color} from 'react-native-reanimated';
import {SearchBar} from '../components/SearchBar';

/* const Posts = [
  {
    id: '1',
    userName: 'Jenny Doe',
    userImg: require('../assets/users/user-3.jpg'),
    postTime: '4 mins ago',
    post: 'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/posts/post-img-3.jpg'),
    liked: true,
    likes: '14',
    comments: '5',
  },
  {
    id: '2',
    userName: 'John Doe',
    userImg: require('../assets/users/user-1.jpg'),
    postTime: '2 hours ago',
    post: 'Hey there, this is my test for a post of my social app in React Native.',
    postImg: 'none',
    liked: false,
    likes: '8',
    comments: '0',
  },
  {
    id: '3',
    userName: 'Ken William',
    userImg: require('../assets/users/user-4.jpg'),
    postTime: '1 hours ago',
    post: 'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/posts/post-img-2.jpg'),
    liked: true,
    likes: '1',
    comments: '0',
  },
  {
    id: '4',
    userName: 'Selina Paul',
    userImg: require('../assets/users/user-6.jpg'),
    postTime: '1 day ago',
    post: 'Hey there, this is my test for a post of my social app in React Native.',
    postImg: require('../assets/posts/post-img-4.jpg'),
    liked: true,
    likes: '22',
    comments: '4',
  },
  {
    id: '5',
    userName: 'Christy Alex',
    userImg: require('../assets/users/user-7.jpg'),
    postTime: '2 days ago',
    post: 'Hey there, this is my test for a post of my social app in React Native.',
    postImg: 'none',
    liked: false,
    likes: '0',
    comments: '0',
  },
]; */

const HomeScreen = ({navigation, route, value, onClear, onChangeText}) => {
  const {user, logout} = useContext(AuthContext);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
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
        .orderBy('postTime', 'desc')
        .get()
        .then(querySnapshot => {
          console.log('Total Posts: ', querySnapshot.size);

          querySnapshot.forEach(doc => {
            const {userId, post, postImg, postTime, likes, liked} = doc.data();
            list.push({
              id: doc.id,
              userId,
              userName: userData ? userData.fname || 'Test' : 'Test',
              userImg: userData
                ? userData.userImg ||
                  'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
                : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
              postTime: postTime,
              post,
              postImg,
              liked: false,
              likes,
            });
          });
        });

      setPosts(list);

      if (loading) {
        setLoading(false);
      }

      console.log('Posts: ', posts);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
          //console.log('User Data', documentSnapshot.data());
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

  const handleLike = item => {
    ToastAndroid.show(
      'Added to favorites',
      ToastAndroid.CENTER,
      ToastAndroid.SHORT,
    );
  };
  const handleEdit = postId => {
    ToastAndroid.show('Edit pressed!', ToastAndroid.CENTER, ToastAndroid.SHORT);
  };

  const deletePost = postId => {
    //console.log('Current Post Id: ', postId);

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
        /*Alert.alert(
          'Post deleted!',
          'Your post has been deleted successfully!',
        );*/
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
          <FolderContainer style={{marginLeft: 15, marginTop: 50}}>
            <SkeletonPlaceholder>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  marginBottom: 60,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      width: 115,
                      height: 115,
                      borderRadius: 15,
                      marginRight: 15,
                    }}
                  />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      width: 115,
                      height: 115,
                      borderRadius: 15,
                      marginRight: 15,
                    }}
                  />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      width: 115,
                      height: 115,
                      borderRadius: 15,
                      marginRight: 15,
                    }}
                  />
                </View>
              </View>
            </SkeletonPlaceholder>
          </FolderContainer>
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
          {/* 
          <View style={styles.container}>
            <Ionicons
              name="search"
              size={20}
              color="#777"
              style={styles.searchIcon}
            />
            <TextInput
              value={value}
              onChangeText={onChangeText}
              style={styles.searchBar}
              placeholder="Search here..."
            />

            <Ionicons
              name="close"
              size={20}
              color="#777"
              onPress={onClear}
              style={styles.clearIcon}
            />
          </View>
      */}
          <SearchBar onChangeText={handleOnSearchInput} />
          <FolderContainer>
            <FolderButton
              iconType={'folder-image'}
              buttonTitle={'All Posts'}
              onPress={() => navigation.navigate('AllPosts')}
            />
            <FolderButton
              iconType={'folder-heart'}
              buttonTitle={'Favorite'}
              onPress={() => navigation.navigate('Favorite')}
            />
            <FolderButton
              iconType={'folder-google-drive'}
              buttonTitle={'Documents'}
              onPress={() => navigation.navigate('Documents')}
            />
          </FolderContainer>
          <Container>
            <Text
              style={{
                marginBottom: 10,
                fontSize: 18,
                color: '#000',
                fontWeight: 'bold',
              }}>
              Total Posts
            </Text>
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

export default HomeScreen;
