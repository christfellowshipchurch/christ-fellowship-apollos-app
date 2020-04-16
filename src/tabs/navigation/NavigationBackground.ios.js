import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet } from 'react-native';
import { BlurView as RNBlurView } from '@react-native-community/blur';

export const NavigationBackground = ({ scrollY, scrollDistance, blur }) => {
  const opacity = scrollY.interpolate({
    inputRange: [0, scrollDistance],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={{
        opacity: blur ? 1 : opacity,
        ...StyleSheet.absoluteFill,
      }}
    >
      <RNBlurView
        blurAmount={32}
        style={StyleSheet.absoluteFill}
        blurType="material"
      />
    </Animated.View>
  );
};

NavigationBackground.propTypes = {
  blur: PropTypes.bool,
  scrollDistance: PropTypes.number,
  scrollY: PropTypes.shape({
    interpolate: PropTypes.func,
  }),
};

NavigationBackground.defaultProps = {
  blur: false,
  scrollDistance: 20, // needs to match the NavigationSpacer
  scrollY: new Animated.Value(0),
};

export default NavigationBackground;
