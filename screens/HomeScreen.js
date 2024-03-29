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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PostCard from '../components/PostCard';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {Container, FolderContainer} from '../styles/FeedStyles';
import {AuthContext} from '../navigation/AuthProvider';
import FolderButton from '../components/FolderButton';
import {color} from 'react-native-reanimated';
import {SearchBar} from '../components/SearchBar';
import NotFound from '../components/NotFound';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({navigation, route, value, onClear, onChangeText}) => {
  const {user, logout} = useContext(AuthContext);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [order, setOrder] = useState(false);
  const [refresh, setRefresh] = useState(1);
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [resultNotFound, setResultNotFound] = useState(false);
  const [found, setFound] = useState(false);

  const handleOnSearchInput = post => {
    setSearchQuery(post);
    if (!post.trim()) {
      setSearchQuery('');
      setResultNotFound(false);
      return setPosts();
    } else setResultNotFound(true);
  };

  const orderPressed = async e => {
    try {
      const list = [];
      if (order == false) {
        await firestore()
          .collection('posts')
          .where('userId', '==', user.uid)
          .orderBy('postTime', 'asc')
          .get()
          .then(querySnapshot => {
            if (querySnapshot.size == 0) {
              setFound(false);
            } else {
              setFound(true);
            }
            //console.log('Total Posts: ', querySnapshot.size);

            querySnapshot.forEach(doc => {
              const {userId, post, postImg, postTime, likes, liked} =
                doc.data();
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
        setOrder(true);
      } else {
        await firestore()
          .collection('posts')
          .where('userId', '==', user.uid)
          .orderBy('postTime', 'desc')
          .get()
          .then(querySnapshot => {
            if (querySnapshot.size == 0) {
              setFound(false);
            } else {
              setFound(true);
            }
            //console.log('Total Posts: ', querySnapshot.size);

            querySnapshot.forEach(doc => {
              const {userId, post, postImg, postTime, likes, liked} =
                doc.data();
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
        setOrder(false);
      }

      setPosts(list);

      if (loading) {
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
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
          if (querySnapshot.size == 0) {
            setFound(false);
          } else {
            setFound(true);
          }
          //console.log('Total Posts: ', querySnapshot.size);

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
          'Added to liked posts',
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
          'Removed from liked posts',
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
          <FolderContainer style={{marginLeft: 15}}>
            {/* marginTop: 50 for active search bar ^^^*/}
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
                      width: 175,
                      height: 125,
                      borderRadius: 15,
                      marginRight: 15,
                    }}
                  />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      width: 175,
                      height: 125,
                      borderRadius: 15,
                      marginRight: 15,
                    }}
                  />
                </View>
                {/* this is for 3 folders type
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      width: 115,
                      height: 115,
                      borderRadius: 15,
                      marginRight: 15,
                    }}
                  />
                </View> */}
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
      
          <SearchBar onChangeText={handleOnSearchInput} />
        */}
          <FolderContainer>
            <FolderButton
              iconType={'folder-image'}
              buttonTitle={'All Posts'}
              onPress={() => navigation.navigate('AllPosts')}
            />
            <FolderButton
              iconType={'folder-heart'}
              buttonTitle={'Liked Posts'}
              onPress={() => navigation.navigate('Favorite')}
            />
            {/*  <FolderButton
              iconType={'folder-google-drive'}
              buttonTitle={'Documents'}
              onPress={() => navigation.navigate('Documents')}
            /> */}
          </FolderContainer>
          <Container>
            <View
              style={{
                marginBottom: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  marginRight: -30,
                  fontSize: 18,
                  color: '#000',
                  fontWeight: 'bold',
                  justifyContent: 'center',
                  textAlign: 'center',
                  flex: 1,
                }}>
                Total Posts
              </Text>
              <MaterialIcons
                name={'format-list-numbered-rtl'}
                /*  name={'filter-list'} */
                size={28}
                color={'#000'}
                style={{justifyContent: 'flex-end'}}
                onPress={() => orderPressed()}
              />
            </View>
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
                notfoundDescription={'To make your first post go to the '}
                iconShow={true}
                iconName={'ios-sad'}
              />
            )}
          </Container>
        </>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
