import React from 'react';
import { Platform, StatusBar, Animated, View } from 'react-native';
import { get } from 'lodash';
import {
    BackgroundView as ApollosBackgroundView,
    UIText,
    styled,
    withTheme,
    Touchable,
    Icon,
} from '@apollosproject/ui-kit';
import NavigationBackground from './NavigationBackground';
import HeaderRight from './HeaderRight';

const TitleContainer = styled(({ theme }) => ({
    paddingHorizontal: theme.sizing.baseUnit,
}))(View);

const Title = styled(({ theme }) => ({
    fontWeight: 'bold',
    fontSize: 22,
    ...Platform.select({
        ios: {
            lineHeight: 0,
        },
    }),
}))(UIText);

const TitleWithArrow = styled(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
}))(View);

const BackArrow = withTheme(({ theme }) => ({
    name: 'arrow-back',
    size: 18,
    fill: theme.colors.text.teriary,
    style: {
        marginRight: theme.sizing.baseUnit * 0.25,
    },
}))(Icon);

export { default as NavigationSpacer } from './NavigationSpacer';
export { default as useHeaderScrollEffect } from './useHeaderScrollEffect';
export { default as NavigationBackground } from './NavigationBackground';
export { default as HeaderRight } from './HeaderRight';

// eslint-disable-next-line import/prefer-default-export
export const navigationOptions = ({
    navigation,
    theme,
    blur = false,
    title,
    ...additionalProps
}) => ({
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
    headerBackground: (
        <NavigationBackground
            scrollY={get(navigation, 'state.params.scrollY', new Animated.Value(0))}
            blur={blur}
        />
    ),
    // header components
    headerRight: navigation.getParam('nested') ? null : <HeaderRight />,
    headerTitle: (
        <TitleContainer>
            {navigation.getParam('nested') ? (
                <Touchable onPress={() => navigation.goBack(null)}>
                    <TitleWithArrow>
                        <BackArrow />
                        <Title>{title}</Title>
                    </TitleWithArrow>
                </Touchable>
            ) : (
                    <Title>{title}</Title>
                )}
        </TitleContainer>
    ),
    // styles
    headerStyle: {
        shadowRadius: 0,
        shadowOffset: {
            height: 0,
        },
        shadowColor: 'transparent',
        elevation: 0,
        borderBottomWidth: 0,
        paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    },
    ...additionalProps,
});

export const BackgroundView = ({ children }) => (
    <ApollosBackgroundView>{children}</ApollosBackgroundView>
);

export const HEADER_OFFSET = Platform.select({ ios: 64, android: 0 });
export const SCROLL_DISTANCE = 20;
