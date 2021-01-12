import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
  styled,
  GradientOverlayImage,
  PaddedView,
} from '@apollosproject/ui-kit';

import { ScriptureButton } from 'scripture-single';
import Title from '../Title';
import Features from '../Features';
import Author from '../Author';
import HTMLContent from '../HTMLContent';

const StyledContentHTMLViewConnected = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit * 0.5,
}))(HTMLContent);

const UniversalContentItem = ({ content, loading, ImageWrapperComponent }) => {
  const coverImageSources = get(content, 'coverImage.sources', []);

  return (
    <>
      {(coverImageSources.length || loading) && ImageWrapperComponent ? (
        <ImageWrapperComponent>
          <GradientOverlayImage
            isLoading={!coverImageSources.length && loading}
            source={coverImageSources}
            // Sets the ratio of the image
            minAspectRatio={1}
            maxAspectRatio={1}
            // Sets the ratio of the placeholder
            forceRatio={1}
            // No ratios are respected without this
            maintainAspectRatio
          />
        </ImageWrapperComponent>
      ) : null}
      {/* fixes text/navigation spacing by adding vertical padding if we dont have an image */}
      <PaddedView vertical={!coverImageSources.length}>
        {/* title */}
        <Title contentId={content.id} isLoading={loading} />
        {/* author */}
        <Author contentId={content.id} />
        {/* Scripture */}
        <ScriptureButton nodeId={content.id} />
        {/* body content */}
        <StyledContentHTMLViewConnected contentId={content.id} />
      </PaddedView>
      <Features contentId={content.id} />
    </>
  );
};

UniversalContentItem.propTypes = {
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

export default UniversalContentItem;
