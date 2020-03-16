import React from 'react';
import { Platform } from 'react-native';
import { BackgroundView as ApollosBackgroundView } from '@apollosproject/ui-kit';
import HeaderRight from './HeaderRight';

export { default as NavigationBackground } from './NavigationBackground';
export { default as NavigationSpacer } from './NavigationSpacer';

// eslint-disable-next-line import/prefer-default-export
export const navigationOptions = {
    // In iOS, we use BlurView to dynamically blur
    // content under the header on scroll.
    // Android wasn't rendering anything, so we're going
    // to use a static color for Android instead
    ...Platform.select({
        ios: {
            headerTransparent: true,
        },
        android: {
            headerTransparent: false,
        },
    }),
    // header components
    headerRight: <HeaderRight />,
    // styles
    headerStyle: {
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

export const BackgroundView = ({ children }) => (
    <ApollosBackgroundView>{children}</ApollosBackgroundView>
);

export const HEADER_OFFSET = Platform.select({ ios: 64, android: 0 });
export const SCROLL_DISTANCE = 20;
