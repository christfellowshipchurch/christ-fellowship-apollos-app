import React from 'react';
import { styled } from '@apollosproject/ui-kit';
import { StyleSheet, View, ImageBackground, StatusBar } from 'react-native';

export const Overlay = styled(({ theme }) => ({
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.colors.black,
    opacity: theme.alpha.high,
}))(View);

export default ({ children }) => (
    <ImageBackground
        style={{ ...StyleSheet.absoluteFill }}
        source={require('./auth_background.jpg')}
    >
        <StatusBar
            barStyle="light-content"
            backgroundColor={'transparent'}
            translucent
        />
        <Overlay />
        {children}
    </ImageBackground>
);
