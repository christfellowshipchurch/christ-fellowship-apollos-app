import React, { useRef } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { View, Animated } from 'react-native';
import {
  styled,
  GradientOverlayImage,
  PaddedView,
} from '@apollosproject/ui-kit';

import { ApollosPlayerContainer } from '@apollosproject/ui-media-player';
import VideoPresentationContainer from '@apollosproject/ui-media-player/src/VideoPresentationContainer';

import { ScriptureButton } from 'scripture-single';
import Publication from '../Publication';
import ButtonGroup from '../ButtonGroup';
import EventGroupings from '../EventGroupings';
import Features from '../Features';
import HTMLContent from '../HTMLContent';
import Title from '../Title';

const StyledContentHTMLViewConnected = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit * 0.5,
}))(HTMLContent);

export const ItemSeparatorComponent = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
}))(View);

export const EmbeddedVideoContainer = styled(({ theme }) => ({
  aspectRatio: 16 / 9,
  borderRadius: theme.sizing.baseBorderRadius,
  overflow: 'hidden',
}))(View);

const EmbeddedVideo = ({ VideoComponent, ControlsComponent }) => {
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

const ContentBody = ({ id, content, loading, ImageWrapperComponent }) => {
  const coverImageSources = get(content, 'coverImage.sources', []);

  return (
    <>
      {(coverImageSources.length || loading) && ImageWrapperComponent ? (
        <ImageWrapperComponent>
          <GradientOverlayImage
            isLoading={!coverImageSources.length && loading}
            source={coverImageSources}
            // Sets the ratio of the placeholder
            forceRatio={4 / 3}
            // No ratios are respected without this
            maintainAspectRatio
          />
        </ImageWrapperComponent>
      ) : null}

      {/* <CheckInButtonConnected id={content.id} ref={checkInRef} /> */}
      <Title nodeId={content.id} />

      {/* todo : fix the Publication issue */}
      {/* <Publication nodeId={content.id} /> */}

      <EventGroupings nodeId={content.id} />
      <ButtonGroup nodeId={content.id} />
      <ScriptureButton nodeId={content.id} />

      {/** note : this is a placeholder here to just keep some good code, here, for reference */}
      {/* <PaddedView>
        <ApollosPlayerContainer
          PlayerComponent={EmbeddedVideo}
          source={{
            uri:
              'https://link.theplatform.com/s/IfSiAC/media/lLAPAkVDj_sd/file.m3u8?format=redirect&formats=m3u,mpeg4',
          }}
          coverImage={
            'https://cloudfront.christfellowship.church/GetImage.ashx?guid=968dee27-537f-4f6a-91d4-4f414c1cbe3f'
          }
          presentationProps={{
            title: 'Test',
          }}
        />
      </PaddedView> */}

      <StyledContentHTMLViewConnected contentId={content.id} />

      <Features contentId={content.id} />
    </>
  );
};

ContentBody.propTypes = {
  id: PropTypes.string,
  content: PropTypes.shape({
    __typename: PropTypes.string,
    parentChannel: PropTypes.shape({
      name: PropTypes.string,
    }),
    id: PropTypes.string,
    htmlContent: PropTypes.string,
    title: PropTypes.string,
    scriptures: PropTypes.arrayOf(
      PropTypes.shape({
        /** The ID of the verse (i.e. '1CO.15.57') */
        id: PropTypes.string,
        /** A human readable reference (i.e. '1 Corinthians 15:57') */
        reference: PropTypes.string,
        /** The scripture source to render */
        html: PropTypes.string,
      })
    ),
  }),
  loading: PropTypes.bool,
  ImageWrapperComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
};

export default ContentBody;
