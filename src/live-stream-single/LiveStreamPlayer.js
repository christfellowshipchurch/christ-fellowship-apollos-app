import React from 'react';
import PropTypes from 'prop-types';

import { View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled, FlexedView } from '@apollosproject/ui-kit';
import StatusBar from 'ui/StatusBar';

const AspectRatio = styled(() => ({
  aspectRatio: 16 / 9,
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}))(View);

const BlackBars = styled(({ theme }) => ({
  backgroundColor: theme.colors.black,
}))(View);

const LiveStreamPlayer = ({
  VideoComponent,
  ControlsComponent,
  useNativeFullscreeniOS,
  children,
}) => {
  const animatedValue = new Animated.Value(0);
  const collapsedAnimation = animatedValue.interpolate({
    inputRange: [0, 0],
    outputRange: [0, 0],
  });

  return (
    <FlexedView>
      <BlackBars>
        <StatusBar barStyle="light-content" />
        <SafeAreaView edges={['right', 'top', 'left']}>
          <AspectRatio>
            <VideoComponent useNativeFullscreeniOS={useNativeFullscreeniOS} />
            <ControlsComponent collapsedAnimation={collapsedAnimation} />
          </AspectRatio>
        </SafeAreaView>
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
