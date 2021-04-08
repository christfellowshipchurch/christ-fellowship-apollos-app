import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  usePlayerControls,
  PictureMode,
} from '@apollosproject/ui-media-player';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';

import { View, Animated, StyleSheet } from 'react-native';
import { styled, withTheme, FlexedView } from '@apollosproject/ui-kit';
import StatusBar from 'ui/StatusBar';

import ScreenOrientation, {
  PORTRAIT,
  LANDSCAPE,
} from 'react-native-orientation-locker/ScreenOrientation';

import { ChatChannel } from '../../stream-chat';
import { useStreamChat } from '../../stream-chat/context';

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

const BlackBars = styled(({ theme }) => ({
  backgroundColor: theme.colors.black,
  zIndex: 1000,
}))(View);

const LiveStreamPlayer = ({
  VideoComponent,
  ControlsComponent,
  useNativeFullscreeniOS,
  theme,
}) => {
  const navigation = useNavigation();
  const { channel } = useStreamChat();
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
        navigation.setOptions({
          headerShown: false,
        });
        setOrientation(LANDSCAPE);
      }

      if (
        !orientation.startsWith(PORTRAIT) &&
        pictureMode === PictureMode.Normal
      ) {
        navigation.setOptions({
          headerShown: true,
        });
        setOrientation(PORTRAIT);
      }
    },
    [pictureMode]
  );

  return (
    <FlexedView>
      <View
        style={[
          {
            position: 'absolute',
            paddingBottom: insets.bottom,
            backgroundColor: theme.colors.background.paper,
          },
          StyleSheet.absoluteFillObject,
        ]}
      >
        <StatusBar />

        <ChatChannel channel={channel} withMedia>
          <BlackBars isFullScreen={isFullScreen} insets={insets}>
            <StatusBar barStyle="light-content" />
            <ScreenOrientation
              orientation={orientation}
              onDeviceChange={(newOrientation) => {
                setOrientation(newOrientation);
              }}
            />
            <AspectRatio isFullScreen={isFullScreen} insets={insets}>
              <VideoComponent useNativeFullscreeniOS={useNativeFullscreeniOS} />
              <ControlsComponent collapsedAnimation={collapsedAnimation} />
            </AspectRatio>
          </BlackBars>
        </ChatChannel>
      </View>
    </FlexedView>
  );
};

LiveStreamPlayer.propTypes = {
  VideoComponent: PropTypes.oneOf([PropTypes.func, PropTypes.element]),
  ControlsComponent: PropTypes.oneOf([PropTypes.func, PropTypes.element]),
  useNativeFullscreeniOS: PropTypes.bool,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      background: PropTypes.shape({
        paper: PropTypes.string,
      }),
    }),
  }),
};

export default withTheme()(LiveStreamPlayer);
