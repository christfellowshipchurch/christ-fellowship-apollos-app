import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { View } from 'react-native';
import { get } from 'lodash';

import { PLAY_VIDEO } from '@apollosproject/ui-media-player';
import { Icon, styled, Button } from '@apollosproject/ui-kit';
import { WebBrowserConsumer } from 'ChristFellowship/src/ui/WebBrowser';
import GET_CONTENT_MEDIA from './getContentMedia';

const buttonSizeDifferential = 4;

const MediaIcon = Icon; // todo: add back styles
const MediaButton = styled(({ theme }) => ({
  width: theme.sizing.baseUnit * buttonSizeDifferential,
  height: theme.sizing.baseUnit * buttonSizeDifferential,
  borderRadius: theme.sizing.baseUnit * (buttonSizeDifferential / 2),
  backgroundColor: theme.colors.secondary,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 0, // remove default button border
}))(Button);

/** MediaButtton "border styles" live in a seperate component so that Android places it's elevation
 * shadow in the right place. */
const MediaButtonBorder = styled(({ theme }) => ({
  borderRadius:
    theme.sizing.baseUnit * (buttonSizeDifferential / 2) +
    buttonSizeDifferential, // this is eqivalent to the MediaButton size above + the padding below
  padding: buttonSizeDifferential, // padding + backgroundColor = MediaButton + "borderStyles"
  backgroundColor: theme.colors.paper,
}))(View);

const Container = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop:
    -theme.sizing.baseUnit * (buttonSizeDifferential / 2) -
    buttonSizeDifferential, // MediaButton size / 2 + border
}))(View);

class MediaControls extends PureComponent {
  static propTypes = {
    contentId: PropTypes.string,
  };

  renderMedia = ({
    videoSource,
    coverImageSources,
    title,
    parentChannelName,
  }) => (
    <Mutation mutation={PLAY_VIDEO}>
      {(play) => (
        <Container>
          <MediaButtonBorder>
            <MediaButton
              type="primary"
              onPress={() =>
                play({
                  variables: {
                    mediaSource: videoSource,
                    posterSources: coverImageSources,
                    title,
                    isVideo: true,
                    artist: parentChannelName,
                  },
                })
              }
              useForeground
            >
              <MediaIcon name="play" />
            </MediaButton>
          </MediaButtonBorder>
        </Container>
      )}
    </Mutation>
  );

  renderWebView = ({ webViewUrl }) => (
    <WebBrowserConsumer>
      {(openUrl) => (
        <Container>
          <MediaButtonBorder>
            <MediaButton
              type="primary"
              onPress={() => openUrl(webViewUrl)}
              useForeground
            >
              <MediaIcon name="play" />
            </MediaButton>
          </MediaButtonBorder>
        </Container>
      )}
    </WebBrowserConsumer>
  );

  renderControls = ({
    loading,
    error,
    data: {
      node: {
        videos,
        title,
        parentChannel = {},
        coverImage = {},
        liveStream = {},
      } = {},
    } = {},
  }) => {
    if (loading || error) return null;

    const isLive = get(liveStream, 'isLive', false);
    const hasLiveStreamContent = !!(
      get(liveStream, 'webViewUrl') || get(liveStream, 'media.sources[0]')
    );

    const videoSource = get(videos, '[0].sources[0]', null);
    const shouldRender = (isLive && hasLiveStreamContent) || videoSource;

    if (!shouldRender) return null;

    const coverImageSources = (coverImage && coverImage.sources) || [];

    // Content is live, and we have a livestream media
    if (isLive && get(liveStream, 'media.sources[0].uri')) {
      return this.renderMedia({
        coverImageSources,
        videoSource: liveStream.media.sources[0],
        parentChannelName: parentChannel.name,
        title,
      });
    }

    // Content is live, and we don't have a livestream media
    // but we do have a webview url
    if (isLive && get(liveStream, 'webViewUrl')) {
      return this.renderWebView({
        webViewUrl: liveStream.webViewUrl,
      });
    }

    // Default case, normal media.
    return this.renderMedia({
      coverImageSources,
      videoSource,
      parentChannelName: parentChannel.name,
      title,
    });
  };

  render() {
    if (!this.props.contentId) return null;
    return (
      <Query
        query={GET_CONTENT_MEDIA}
        variables={{ contentId: this.props.contentId }}
      >
        {this.renderControls}
      </Query>
    );
  }
}

export default MediaControls;
