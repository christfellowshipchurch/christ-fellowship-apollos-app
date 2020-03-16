import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';

const NavigationSpacer = ({ height, scrollY, scrollDistance }) => {
    const animatedHeight = scrollY.interpolate({
        inputRange: [0, scrollDistance],
        outputRange: [height, 0],
        extrapolate: 'clamp',
    });
    return (
        <Animated.View
            style={{
                backgroundColor: 'transparent',
                height: animatedHeight,
            }}
        />
    );
};

NavigationSpacer.propTypes = {
    height: PropTypes.number,
    scrollDistance: PropTypes.number,
    scrollY: PropTypes.shape({
        interpolate: PropTypes.func,
    }),
};
NavigationSpacer.defaultProps = {
    height: 54,
    scrollDistance: 54,
    scrollY: new Animated.Value(0),
};

export default NavigationSpacer;
