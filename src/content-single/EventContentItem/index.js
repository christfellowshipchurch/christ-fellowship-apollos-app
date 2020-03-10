import React from 'react';
import { View, Animated } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
  styled,
  withTheme,
  GradientOverlayImage,
  BackgroundView,
  PaddedView,
  H2,
  H4,
  BodyText,
  Button,
  // StretchyView,
} from '@apollosproject/ui-kit';
import {
  ContentHTMLViewConnected,
  HorizontalContentSeriesFeedConnected,
  MediaControlsConnected,
} from '@apollosproject/ui-connected';
import { UserWebBrowserConsumer } from '../../user-web-browser';
import Features from '../Features';
import EventDateTimes from '../EventDateTimes';
import { connect } from 'formik';

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

const StyledMediaControlsConnected = styled(({ theme }) => ({
  marginTop: -(theme.sizing.baseUnit * 2.5),
}))(MediaControlsConnected);

const TitleContainer = styled(() => ({
  position: 'absolute',
  bottom: 20,
  left: 0,
  width: '100%',
}))(PaddedView);

const Title = styled(({ theme }) => ({
  color: theme.colors.white,
}))(H2);

const Summary = styled(({ theme }) => ({
  color: theme.colors.white,
}))(BodyText);

const StyledButton = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 0.5,
}))(Button);

const Subtitle = withTheme(({ theme, extraSpacing }) => ({
  style: {
    marginTop: extraSpacing
      ? theme.sizing.baseUnit
      : theme.sizing.baseUnit * 0.5,
  },
}))(H4);

// TODO : temp fix until Core resolves the bug where images would disappear when pulling down
const StretchyView = ({ children, ...props }) =>
  children({ Stretchy: View, ...props });

const EventContentItem = ({ content, loading, navigation }) => {
  const coverImageSources = get(content, 'coverImage.sources', []);
  const callsToAction = get(content, 'callsToAction', []);
  const hideLabel = get(content, 'hideLabel', false)
  const buttonLabel = hideLabel
    ? 'Get Started'
    : 'Check Back Soon for More Information'

  console.log({content})
  return (
    <BackgroundView>
      <StretchyView>
        {({ Stretchy, ...scrollViewProps }) => (
          <FlexedScrollView {...scrollViewProps}>
            <View>
              {coverImageSources.length || loading ? (
                <Stretchy>
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
                    maintainAspectRatio
                  />
                </Stretchy>
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

            <StyledMediaControlsConnected contentId={content.id} />
            <PaddedView>

              {content.events.length < 1 && callsToAction.length > 0 &&
                <H4>{buttonLabel}</H4>
              }

              {content.events.length < 1 && callsToAction.length < 1 &&
                <H4>Check Back Soon for More Information</H4>
              }

              {content.events.length > 0 &&
                <EventDateTimes
                  contentId={content.id}
                  events={content.events}
                  loading={loading}
                />
              }
              

              {callsToAction.length > 0 && (
                <UserWebBrowserConsumer>
                  {(openUrl) =>
                    callsToAction.map((n) => (
                      <StyledButton
                        key={`${n.call}:${n.action}`}
                        title={n.call}
                        pill={false}
                        onPress={() => openUrl(n.action)}
                      />
                    ))
                  }
                </UserWebBrowserConsumer>
              )}

              <Subtitle extraSpacing={callsToAction.length > 0}>
                Details
              </Subtitle>
              <ContentHTMLViewConnected contentId={content.id} />
              <Features contentId={content.id} />
            </PaddedView>
            <HorizontalContentSeriesFeedConnected
              contentId={content.id}
              relatedTitle="Events"
            />
          </FlexedScrollView>
        )}
      </StretchyView>
    </BackgroundView>
  );
};

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
    events: PropTypes.array,
    summary: PropTypes.string,
  }),
  loading: PropTypes.bool,
};

export default EventContentItem;
