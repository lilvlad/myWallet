import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ToastAndroid,
  FlatList,
} from 'react-native';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import firestore from '@react-native-firebase/firestore';
import PostCard from '../components/PostCard';
import NotFound from '../components/NotFound';
import {Container} from '../styles/FeedStyles';

const ProfileScreen = ({navigation, route}) => {
  const {user, logout} = useContext(AuthContext);
  const [posts, setPosts] = useState('');
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
            style={{flex: 1, margin: 15}}
            contentContainerStyle={{alignItems: 'center'}}
            showsVerticalScrollIndicator={false}>
            <SkeletonPlaceholder>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 100,
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 10,
                }}>
                <View style={{width: 150, height: 25, borderRadius: 4}} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 10,
                }}>
                <View style={{width: 250, height: 15, borderRadius: 4}} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 10,
                }}>
                <View
                  style={{width: 50, height: 40, borderRadius: 4, margin: 5}}
                />
                <View
                  style={{width: 75, height: 40, borderRadius: 4, margin: 5}}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 15,
                  marginBottom: 25,
                }}>
                <View style={{width: 100, height: 20, borderRadius: 4}} />
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
        <View style={styles.container} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Image
              style={styles.userImg}
              source={{
                uri: userData
                  ? userData.userImg ||
                    'https://img.favpng.com/12/24/20/user-profile-get-em-cardiovascular-disease-zingah-png-favpng-9ctaweJEAek2WaHBszecKjXHd.jpg'
                  : 'https://img.favpng.com/12/24/20/user-profile-get-em-cardiovascular-disease-zingah-png-favpng-9ctaweJEAek2WaHBszecKjXHd.jpg',
              }}
            />
          </TouchableOpacity>
          <Text style={styles.userName}>
            {userData ? userData.fname || 'New' : 'New'}{' '}
            {userData ? userData.lname || 'User' : 'User'}
          </Text>
          {/* <Text>{route.params ? route.params.userId : user.uid}</Text> */}
          <Text style={styles.aboutUser}>
            {userData ? userData.about || 'No details added.' : ''}
          </Text>
          <View style={styles.userBtnWrapper}>
            <TouchableOpacity
              style={styles.userBtn}
              onPress={() => {
                navigation.navigate('EditProfile');
              }}>
              <Text style={styles.userBtnTxt}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userBtn} onPress={() => logout()}>
              <Text style={styles.userBtnTxt}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.userInfoWrapper}>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoTitle}>{posts.length} Post(s)</Text>
              {/*<Text style={styles.userInfoSubTitle}>Posts</Text>*/}
            </View>
          </View>

          {/* {posts.map(item => (
            <PostCard key={item.id} item={item} onDelete={handleDelete} />
          ))} */}
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
            <NotFound notfoundText={'No posts found'} iconName={'ios-sad'} />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    color: '#000',
  },
  aboutUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  userBtn: {
    borderColor: '#2e64e5',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#2e64e5',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#666',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
