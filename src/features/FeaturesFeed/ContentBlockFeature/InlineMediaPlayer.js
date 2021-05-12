/**
 * InlineMediaPlayer.js
 *
 * Author: Caleb Panza
 * Created: Mar 24, 2021
 *
 * Media Player that renders inline
 */

import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { View, Animated } from 'react-native';
import {
  styled,
  withTheme,
  ImageSourceType,
  GradientOverlayImage,
} from '@apollosproject/ui-kit';

import { ApollosPlayerContainer } from '@apollosproject/ui-media-player';
import VideoPresentationContainer from '@apollosproject/ui-media-player/src/VideoPresentationContainer';

// :: Styles
// :: ================================== ::
const EmbeddedVideoContainer = styled(({ theme }) => ({
  aspectRatio: 16 / 9,
  borderRadius: theme.sizing.baseBorderRadius,
  overflow: 'hidden',
}))(View);

const CoverImage = withTheme(({ theme }) => ({
  forceRatio: 16 / 9,
  style: {
    borderRadius: theme.sizing.baseBorderRadius,
  },
}))(GradientOverlayImage);

// :: Components
// :: ================================== ::
const EmbeddedVideo = ({ VideoComponent, ControlsComponent }) => {
  if (!VideoComponent || !ControlsComponent) return null;

  // note : hack to remove the colored overlay on the video controls
  const animatedValue = new Animated.Value(0);
  const collapsedAnimation = animatedValue.interpolate({
    inputRange: [0, 0],
    outputRange: [0, 0],
  });

  return (
    <EmbeddedVideoContainer>
      <VideoPresentationContainer
        VideoComponent={VideoComponent}
        useNativeFullscreeniOS
      />
      <ControlsComponent collapsedAnimation={collapsedAnimation} />
    </EmbeddedVideoContainer>
  );
};

EmbeddedVideo.propTypes = {
  ControlsComponent: PropTypes.node,
  VideoComponent: PropTypes.node,
};

const InlineMediaPlayer = ({ coverImage, source, title }) => {
  if (isEmpty(coverImage) && isEmpty(source)) return null;

  if (isEmpty(source)) return <CoverImage source={coverImage} />;

  return (
    <ApollosPlayerContainer
      PlayerComponent={EmbeddedVideo}
      source={Array.isArray(source) ? source[0] : source}
      coverImage={coverImage}
      presentationProps={{
        title,
      }}
    />
  );
};

InlineMediaPlayer.propTypes = {
  coverImage: ImageSourceType,
  source: ImageSourceType,
  title: PropTypes.string,
};
InlineMediaPlayer.defaultProps = {};

export default InlineMediaPlayer;
