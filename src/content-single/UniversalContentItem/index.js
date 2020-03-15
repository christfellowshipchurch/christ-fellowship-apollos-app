import React from 'react';
import { Animated, View, Platform } from 'react-native';
import { get } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  ContentHTMLViewConnected,
  HorizontalContentSeriesFeedConnected,
  MediaControlsConnected,
} from '@apollosproject/ui-connected';
import {
  styled,
  GradientOverlayImage,
  BackgroundView,
  PaddedView,
  FlexedView,
  Avatar,
  H2,
  H3,
  H5,
  H6,
  // StretchyView,
} from '@apollosproject/ui-kit';

import Features from '../Features';

const DATE_FORMAT = 'MMMM D, YYYY';

const calculateReadTime = (string) => {
  const wordCount = string.split(' ').length;
  const time = Math.round(wordCount / 225);
  return time < 1 ? '1' : time;
};

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

const AuthorContainer = styled(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  marginBottom: 20,
}))(FlexedView);

const TextContainer = styled(({ theme }) => ({
  justifyContent: 'center',
  paddingLeft: theme.sizing.baseUnit * 0.5,
}))(FlexedView);

const StyledH6 = styled(({ theme, color = 'primary' }) => ({
  color: theme.colors.text[color],
}))(H6);

const StyledAvatar = styled(({ theme }) => ({
  ...Platform.select(theme.shadows.default),
}))(Avatar);

// TODO : temp fix until Core resolves the bug where images would disappear when pulling down
const StretchyView = ({ children, ...props }) =>
  children({ Stretchy: View, ...props });

const StyledMediaControlsConnected = styled(({ theme }) => ({
  marginTop: -(theme.sizing.baseUnit * 2.5),
}))(MediaControlsConnected);

const UniversalContentItem = ({ content, loading }) => {
  const coverImageSources = get(content, 'coverImage.sources', []);
  const authorImageSources = get(content, 'author.photo', []);
  const firstName = get(content, 'author.firstName', '');
  const lastName = get(content, 'author.lastName', '');
  const authorName = `${firstName} ${lastName}`;
  const publishDate =
    get(content, 'publishDate', '') !== ''
      ? moment(content.publishDate).format(DATE_FORMAT)
      : moment().format(DATE_FORMAT);

  return (
    <BackgroundView>
      <StretchyView>
        {({ Stretchy, ...scrollViewProps }) => (
          <FlexedScrollView {...scrollViewProps}>
            {coverImageSources.length || loading ? (
              <Stretchy>
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
              </Stretchy>
            ) : null}
            <StyledMediaControlsConnected contentId={content.id} />
            {/* fixes text/navigation spacing by adding vertical padding if we dont have an image */}
            <PaddedView vertical={!coverImageSources.length}>
              <H3 padded isLoading={!content.title && loading}>
                {content.title}
              </H3>
              <AuthorContainer>
                <StyledAvatar source={authorImageSources} size="small" />
                <TextContainer>
                  <StyledH6
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    isLoading={loading}
                  >
                    {authorName}
                  </StyledH6>

                  <StyledH6
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    isLoading={loading}
                    color="tertiary"
                  >
                    {`${publishDate} • ${calculateReadTime(
                      get(content, 'htmlContent', '')
                    )} min`}
                  </StyledH6>
                </TextContainer>
              </AuthorContainer>
              <ContentHTMLViewConnected contentId={content.id} />
            </PaddedView>
            <Features contentId={content.id} />
            <HorizontalContentSeriesFeedConnected contentId={content.id} />
          </FlexedScrollView>
        )}
      </StretchyView>
    </BackgroundView>
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
};

export default UniversalContentItem;
