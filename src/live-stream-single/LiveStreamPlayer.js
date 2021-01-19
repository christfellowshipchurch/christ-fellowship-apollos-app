import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  usePlayerControls,
  PictureMode,
} from '@apollosproject/ui-media-player';

import { View, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styled, FlexedView } from '@apollosproject/ui-kit';

import StatusBar from 'ui/StatusBar';
import ScreenOrientation, {
  PORTRAIT,
  LANDSCAPE,
} from 'react-native-orientation-locker/ScreenOrientation';

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
}))(View);

const LiveStreamPlayer = ({
  VideoComponent,
  ControlsComponent,
  useNativeFullscreeniOS,
  children,
}) => {
  const insets = useSafeAreaInsets();
  const { pictureMode, setPictureMode } = usePlayerControls();
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

  // TODO : figure out how to get the picture mode to change when the device orientation changes
  // useEffect(
  //   () => {

  //     if (orientation.startsWith(PORTRAIT)) {
  //       setPictureMode(PictureMode.Normal);
  //     }

  //     if (orientation.startsWith(LANDSCAPE)) {
  //       console.log('GO TO LANDSCAPE');
  //       setPictureMode(PictureMode.Fullscreen);
  //     }
  //   },
  //   [orientation]
  // );

  return (
    <FlexedView>
      <BlackBars isFullScreen={isFullScreen} insets={insets}>
        <StatusBar barStyle="light-content" />
        <ScreenOrientation
          orientation={orientation}
          // onChange={(newOrientation) => {
          //   setOrientation(newOrientation);
          // }}
          onDeviceChange={(newOrientation) => {
            setOrientation(newOrientation);
          }}
        />
        <AspectRatio isFullScreen={isFullScreen} insets={insets}>
          <VideoComponent useNativeFullscreeniOS={useNativeFullscreeniOS} />
          {!isFullScreen && (
            <ControlsComponent collapsedAnimation={collapsedAnimation} />
          )}
        </AspectRatio>
      </BlackBars>
      {children}
    </FlexedView>
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
