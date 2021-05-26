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
  Button,
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
const StyledH3 = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit,
}))(H3);

const StyledH5 = styled(({ theme }) => ({
  color: theme.colors.text.tertiary,
  paddingBottom: theme.sizing.baseUnit * 0.5,
}))(H5);

const StyledButton = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 0.25,
}))(Button);

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
          source={videos[0]?.sources[0]}
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
  subtitle,
  htmlContent,
  coverImage,
  orientation,
  mediaQuery,
  videos,
  actions,
  onPressItem,
}) => {
  const showTitle = title && !isEmpty(title);
  const showSubtitle = subtitle && !isEmpty(subtitle);
  const showContent = htmlContent && !isEmpty(htmlContent);
  const showActions = !isEmpty(actions) && Array.isArray(actions);

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
        <ConditionalRender condition={showTitle}>
          <StyledH3>{title}</StyledH3>
        </ConditionalRender>

        <ConditionalRender condition={showSubtitle}>
          <StyledH5>{subtitle}</StyledH5>
        </ConditionalRender>

        <ConditionalRender condition={showContent}>
          <HTMLView>{htmlContent}</HTMLView>
        </ConditionalRender>

        <ConditionalRender condition={showActions}>
          {Array.isArray(actions) &&
            actions.map(({ title: actionTitle, action, relatedNode }, i) => (
              <StyledButton
                key={`${title}${relatedNode?.id}`}
                title={actionTitle}
                onPress={() => onPressItem({ action, relatedNode })}
                bordered={i > 0}
                pill={false}
              />
            ))}
        </ConditionalRender>
      </Spacing>
    </Container>
  );
};

ContentBlockFeature.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  htmlContent: PropTypes.string,
  coverImage: ImageSourceType,
  videos: ImageSourceType,
  orientation: PropTypes.oneOf(['DEFAULT', 'INVERTED', 'LEFT', 'RIGHT']),
  mediaQuery: PropTypes.oneOf(['sm', 'md']),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      action: PropTypes.string,
      relatedNode: PropTypes.shape({
        id: PropTypes.string,
      }),
    })
  ),
  onPressItem: PropTypes.func,
};

ContentBlockFeature.defaultProps = {
  orientation: 'DEFAULT',
  mediaQuery: 'sm',
  actions: [],
  onPressItem: () => null,
};

export default withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  defaultProps({ mediaQuery: 'sm' }),
  defaultProps({ mediaQuery: 'md' })
)(ContentBlockFeature);
