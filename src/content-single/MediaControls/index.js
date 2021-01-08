import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from '@apollo/client/react/components';
import { View } from 'react-native';
import { get } from 'lodash';

import { PLAY_VIDEO } from '@apollosproject/ui-media-player';
import {
  styled,
  TouchableScale,
  MediaThumbnail,
  MediaThumbnailIcon,
  MediaThumbnailItem,
  H6,
} from '@apollosproject/ui-kit';
import { LiveConsumer } from '@apollosproject/ui-connected';
import RockAuthedWebBrowser from '../../web-browser';

import GET_CONTENT_MEDIA from './getContentMedia';

const Container = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  marginTop: -(theme.sizing.baseUnit * 2.5),
}))(View);

const StyledMediaThumbnail = styled({ marginVertical: 0 })(MediaThumbnail);

class MediaControls extends PureComponent {
  static propTypes = {
    contentId: PropTypes.string,
  };

  renderPlayButton = ({ action, coverImageSources }) => (
    <Container>
      <TouchableScale onPress={action}>
        <StyledMediaThumbnail image={coverImageSources}>
          <MediaThumbnailItem centered>
            <MediaThumbnailIcon name="play" />
          </MediaThumbnailItem>
          <MediaThumbnailItem centered bottom>
            <H6 padded>Play</H6>
          </MediaThumbnailItem>
        </StyledMediaThumbnail>
      </TouchableScale>
    </Container>
  );

  // renderMedia = ({
  //   videoSource,
  //   coverImageSources,
  //   title,
  //   parentChannelName,
  // }) => (
  //   <Mutation mutation={PLAY_VIDEO}>
  //     {(play) =>
  //       this.renderPlayButton({
  //         action: () =>
  //           play({
  //             variables: {
  //               mediaSource: videoSource,
  //               posterSources: coverImageSources,
  //               title,
  //               isVideo: true,
  //               artist: parentChannelName,
  //             },
  //           }),
  //         coverImageSources,
  //       })
  //     }
  //   </Mutation>
  // );

  renderMedia = ({
    videoSource,
    coverImageSources,
    title,
    parentChannelName,
  }) => null;

  renderWebView = ({ webViewUrl, coverImageSources }) => (
    <RockAuthedWebBrowser>
      {(openUrl) =>
        this.renderPlayButton({
          action: () => openUrl(webViewUrl),
          coverImageSources,
        })
      }
    </RockAuthedWebBrowser>
  );

  renderControls = ({
    liveStream,
    loading,
    error,
    data: {
      node: { videos, title, parentChannel = {}, coverImage = {} } = {},
    } = {},
  }) => {
    if (loading || error) return null;
    const isLive = !!liveStream;
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
        coverImageSources,
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
      <LiveConsumer contentId={this.props.contentId}>
        {(liveStream) => (
          <Query
            query={GET_CONTENT_MEDIA}
            fetchPolicy="cache-and-network"
            variables={{ contentId: this.props.contentId }}
          >
            {({ data, loading, error }) =>
              this.renderControls({ data, loading, error, liveStream })
            }
          </Query>
        )}
      </LiveConsumer>
    );
  }
}

export default MediaControls;
