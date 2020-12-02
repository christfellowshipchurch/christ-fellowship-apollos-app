import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import ScreenOrientation from 'screen-orientation';

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
        title
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
        title
        ... on EventContentItem {
          events {
            id
            start
            end
          }
        }
      }
      streamChatChannel {
        id
        channelId
        channelType
      }
    }
  }
`;

const MediaPlayer = () => {
  const { data = {} } = useQuery(GET_MEDIA_PLAYER_VISIBILITY);

  const { loading, data: liveData } = useQuery(GET_LIVE_CONTENT, {
    fetchPolicy: 'cache-and-network',
  });

  if (!data.mediaPlayer || !data.mediaPlayer.isVisible) return null;

  const uri = get(data, 'mediaPlayer.currentTrack.mediaSource.uri');
  const title = get(data, 'mediaPlayer.currentTrack.title');

  if (loading) return null;

  const liveStreams = get(liveData, 'liveStreams', []).filter((s) => s.isLive);
  const liveStream = liveStreams.find(
    (l) =>
      uri === get(l, 'media.sources[0].uri') &&
      title === get(l, 'contentItem.title')
  );
  const channelId = get(liveStream, 'streamChatChannel.channelId');
  const channelType = get(liveStream, 'streamChatChannel.channelType');

  if (channelId && liveStream) {
    const event = {
      parentId: get(liveStream, 'contentItem.id'),
      name: get(liveStream, 'contentItem.title'),
      startsAt: get(liveStream, 'contentItem.events[0].start'),
      endsAt: get(liveStream, 'contentItem.events[0].end'),
    };
    return (
      <>
        <ScreenOrientation type="media-player" />
        <LiveStreamPlayer
          channelId={channelId}
          channelType={channelType}
          event={event}
          isLoading={loading}
        />
      </>
    );
  }

  return (
    <>
      <ScreenOrientation type="media-player" />
      <FullscreenPlayer />
    </>
  );
};

const MemoizedMediaPlayer = React.memo(MediaPlayer, () => true); // never re-render

export { MemoizedMediaPlayer as MediaPlayer };

export default {};
