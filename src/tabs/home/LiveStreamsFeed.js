import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { FlatList, View, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { get, flatten } from 'lodash';
import PropTypes from 'prop-types';

import {
  ConnectedImage,
  GradientOverlayImage,
  UIText,
  TouchableScale,
  styled,
  withTheme,
} from '@apollosproject/ui-kit';
import { PLAY_VIDEO } from '@apollosproject/ui-media-player';

import Wordmark from '../../ui/Wordmark';

const GET_LIVE_STREAMS = gql`
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
        coverImage {
          sources {
            uri
          }
        }
      }
    }
  }
`;

const FlatListContainer = styled(({ theme }) => ({
  flex: 1,
  paddingHorizontal: theme.sizing.baseUnit,
}))(View);

const LiveItemContainer = styled(({ theme }) => ({
  flexDirection: 'column',
  justifyContent: 'center',
  alignContent: 'center',
  height: 42,
  width: 42,
}))(TouchableScale);

const CirclularImage = withTheme(({ theme }) => ({
  minAspectRatio: 1,
  maxAspectRatio: 1,
  maintainAspectRatio: true,
  overlayColor: theme.colors.darkPrimary,
  style: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.alert,
  },
}))(ConnectedImage);

const LivePosition = styled(({ theme }) => ({
  marginTop: -10,
  alignContent: 'center',
}))(View);

const LiveText = styled(({ theme }) => ({
  color: theme.colors.white,
  fontWeight: 'bold',
  fontSize: 8,
  borderRadius: 3,
  paddingVertical: 1,
  backgroundColor: theme.colors.alert,
  textAlign: 'center',
}))(Text);

const LiveTouchable = ({ title, coverImage, media }) => {
  const [playVideo] = useMutation(PLAY_VIDEO);

  return (
    <LiveItemContainer
      onPress={() =>
        playVideo({
          variables: {
            mediaSource: get(media, 'sources[0]'),
            posterSources: get(coverImage, 'sources[0]'),
            title,
            isVideo: true,
            artist: 'Live',
          },
        })
      }
    >
      <CirclularImage source={get(coverImage, 'sources[0]')} />
      <LivePosition>
        <LiveText>LIVE</LiveText>
      </LivePosition>
    </LiveItemContainer>
  );
};

const renderItem = ({ item }) => {
  const { contentItem, media } = item;

  return <LiveTouchable {...contentItem} media={media} />;
};

const LiveStreamsFeed = ({ navigation }) => {
  const { loading, error, data } = useQuery(GET_LIVE_STREAMS, {
    pollInterval: 30000,
  });
  const liveStreams = get(data, 'liveStreams', []);

  console.log({ liveStreams });

  return liveStreams.length > 0 ? (
    <FlatListContainer>
      <FlatList data={liveStreams} renderItem={renderItem} horizontal />
    </FlatListContainer>
  ) : (
      <Wordmark />
    );
};

LiveStreamsFeed.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default LiveStreamsFeed;
