import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  ScrollView,
  Text,
  FlatList,
  SafeAreaView,
  Alert,
  ToastAndroid,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import PostCard from '../components/PostCard';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {Container, FolderContainer} from '../styles/FeedStyles';
import {AuthContext} from '../navigation/AuthProvider';
import NotFound from '../components/NotFound';

const AllPostsScreen = ({navigation, route, value, onClear, onChangeText}) => {
  const {user, logout} = useContext(AuthContext);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [refresh, setRefresh] = useState(1);
  const [userData, setUserData] = useState(null);
  const [found, setFound] = useState(false);
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
        .orderBy('liked', 'desc')
        .get()
        .then(querySnapshot => {
          console.log('Total Posts: ', querySnapshot.size);
          if (querySnapshot.size == 0) {
            setFound(false);
          } else {
            setFound(true);
          }
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
    // ToastAndroid.show('Edit pressed!', ToastAndroid.CENTER, ToastAndroid.SHORT);
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

          <Container>
            {/* <Text
              style={{
                marginBottom: 10,
                fontSize: 18,
                color: '#000',
                fontWeight: 'bold',
              }}>
              All Posts
            </Text> */}
            {found == true ? (
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
            ) : (
              <NotFound
                notfoundText={'No posts found yet'}
                iconName={'ios-sad'}
              />
            )}
          </Container>
        </>
      )}
    </SafeAreaView>
  );
};

export default AllPostsScreen;
