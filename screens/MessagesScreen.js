import {View, ScrollView} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const MessagesScreen = () => {
  return (
    <ScrollView
      style={{flex: 1, margin: 15}}
      contentContainerStyle={{alignItems: 'center'}}>
      {/* folders skeleton
       <SkeletonPlaceholder>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: 100, height: 100, borderRadius: 15}} />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: 100, height: 100, borderRadius: 15}} />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: 100, height: 100, borderRadius: 15}} />
          </View>
        </View>
      </SkeletonPlaceholder> */}
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
          <View style={{width: 150, height: 30, borderRadius: 4}} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <View style={{width: 250, height: 20, borderRadius: 4}} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <View style={{width: 50, height: 40, borderRadius: 4, margin: 5}} />
          <View style={{width: 75, height: 40, borderRadius: 4, margin: 5}} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 15,
          }}>
          <View style={{width: 150, height: 20, borderRadius: 4}} />
        </View>
      </SkeletonPlaceholder>
      <SkeletonPlaceholder>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: 60, height: 60, borderRadius: 50}} />
          <View style={{marginLeft: 20}}>
            <View style={{width: 120, height: 20, borderRadius: 4}} />
            <View
              style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
            />
          </View>
        </View>
        <View style={{marginTop: 10, marginBottom: 30}}>
          <View style={{width: 300, height: 20, borderRadius: 4}} />
          <View
            style={{marginTop: 6, width: 250, height: 20, borderRadius: 4}}
          />
          <View
            style={{marginTop: 6, width: 350, height: 200, borderRadius: 4}}
          />
        </View>
      </SkeletonPlaceholder>
    </ScrollView>
  );
};

export default MessagesScreen;
