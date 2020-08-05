import React from 'react';
import { View, Animated } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import {
  styled,
  GradientOverlayImage,
  BackgroundView,
  PaddedView,
  StretchyView,
} from '@apollosproject/ui-kit';
import { MediaControlsConnected } from '@apollosproject/ui-connected';
import Features from '../Features';
import Title from '../Title';
import HTMLContent from '../HTMLContent';
import ButtonWithLinkRouting from '../../ui/ButtonWithLinkRouting';
import { useLinkRouter } from '../../hooks';

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

const StyledMediaControlsConnected = styled(({ theme }) => ({
  marginTop: -(theme.sizing.baseUnit * 2.5),
}))(MediaControlsConnected);

const StyledButton = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 0.5,
}))(ButtonWithLinkRouting);

const ButtonContainer = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 0.5,
}))(View);

const InformationalContentItem = ({ content, loading, navigation }) => {
  const coverImageSources = get(content, 'coverImage.sources', []);
  const callsToAction = get(content, 'callsToAction', []);
  const redirectUrl = get(content, 'redirectUrl', '');
  const { routeLink } = useLinkRouter();

  if (redirectUrl && redirectUrl !== '') {
    routeLink(redirectUrl);
  }

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
            <PaddedView>
              <Title contentId={content.id} isLoading={loading} />
              {callsToAction.length > 0 && (
                <ButtonContainer>
                  {callsToAction.map((n) => (
                    <StyledButton
                      key={`${n.call}:${n.action}`}
                      title={n.call}
                      pill={false}
                      url={n.action}
                    />
                  ))}
                </ButtonContainer>
              )}
              <HTMLContent contentId={content.id} />
              <Features contentId={content.id} />
            </PaddedView>
            {/* <HorizontalContentSeriesFeedConnected contentId={content.id} /> */}
          </FlexedScrollView>
        )}
      </StretchyView>
    </BackgroundView>
  );
};

InformationalContentItem.propTypes = {
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

export default withNavigation(InformationalContentItem);
