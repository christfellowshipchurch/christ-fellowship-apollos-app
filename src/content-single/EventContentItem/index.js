import React from 'react'
import { View, ScrollView } from 'react-native'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import {
  styled,
  GradientOverlayImage,
  BackgroundView,
  PaddedView,
  H2,
  H4,
  BodyText,
  Button
} from '@apollosproject/ui-kit'
import MediaControls from '../MediaControls'
import HTMLContent from '../HTMLContent'
import HorizontalContentFeed from '../HorizontalContentFeed'
import Features from '../Features'
import EventSchedule from '../EventSchedule'

const FlexedScrollView = styled({ flex: 1 })(ScrollView)

const TitleContainer = styled(({ theme }) => ({
  position: 'absolute',
  bottom: 20,
  left: 0,
  width: '100%',
}))(PaddedView)

const Title = styled(({ theme }) => ({
  color: theme.colors.white
}))(H2)

const Summary = styled(({ theme }) => ({
  color: theme.colors.white
}))(BodyText)

const StyledButton = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 0.25
}))(Button)

const Subtitle = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit * 2
}))(H4)

const EventContentItem = ({ content, loading }) => {
  const coverImageSources = get(content, 'coverImage.sources', [])
  const callsToAction = get(content, 'callsToAction', [])
  return (
    <BackgroundView>
      <FlexedScrollView>
        <View>
          {coverImageSources.length || loading ? (
            <GradientOverlayImage
              isLoading={!coverImageSources.length && loading}
              source={coverImageSources}
              overlayColor={'black'}
              overlayType="gradient-bottom"
              // Sets the ratio of the image
              minAspectRatio={1}
              maxAspectRatio={1}
              // Sets the ratio of the placeholder
              forceRatio={1}
              // No ratios are respected without this
              maintainAspectRatio={true}
            />
          ) : null}

          <TitleContainer>
            <Title isLoading={!content.title && loading}>
              {content.title}
            </Title>
            <Summary isLoading={!content.summary && loading}>
              {content.summary}
            </Summary>
          </TitleContainer>
        </View>

        <MediaControls contentId={content.id} />
        <PaddedView>
          <EventSchedule contentId={content.id} />

          {callsToAction.map((n, i) => (
            <StyledButton
              key={i}
              title={n.call}
              pill={false}
            />
          ))}

          <Subtitle>Event Details</Subtitle>
          <HTMLContent contentId={content.id} />
          <Features contentId={content.id} />
        </PaddedView>
        <HorizontalContentFeed contentId={content.id} />
      </FlexedScrollView>
    </BackgroundView >
  )
}

EventContentItem.propTypes = {
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
    callsToAction: PropTypes.arrayOf(
      PropTypes.shape({
        call: PropTypes.string,
        action: PropTypes.string,
      })
    ),
  }),
  loading: PropTypes.bool,
}

export default EventContentItem
