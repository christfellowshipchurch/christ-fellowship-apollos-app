import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';

import { useFeatureFlag } from 'hooks';
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

const MediaPlayer = () => {
  const { data } = useQuery(GET_MEDIA_PLAYER_VISIBILITY);

  const { loading, data: liveData } = useQuery(GET_LIVE_CONTENT);

  const { enabled } = useFeatureFlag({ key: 'LIVE_STREAM_CHAT' });

  if (!data.mediaPlayer || !data.mediaPlayer.isVisible) return null;

  const uri = get(data, 'mediaPlayer.currentTrack.mediaSource.uri');

  if (loading) return null;

  const livestreams = get(liveData, 'liveStreams', []).filter((s) => s.isLive);
  const livestream = livestreams.find(
    (l) => uri === get(l, 'media.sources[0].uri')
  );
  const contentId = get(livestream, 'contentItem.id', '').split(':')[1];

  if (enabled && livestream) {
    return <LiveStreamPlayer contentId={contentId} />;
  }

  return <FullscreenPlayer />;
};

const MemoizedMediaPlayer = React.memo(MediaPlayer, () => true); // never re-render

export { MemoizedMediaPlayer as MediaPlayer };

export default {};
