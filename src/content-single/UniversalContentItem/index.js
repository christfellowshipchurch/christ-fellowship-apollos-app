import React from 'react'
import { Animated, View, Image } from 'react-native'
import { get } from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import {
  ContentHTMLViewConnected,
  HorizontalContentSeriesFeedConnected,
  MediaControlsConnected,
} from '@apollosproject/ui-connected'
import {
  styled,
  GradientOverlayImage,
  BackgroundView,
  PaddedView,
  FlexedView,
  Avatar,
  H2,
  H5,
  H6,
  // StretchyView,
} from '@apollosproject/ui-kit'

import { StackedImageCard } from '../../ui/Cards'
import Features from '../Features'

const DATE_FORMAT = 'MMMM D, YYYY'

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView)

const AuthorContainer = styled(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignContent: 'center', 
  paddingBottom: 20,
}))(FlexedView);

const TextContainer = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit * 0.5,
  justifyContent: 'center',
  paddingLeft: 15,
}))(FlexedView);

const StyledH6 = styled(({ theme }) => ({
  color: theme.colors.text.tertiary,
}))(H6);

const Title = styled(({ theme }) => ({
  fontWeight: 'bold',
}))(H5);

// TODO : temp fix until Core resolves the bug where images would disappear when pulling down
const StretchyView = ({ children, ...props }) =>
  children({ Stretchy: View, ...props })

const StyledMediaControlsConnected = styled(({ theme }) => ({
  marginTop: -(theme.sizing.baseUnit * 2.5),
}))(MediaControlsConnected)

const UniversalContentItem = ({ content, loading }) => {
  const coverImageSources = get(content, 'coverImage.sources', [])
  const authorImageSources = get(content, 'author.photo', [])
  const firstName = get(content, 'author.firstName', '')
  const lastName = get(content, 'author.lastName', '')
  const authorName = `${firstName} ${lastName}`
  const publishDate = moment(get(content, 'publishDate', '')).format(DATE_FORMAT)

  console.log({content})
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
              <H2 padded isLoading={!content.title && loading}>
                {content.title}
              </H2>
              <AuthorContainer>
                <Avatar
                    source={authorImageSources}
                    size="medium"
                />
                <TextContainer>
                    <Title numberOfLines={2} ellipsizeMode="tail">
                      {authorName}
                    </Title>

                    <StyledH6 numberOfLines={2} ellipsizeMode="tail">
                      {publishDate}
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
  )
}

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
}

export default UniversalContentItem
