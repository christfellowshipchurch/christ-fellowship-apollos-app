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
import { PLAY_VIDEO } from '@apollosproject/ui-media-player';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import GET_LIVE_STREAM from './getLiveStream';

const poster = require('../ui/AuthBackground/auth_background.jpg');

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

// TODO : please follow this PR for instructions on how to patch the WHITE SCREEN OF DEATH
//        https://github.com/ApollosProject/apollos-apps/pull/1387

const LiveNowButton = () => {
  const { loading, error, data } = useQuery(GET_LIVE_STREAM, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
  });

  const [isLive, setIsLive] = useState(get(data, 'liveStream.isLive', false));
  const liveStreamUrl = get(data, 'liveStream.media.sources[0].uri', null);

  if ((!data && loading) || error || !liveStreamUrl || liveStreamUrl === '')
    return null;

  return isLive ? (
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
                  posterSources: [],
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
