import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import {
  TouchableScale,
  styled,
  H4,
  FlexedView,
  withTheme,
} from '@apollosproject/ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { PLAY_VIDEO } from '@apollosproject/ui-media-player';

import GET_LIVE_STREAM from './getLiveStream';

const Banner = styled(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  paddingVertical: theme.sizing.baseUnit * 0.7,
  paddingHorizontal: theme.sizing.baseUnit,
  width: '100%',
  marginVertical: 0,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}))(FlexedView);

const Title = styled(() => ({
  color: 'white',
  fontWeight: 'bold',
  alignSelf: 'flex-start',
}))(H4);

const CloseButton = withTheme(() => ({
  color: 'white',
  icon: ['fal', 'times'],
  size: 24,
}))(FontAwesomeIcon);

const liveStreamUrl =
  'http://link.theplatform.com/s/IfSiAC/bD1fN9vCet4B?mbr=true@144364/master.m3u8';

const testUrl =
  'http://christfellow2p-a.akamaihd.net/CHRISTFELLOW/291/191/Movement_Message_1708632131571_mp4_video_1280x720_2534000_primary_audio_eng_6.mp4';
const testPoster =
  'https://cloudfront.christfellowship.church/GetImage.ashx?guid=636e3151-9d74-455f-aa33-e37403fce4f6';

const LiveNowButton = () => {
  const { loading, error, data } = useQuery(GET_LIVE_STREAM, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
  });

  const [isLive, setIsLive] = useState(get(data, 'liveStream.isLive', false));

  if ((!data && loading) || error) return null;

  return isLive || true ? (
    <Mutation mutation={PLAY_VIDEO}>
      {(playVideo) => (
        <Banner>
          <TouchableScale
            onPress={() =>
              playVideo({
                variables: {
                  mediaSource: {
                    __typename: 'VideoMediaSource',
                    uri: liveStreamUrl,
                  },
                  posterSources: [
                    {
                      __typename: 'ImageMediaSource',
                      uri: testPoster,
                    },
                  ],
                  title: 'Christ Fellowship Live',
                  isVideo: true,
                  artist: 'Christ Fellowship',
                },
              })
            }
          >
            <Title>Join us for Church Online</Title>
          </TouchableScale>
          <TouchableScale onPress={() => setIsLive(false)}>
            <CloseButton />
          </TouchableScale>
        </Banner>
      )}
    </Mutation>
  ) : null;
};

export default LiveNowButton;
