import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import LiveStreamPlayer from './LiveStreamPlayer';
import FullscreenPlayer from './FullscreenPlayer';

/*
 * From https://github.com/ApollosProject/apollos-apps/blob/master/packages/apollos-ui-media-player/src/MediaPlayer/queries.js
 */
const GET_MEDIA_PLAYER_VISIBILITY = gql`
  query mediaPlayerVisibility {
    mediaPlayer @client {
      isVisible
      currentTrack {
        mediaSource {
          uri
        }
      }
    }
  }
`;

/*
 * From https://github.com/ApollosProject/apollos-apps/blob/master/packages/apollos-ui-connected/src/live/getLiveContent.js
 */
const GET_LIVE_CONTENT = gql`
  query getLiveContent {
    liveStreams {
      isLive
      media {
        sources {
          uri
        }
      }
      contentItem {
        id
      }
    }
  }
`;

/**
 * Selectively renders FullscreenPlayer component is MediaPlayer is visible
 */
class MediaPlayer extends Component {
  shouldComponentUpdate() {
    return false; // 🚀
  }

  render() {
    return (
      <Query query={GET_MEDIA_PLAYER_VISIBILITY}>
        {({ data = {} }) => {
          if (!data.mediaPlayer || !data.mediaPlayer.isVisible) return null;
          const uri = get(data, 'mediaPlayer.currentTrack.mediaSource.uri');
          return (
            <Query query={GET_LIVE_CONTENT}>
              {({ loading, data: liveData }) => {
                if (loading) return null;

                const id = get(liveData, 'livestreams.contentItem.id');
                const liveUris = get(liveData, 'liveStreams', [])
                  .filter((s) => s.isLive)
                  .map((s) => get(s, 'media.sources[0].uri'));
                const isLive = !!liveUris.find((u) => u === uri);

                if (isLive) return <LiveStreamPlayer id={id} />;
                return <FullscreenPlayer />;
              }}
            </Query>
          );
        }}
      </Query>
    );
  }
}

export { MediaPlayer };

export default {};
