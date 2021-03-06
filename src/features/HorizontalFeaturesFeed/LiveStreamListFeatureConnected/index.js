import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { get, isEmpty, isNumber } from 'lodash';
import PropTypes from 'prop-types';
import {
  isWithinInterval,
  compareAsc,
  parseISO,
  differenceInMilliseconds,
  closestTo,
} from 'date-fns';
import { useLiveStreams } from 'hooks';

import { Animated, FlatList, View, LogBox } from 'react-native';
import {
  ConnectedImage,
  TouchableScale,
  styled,
  withTheme,
} from '@apollosproject/ui-kit';

import HorizontalFeatureFeed from 'ui/HorizontalFeatureFeed';
import GET_LIVE_STREAMS from './getLiveStreamFeature';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message

const AVATAR_MULTIPLIER = 0.8;

const LiveItemContainer = styled(({ theme, withMargin }) => ({
  flexDirection: 'column',
  justifyContent: 'center',
  alignContent: 'center',
  marginRight: theme.sizing.baseUnit * (withMargin ? 0.5 : 0),
}))(TouchableScale);

const BorderWithPulse = withTheme()(({ theme, ...props }) => {
  const themeSize = theme.sizing.avatar.medium * AVATAR_MULTIPLIER;
  const MIN = 0.3;
  const MAX = 1;
  const duration = 1000;
  const [opacity, setOpacity] = useState(new Animated.Value(MIN));
  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: MAX,
      duration,
      useNativeDriver: true,
    }).start(() => {
      fadeOut();
    });
  };
  const fadeOut = () => {
    Animated.timing(opacity, {
      toValue: MIN,
      duration,
      useNativeDriver: true,
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
        opacity,
        height: themeSize,
        width: themeSize,
        borderRadius: themeSize * 0.5,
        borderWidth: 2,
        borderColor: theme.colors.alert,
      }}
      {...props}
    />
  );
});

const CirclularImage = withTheme(({ theme }) => {
  const themeSize = theme.sizing.avatar.medium * AVATAR_MULTIPLIER - 8;
  return {
    minAspectRatio: 1,
    maxAspectRatio: 1,
    maintainAspectRatio: true,
    style: {
      height: themeSize,
      width: themeSize,
      borderRadius: themeSize * 0.5,
    },
  };
})(ConnectedImage);

const CircularImagePosition = styled(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  justifyContent: 'center',
  alignItems: 'center',
}))(View);

const LiveTouchable = ({ id, coverImage, withMargin }) => {
  const navigation = useNavigation();
  return (
    <LiveItemContainer
      withMargin={withMargin}
      onPress={() =>
        navigation.navigate('LiveStreamSingle', { liveStreamId: id })
      }
    >
      <BorderWithPulse />

      <CircularImagePosition>
        <CirclularImage source={get(coverImage, 'sources[0]')} />
      </CircularImagePosition>
    </LiveItemContainer>
  );
};

const renderItem = ({ item, index, dataLength }) => {
  const { id, relatedNode, media } = item;

  return (
    <LiveTouchable
      {...relatedNode}
      id={id}
      media={media}
      withMargin={index < dataLength - 1}
    />
  );
};

const LiveStreamsFeedFeature = ({ liveStreams }) => (
  <FlatList
    data={liveStreams}
    renderItem={(props) =>
      renderItem({ ...props, dataLength: liveStreams.length })
    }
    horizontal
  />
);

const LiveStreamsFeedFeatureConnected = ({
  featureId,
  ItemSeparatorComponent,
}) => {
  const { loading, data } = useQuery(GET_LIVE_STREAMS, {
    fetchPolicy: 'network-only',
    skip: isEmpty(featureId),
    variables: {
      featureId,
    },
  });
  const { liveStreams, title, subtitle } = get(data, 'node', {
    liveStreams: [],
    title: '',
    subtitle: null,
  });
  const { currentStreams } = useLiveStreams(data?.node?.liveStreams);

  const style = liveStreams.length === 1 ? { alignItems: 'center' } : {};

  return currentStreams.length > 0 ? (
    <View style={{ flexDirection: 'row' }}>
      <HorizontalFeatureFeed
        Component={LiveStreamsFeedFeature}
        liveStreams={currentStreams}
        title={title}
        subtitle={subtitle}
        style={style}
        isLoading={loading}
      />
      {!!ItemSeparatorComponent && <ItemSeparatorComponent />}
    </View>
  ) : null;
};

LiveStreamsFeedFeatureConnected.propTypes = {
  featureId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  ItemSeparatorComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
};

LiveStreamsFeedFeatureConnected.defaultProps = {
  isLoading: false,
  ItemSeparatorComponent: null,
};

export default LiveStreamsFeedFeatureConnected;
