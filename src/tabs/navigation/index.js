import React from 'react';
import PropTypes from 'prop-types';
import { Animated, View, StyleSheet } from 'react-native';
import { BlurView as RNBlurView } from '@react-native-community/blur';
import { DynamicValue, useDynamicValue } from 'react-native-dark-mode';
import {
    BackgroundView as ApollosBackgroundView,
    styled,
} from '@apollosproject/ui-kit';
import HeaderRight from './HeaderRight';

// eslint-disable-next-line import/prefer-default-export
export const navigationOptions = {
    // props
    headerTransparent: true,
    // header components
    headerRight: <HeaderRight />,
    // headerBackground: <BlurView style={StyleSheet.absoluteFill} />,
    // styles
    headerStyle: {
        // backgroundColor: 'black',
        shadowRadius: 0,
        shadowOffset: {
            height: 0,
        },
        shadowColor: 'transparent',
        elevation: 0,
        borderBottomWidth: 0,
    },
    headerTitleStyle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
};

export const BackgroundView = ({ headerHeight, children }) => (
    <ApollosBackgroundView>{children}</ApollosBackgroundView>
);

const dynamicBlurType = new DynamicValue('light', 'dark');

export const BlurView = ({ scrollY, scrollDistance }) => {
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

BlurView.propTypes = {
    scrollDistance: PropTypes.number,
};

BlurView.defaultProps = {
    scrollDistance: 20,
    scrollY: new Animated.Value(0),
};

export const HeaderSpacer = () => <View style={{ height: 64 }} />;
export const HEADER_OFFSET = 64;
