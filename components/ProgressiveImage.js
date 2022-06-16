import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {PinchGestureHandler, State} from 'react-native-gesture-handler';

//this is for "loading effect". Display a default image while the actual post image is loading from the firebase.
class ProgressiveImage extends React.Component {
  defaultImageAnimated = new Animated.Value(0);
  imageAnimated = new Animated.Value(0);

  handleDefaultImageLoad = () => {
    Animated.timing(this.defaultImageAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  handleImageLoad = () => {
    Animated.timing(this.imageAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  scale = new Animated.Value(1);

  onZoomEventFunction = Animated.event([{nativeEvent: {scale: this.scale}}], {
    useNativeDriver: true,
  });

  onZoomStateChangeFunction = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(this.scale, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 5,
      }).start();
    }
  };

  render() {
    const {defaultImageSource, source, style, ...props} = this.props;

    return (
      <View style={styles.container}>
        <Animated.Image
          {...props}
          source={defaultImageSource}
          style={[style, {opacity: this.defaultImageAnimated}]}
          onLoad={this.handleDefaultImageLoad}
          //blurRadius={1}
        />
        <PinchGestureHandler
          onGestureEvent={this.onZoomEventFunction}
          onHandlerStateChange={this.onZoomStateChangeFunction}>
          <Animated.Image
            {...props}
            source={source}
            style={[
              style,
              {opacity: this.imageAnimated},
              styles.imageOverlay,
              {transform: [{scale: this.scale}]},
            ]}
            onLoad={this.handleImageLoad}
          />
        </PinchGestureHandler>
      </View>
    );
  }
}

export default ProgressiveImage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e4e8',
    zIndex: 999,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
