/**
 * ContentBlockFeature.js
 *
 * Author: Caleb Panza
 * Created: Mar 23, 2021
 *
 * Displays a single piece of content formatted without a card wrapper.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { defaultProps } from 'recompose';
import { isEmpty } from 'lodash';

import { View } from 'react-native';
import {
  ImageSourceType,
  withMediaQuery,
  styled,
  H3,
  H5,
} from '@apollosproject/ui-kit';
import HTMLView from '@apollosproject/ui-htmlview';
import InlineMediaPlayer from './InlineMediaPlayer';

// :: Methods
// :: ================================== ::
function flexDirection({ orientation, mediaQuery }) {
  const suffix =
    (mediaQuery !== 'sm' && orientation === 'RIGHT') ||
    orientation === 'INVERTED'
      ? '-reverse'
      : '';

  if (
    mediaQuery !== 'sm' &&
    (orientation === 'RIGHT' || orientation === 'LEFT')
  ) {
    return `row${suffix}`;
  }

  return `column${suffix}`;
}

// :: Components
// :: ================================== ::
const Container = styled(({ flexOptions, theme }) => ({
  flexDirection: flexDirection(flexOptions),
  padding: theme.sizing.baseUnit * 0.5,
}))(View);

const Spacing = styled(({ theme }) => ({
  flex: 1,
  padding: theme.sizing.baseUnit * 0.5,
}))(View);

// :: Styles
// :: ================================== ::
const HTMLViewSpacing = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit * 0.5,
}))(View);

const StyledH5 = styled(({ theme }) => ({
  color: theme.colors.text.tertiary,
}))(H5);

// :: Render Methods
// :: ================================== ::
const renderMedia = ({ mediaQuery, orientation, coverImage, videos }) => {
  const showMedia =
    (coverImage && !isEmpty(coverImage?.sources[0]?.uri)) || videos;

  if (showMedia) {
    return (
      <Spacing
        flexOptions={{
          orientation,
          mediaQuery,
        }}
      >
        <InlineMediaPlayer
          source={videos}
          coverImage={coverImage?.sources[0]}
        />
      </Spacing>
    );
  }

  return null;
};

const ConditionalRender = ({ condition, children }) =>
  condition ? children : null;

const ContentBlockFeature = ({
  title,
  summary,
  htmlContent,
  coverImage,
  orientation,
  mediaQuery,
  videos,
}) => {
  const showTitle = title && !isEmpty(title);
  const showSummary = summary && !isEmpty(summary);
  const showContent = htmlContent && !isEmpty(htmlContent);

  return (
    <Container
      flexOptions={{
        orientation,
        mediaQuery,
      }}
    >
      {renderMedia({ coverImage, videos, orientation, mediaQuery })}
      <Spacing
        flexOptions={{
          orientation,
          mediaQuery,
        }}
      >
        <ConditionalRender condition={showSummary}>
          <StyledH5>{summary}</StyledH5>
        </ConditionalRender>

        <ConditionalRender condition={showTitle}>
          <H3>{title}</H3>
        </ConditionalRender>

        <ConditionalRender condition={showContent}>
          <HTMLView>{htmlContent}</HTMLView>
        </ConditionalRender>
      </Spacing>
    </Container>
  );
};

ContentBlockFeature.propTypes = {
  title: PropTypes.string,
  summary: PropTypes.string,
  htmlContent: PropTypes.string,
  coverImage: ImageSourceType,
  videos: ImageSourceType,
  orientation: PropTypes.oneOf(['DEFAULT', 'INVERTED', 'LEFT', 'RIGHT']),
  mediaQuery: PropTypes.oneOf(['sm', 'md']),
};

ContentBlockFeature.defaultProps = {
  orientation: 'DEFAULT',
  mediaQuery: 'sm',
};

export default withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  defaultProps({ mediaQuery: 'sm' }),
  defaultProps({ mediaQuery: 'md' })
)(ContentBlockFeature);
