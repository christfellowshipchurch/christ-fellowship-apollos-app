import React from 'react';
import { styled } from '@apollosproject/ui-kit';
import { StyleSheet, View, ImageBackground, Image } from 'react-native';

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
        <Overlay />
        {children}
    </ImageBackground>
);
