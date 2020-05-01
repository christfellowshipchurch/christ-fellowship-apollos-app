import React from 'react';
import { View, Animated, Linking } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
  styled,
  GradientOverlayImage,
  BackgroundView,
  PaddedView,
  H4,
  Button,
  // StretchyView,
} from '@apollosproject/ui-kit';
import {
  ContentHTMLViewConnected,
  HorizontalContentSeriesFeedConnected,
  MediaControlsConnected,
  LiveConsumer,
} from '@apollosproject/ui-connected';

import Features from '../Features';
import EventDateTimes from '../EventDateTimes';
import Title from '../Title';
import LiveLabel from '../../ui/LiveLabel';
import { HorizontalDivider } from '../../ui/Dividers';

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

const StyledMediaControlsConnected = styled(({ theme }) => ({
  marginTop: -(theme.sizing.baseUnit * 2.5),
}))(MediaControlsConnected);

const StyledButton = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 0.5,
}))(Button);

// TODO : temp fix until Core resolves the bug where images would disappear when pulling down
const StretchyView = ({ children, ...props }) =>
  children({ Stretchy: View, ...props });

const EventContentItem = ({ content, loading }) => {
  const coverImageSources = get(content, 'coverImage.sources', []);
  const callsToAction = get(content, 'callsToAction', []);
  const hideLabel = get(content, 'hideLabel', false);
  const buttonLabel = hideLabel
    ? 'Get Started'
    : 'Check Back Soon for More Information';
  const events = get(content, 'events', []);

  return (
    <LiveConsumer contentId={content.id}>
      {(liveStream) => {
        const isLive = !!(liveStream && liveStream.isLive);

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
                          // overlayColor={'black'}
                          // overlayType="gradient-bottom"
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
                  </View>

                  <StyledMediaControlsConnected contentId={content.id} />
                  <PaddedView>
                    {isLive && (
                      <View style={{ position: 'relative' }}>
                        <LiveLabel />
                      </View>
                    )}

                    <Title contentId={content.id} isLoading={loading} />

                    {events.length < 1 &&
                      callsToAction.length > 0 && (
                        <H4 isLoading={loading}>{buttonLabel}</H4>
                      )}

                    {events.length < 1 &&
                      callsToAction.length < 1 && (
                        <H4 isLoading={loading}>
                          Check Back Soon for More Information
                        </H4>
                      )}

                    {events.length > 0 && (
                      <EventDateTimes
                        contentId={content.id}
                        events={content.events}
                        loading={loading}
                      />
                    )}

                    {callsToAction.length > 0 &&
                      callsToAction.map((n) => (
                        <StyledButton
                          key={`${n.call}:${n.action}`}
                          isLoading={loading}
                          title={n.call}
                          pill={false}
                          onPress={() => {
                            Linking.canOpenURL(n.action).then((supported) => {
                              if (supported) {
                                Linking.openURL(n.action);
                              } else {
                                console.log(
                                  `Don't know how to open URI: ${n.action}`
                                );
                              }
                            });
                          }}
                        />
                      ))}

                    <HorizontalDivider />
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
      }}
    </LiveConsumer>
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
