import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { View } from 'react-native';
import { styled, GradientOverlayImage } from '@apollosproject/ui-kit';

import { FeaturesFeedConnected } from 'features';

import { ScriptureButton } from 'scripture-single';
import Publication from '../Publication';
import ButtonGroup from '../ButtonGroup';
import EventGroupings from '../EventGroupings';
import FeaturesFeed from '../FeaturesFeed';
import HTMLContent from '../HTMLContent';
import Title from '../Title';

const StyledContentHTMLViewConnected = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit * 0.5,
}))(HTMLContent);

export const ItemSeparatorComponent = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
}))(View);

const ContentBody = ({
  id,
  content,
  loading,
  error,
  ImageWrapperComponent,
}) => {
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

      <StyledContentHTMLViewConnected contentId={content.id} />

      <FeaturesFeed nodeId={content.id} />

      <ItemSeparatorComponent />
      <ItemSeparatorComponent />
      <ItemSeparatorComponent />
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
    featureFeed: PropTypes.shape({
      id: PropTypes.string,
    }),
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
