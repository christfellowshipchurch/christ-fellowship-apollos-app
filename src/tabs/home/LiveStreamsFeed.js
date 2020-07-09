import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Animated, FlatList, View, Text, ScrollView } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import {
  ConnectedImage,
  TouchableScale,
  styled,
  withTheme,
  Icon,
} from '@apollosproject/ui-kit';

import { PLAY_VIDEO } from '@apollosproject/ui-media-player';
import PrayerListFeatureConnected from '@apollosproject/ui-connected/src/PrayerListFeatureConnected';

const GET_LIVE_STREAMS = gql`
  query getTopFeatures($key: String!) {
    flagStatus(key: $key)

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

    dailyPrayers {
      id
      title
      subtitle
      isCard
      prayers {
        id
        isPrayed
        text
      }
    }
  }
`;

const FlatListContainer = styled(({ theme }) => ({
  flex: 1,
}))(View);

const LiveItemContainer = styled(({ theme }) => ({
  flexDirection: 'column',
  justifyContent: 'center',
  alignContent: 'center',
  paddingHorizontal: theme.sizing.baseUnit * 0.5,
}))(TouchableScale);

const circleSize = 64

const CirclularImage = withTheme(({ theme }) => ({
  minAspectRatio: 1,
  maxAspectRatio: 1,
  maintainAspectRatio: true,
  overlayColor: theme.colors.darkPrimary,
  style: {
    height: circleSize,
    width: circleSize,
    borderRadius: circleSize * 0.5,
    borderWidth: 4,
    borderColor: theme.colors.alert,
    backgroundColor: theme.colors.transparent,
  },
}))(ConnectedImage);

const EndCapSpacer = styled(({ theme }) => ({
  width: theme.sizing.baseUnit * 0.1,
}))(View);

const LiveText = styled(({ theme }) => ({
  color: theme.colors.alert,
  fontWeight: 'bold',
  fontSize: 10,
  textAlign: 'center',
}))(Text);

const LiveDot = withTheme(({ theme }) => ({
  name: 'live-dot',
  fill: theme.colors.alert,
  size: 3,
  style: {
    marginRight: 3,
  },
}))(Icon);

const LivePosition = (props) => {
  const MIN = 0.3;
  const MAX = 1;
  const duration = 1000;
  const [opacity, setOpacity] = useState(new Animated.Value(MIN));
  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: MAX,
      duration,
    }).start(() => {
      fadeOut();
    });
  };
  const fadeOut = () => {
    Animated.timing(opacity, {
      toValue: MIN,
      duration,
    }).start(() => {
      fadeIn();
    });
  };

  useEffect(() => {
    fadeIn();
  }, []);

  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 3,
        marginLeft: -4,
        opacity,
      }}
      {...props}
    />
  );
};

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
        <LiveDot />
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
    fetchPolicy: 'cache-and-network',
    variables: {
      key: 'LIVE_STREAM_UI',
    },
  });
  const liveStreams = get(data, 'liveStreams', []);
  const flagStatus = get(data, 'flagStatus');
  const dailyPrayers = get(data, 'dailyPrayers', {});

  return liveStreams.length > 0 && flagStatus === 'LIVE' ? (
    <FlatListContainer>
      <ScrollView horizontal>
        <View>
          <FlatList
            data={liveStreams}
            renderItem={renderItem}
            horizontal
            ListHeaderComponent={<EndCapSpacer />}
            ListFooterComponent={<EndCapSpacer />}
          />
        </View>

        <View>
          <PrayerListFeatureConnected 
            featureId={get(dailyPrayers, 'id')} 
          />
        </View>
      </ScrollView>
    </FlatListContainer>
  ) : null;
};

LiveStreamsFeed.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default LiveStreamsFeed;
