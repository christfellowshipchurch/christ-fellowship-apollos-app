import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet } from 'react-native';
import { BlurView as RNBlurView } from '@react-native-community/blur';
import { DynamicValue, useDynamicValue } from 'react-native-dark-mode';

const dynamicBlurType = new DynamicValue('xlight', 'extraDark');

export const NavigationBackground = ({ scrollY, scrollDistance }) => {
  const barStyle = useDynamicValue(dynamicBlurType);
  const opacity = scrollY.interpolate({
    inputRange: [0, scrollDistance],
    outputRange: [0, 1],
  });

  return (
    <Animated.View style={{ opacity, ...StyleSheet.absoluteFill }}>
      <RNBlurView
        blurAmount={32}
        style={StyleSheet.absoluteFill}
        blurType={barStyle}
      />
    </Animated.View>
  );
};

NavigationBackground.propTypes = {
  scrollDistance: PropTypes.number,
  scrollY: PropTypes.shape({
    interpolate: PropTypes.func,
  }),
};

NavigationBackground.defaultProps = {
  scrollDistance: 20,
  scrollY: new Animated.Value(0),
};

export default NavigationBackground;
