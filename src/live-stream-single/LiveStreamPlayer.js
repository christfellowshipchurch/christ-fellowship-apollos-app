import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  usePlayerControls,
  PictureMode,
} from '@apollosproject/ui-media-player';

import { View, Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styled, FlexedView } from '@apollosproject/ui-kit';
import { OverlayProvider as ChatOverlayProvider } from 'stream-chat-react-native';
import StatusBar from 'ui/StatusBar';

import ScreenOrientation, {
  PORTRAIT,
  LANDSCAPE,
} from 'react-native-orientation-locker/ScreenOrientation';

import { ChatChannel } from '../stream-chat';
import CloseButton from './CloseButton';

import { useStreamChatChannel } from './LiveStreamSingle';

const AspectRatio = styled(({ isFullScreen }) => ({
  ...(isFullScreen
    ? {
        height: '100%',
        width: '100%',
      }
    : {
        aspectRatio: 16 / 9,
        width: '100%',
      }),
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'salmon',
}))(View);

const BlackBars = styled(({ theme, insets, isFullScreen }) => ({
  backgroundColor: theme.colors.black,
  paddingTop: isFullScreen ? 0 : insets.top + theme.sizing.baseUnit,
  paddingLeft: isFullScreen ? insets.left + theme.sizing.baseUnit : 0,
  paddingRight: isFullScreen ? insets.right + theme.sizing.baseUnit : 0,
  zIndex: 1000,
}))(View);

const LiveStreamPlayer = ({
  VideoComponent,
  ControlsComponent,
  useNativeFullscreeniOS,
}) => {
  const streamChatId = useStreamChatChannel();
  const insets = useSafeAreaInsets();
  const { pictureMode } = usePlayerControls();
  const [orientation, setOrientation] = useState(PORTRAIT);

  const animatedValue = new Animated.Value(0);
  const collapsedAnimation = animatedValue.interpolate({
    inputRange: [0, 0],
    outputRange: [0, 0],
  });

  const isFullScreen = pictureMode === PictureMode.Fullscreen;

  /**
   * When the picture mode changes, update the screen orientation accordingly
   */
  useEffect(
    () => {
      if (
        !orientation.startsWith(LANDSCAPE) &&
        pictureMode === PictureMode.Fullscreen
      ) {
        setOrientation(LANDSCAPE);
      }

      if (
        !orientation.startsWith(PORTRAIT) &&
        pictureMode === PictureMode.Normal
      ) {
        setOrientation(PORTRAIT);
      }
    },
    [pictureMode]
  );

  return (
    <ChatOverlayProvider bottomInset={insets.bottom} topInset={211 + 66 + 66}>
      <FlexedView>
        <View style={[{ position: 'absolute' }, StyleSheet.absoluteFillObject]}>
          <StatusBar />
          <CloseButton />

          <ChatChannel streamChatChannel={{ id: streamChatId }} withMedia>
            <BlackBars isFullScreen={isFullScreen} insets={insets}>
              <StatusBar barStyle="light-content" />
              <ScreenOrientation
                orientation={orientation}
                onDeviceChange={(newOrientation) => {
                  setOrientation(newOrientation);
                }}
              />
              <AspectRatio isFullScreen={isFullScreen} insets={insets}>
                <VideoComponent
                  useNativeFullscreeniOS={useNativeFullscreeniOS}
                />
                {!isFullScreen && (
                  <ControlsComponent collapsedAnimation={collapsedAnimation} />
                )}
              </AspectRatio>
            </BlackBars>
          </ChatChannel>
        </View>
      </FlexedView>
    </ChatOverlayProvider>
  );
};

LiveStreamPlayer.propTypes = {
  VideoComponent: PropTypes.oneOf([PropTypes.func, PropTypes.element]),
  ControlsComponent: PropTypes.oneOf([PropTypes.func, PropTypes.element]),
  useNativeFullscreeniOS: PropTypes.bool,
  children: PropTypes.oneOf([
    PropTypes.func,
    PropTypes.element,
    PropTypes.array,
  ]),
};

export default LiveStreamPlayer;
