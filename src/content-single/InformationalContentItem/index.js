import React from 'react';
import { View, Animated, Linking } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import ApollosConfig from '@apollosproject/config';
import {
  styled,
  GradientOverlayImage,
  BackgroundView,
  PaddedView,
  H3,
  BodyText,
  Button,
  // StretchyView,
} from '@apollosproject/ui-kit';
import {
  ContentHTMLViewConnected,
  HorizontalContentSeriesFeedConnected,
  MediaControlsConnected,
  RockAuthedWebBrowser,
} from '@apollosproject/ui-connected';
import Features from '../Features';

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

const StyledMediaControlsConnected = styled(({ theme }) => ({
  marginTop: -(theme.sizing.baseUnit * 2.5),
}))(MediaControlsConnected);

const StyledButton = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 0.5,
}))(Button);

const ButtonContainer = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 0.5,
}))(View);

// TODO : temp fix until Core resolves the bug where images would disappear when pulling down
const StretchyView = ({ children, ...props }) =>
  children({ Stretchy: View, ...props });

const InformationalContentItem = ({ content, loading, navigation }) => {
  const coverImageSources = get(content, 'coverImage.sources', []);
  const callsToAction = get(content, 'callsToAction', []);
  const redirectUrl = get(content, 'redirectUrl', '');

  if (redirectUrl && redirectUrl !== '') {
    let url = redirectUrl;

    if (!url.startsWith('http')) {
      url = `${ApollosConfig.APP_CONTENT_URL}${
        url.startsWith('/') ? '' : '/'
        }${redirectUrl}`;
    }

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log(`Don't know how to open URI: ${url}`);
      }
    });

    navigation.goBack(null);
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
              <H3 isLoading={!content.title && loading}>{content.title}</H3>
              <BodyText isLoading={!content.summary && loading}>
                {content.summary}
              </BodyText>

              {callsToAction.length > 0 && (
                <RockAuthedWebBrowser>
                  {(openUrl) => (
                    <ButtonContainer>
                      {callsToAction.map((n) => (
                        <StyledButton
                          key={`${n.call}:${n.action}`}
                          isLoading={loading}
                          title={n.call}
                          pill={false}
                          onPress={() => {
                            openUrl(n.action);
                          }}
                        />
                      ))}
                    </ButtonContainer>
                  )}
                </RockAuthedWebBrowser>
              )}

              <ContentHTMLViewConnected contentId={content.id} />
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
