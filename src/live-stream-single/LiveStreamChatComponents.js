/**
 * LiveStreamChatComponents.js
 *
 * Author: Caleb Panza
 * Created: Jan 19, 2021
 *
 * This file exists just to help organize the Live Stream Chat spacing and alignment components into a separate file from the rest of the Live Stream stuff.
 */

import React, { useRef, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { View, Animated, Platform } from 'react-native';
import {
  usePlayerControls,
  PictureMode,
} from '@apollosproject/ui-media-player';
import AirPlayButton from '@apollosproject/ui-media-player/src/AirPlayButton';
import { styled, Icon, withTheme, Touchable } from '@apollosproject/ui-kit';

import BlurView from 'ui/BlurView';

const StyledAirPlayButton = withTheme(
  ({ theme }) => ({
    style: {
      height: 18,
      width: 18,
    },
    activeTintColor: theme?.colors?.primary,
    tintColor: theme?.colors?.text?.primary,
  }),
  'ApollosPlayer.FullscreenPresentation.FullscreenControls.AirPlayButton'
)(AirPlayButton);

const ChatIcon = withTheme(({ theme, highlight }) => ({
  fill: highlight ? theme.colors.primary : theme.colors.text.primary,
  size: 18,
}))(Icon);

const ControlsSpacing = styled(({ theme, insets }) => ({
  flex: 1,
  justifyContent: 'space-around',
  alignItems: 'flex-end',
  padding: insets.top + theme.sizing.baseUnit,
}))(View);

const ControlIconSpacing = withTheme(({ theme }) => ({
  blurType: 'thickMaterial',
  style: {
    padding: theme.sizing.baseUnit * 0.5,
    borderRadius: theme.sizing.baseBorderRadius,
  },
}))(BlurView);

const PortraitSpacing = styled(({ theme, insets }) => ({
  backgroundColor: theme.colors.background.paper,
  paddingBottom: insets.bottom - theme.sizing.baseUnit,
  flex: 1,
  zIndex: 0,
}))(View);

const LandscapeSpacing = styled(({ theme, insets }) => ({
  flex: 1,
  position: 'absolute',
  top: insets.bottom - theme.sizing.baseUnit,
  bottom: insets.bottom - theme.sizing.baseUnit,
  left: insets.top,
  borderRadius: theme.sizing.baseBorderRadius,
}))(BlurView);

const AbsoluteFill = styled(() => ({
  flex: 1,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  position: 'absolute',
  flexDirection: 'row',
}))(View);

// eslint-disable-next-line import/prefer-default-export
export const ChatSpacing = ({ children }) => {
  const insets = useSafeAreaInsets();
  const {
    pictureMode,
    isPlaying,
    play,
    pause,
    setPictureMode,
  } = usePlayerControls();
  const isFullScreen = pictureMode === PictureMode.Fullscreen;
  const [showChat, setShowChat] = useState(isFullScreen);

  const chatOpacity = useRef(new Animated.Value(showChat ? 1 : 0)).current;
  const chatButtonOpacity = useRef(new Animated.Value(0)).current;
  const updateOpacity = (animatedValue, toValue) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  useEffect(
    () => {
      updateOpacity(chatOpacity, showChat ? 1 : 0);
      updateOpacity(chatButtonOpacity, showChat ? 0 : 1);
    },
    [showChat]
  );

  if (isFullScreen)
    return (
      <AbsoluteFill pointerEvents="box-none">
        <Animated.View
          style={{
            flex: 1,
            opacity: chatOpacity,
          }}
        >
          <LandscapeSpacing insets={insets} blurType="thinMaterial">
            {children}
          </LandscapeSpacing>
        </Animated.View>

        <ControlsSpacing insets={insets}>
          <ControlIconSpacing insets={insets}>
            <Touchable
              onPress={() => {
                setShowChat(!showChat);
              }}
            >
              <ChatIcon highlight={showChat} name={'chat-conversation'} />
            </Touchable>
          </ControlIconSpacing>

          <ControlIconSpacing insets={insets}>
            <Touchable onPress={isPlaying ? pause : play}>
              <ChatIcon
                chatIsVisible={showChat}
                name={isPlaying ? 'pause' : 'play'}
              />
            </Touchable>
          </ControlIconSpacing>

          <ControlIconSpacing insets={insets}>
            <Touchable
              onPress={() => {
                setPictureMode(PictureMode.Normal);
              }}
            >
              <ChatIcon chatIsVisible={showChat} name={'arrow-in'} />
            </Touchable>
          </ControlIconSpacing>

          {Platform.OS === 'ios' && (
            <ControlIconSpacing insets={insets}>
              <StyledAirPlayButton />
            </ControlIconSpacing>
          )}
        </ControlsSpacing>
      </AbsoluteFill>
    );

  return <PortraitSpacing insets={insets}>{children}</PortraitSpacing>;
};
