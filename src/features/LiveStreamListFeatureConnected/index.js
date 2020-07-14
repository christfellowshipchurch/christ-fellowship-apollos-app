import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Animated, FlatList, View } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import {
    ConnectedImage,
    TouchableScale,
    styled,
    withTheme,
} from '@apollosproject/ui-kit';

import { PLAY_VIDEO } from '@apollosproject/ui-media-player';
import HorizontalFeatureFeed from 'ui/HorizontalFeatureFeed';
import GET_LIVE_STREAMS from './getLiveStreamFeature';

const AVATAR_MULTIPLIER = 0.8;

const LiveItemContainer = styled(({ theme, withMargin }) => ({
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    marginRight: theme.sizing.baseUnit * (withMargin ? 0.5 : 0),
}))(TouchableScale);

const BorderWithPulse = withTheme()(({ theme, ...props }) => {
    const themeSize = theme.sizing.avatar.medium * AVATAR_MULTIPLIER;
    const MIN = 0.4;
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
        overlayColor: theme.colors.darkPrimary,
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

const LiveTouchable = ({ title, coverImage, media, withMargin }) => {
    const [playVideo] = useMutation(PLAY_VIDEO);

    return (
        <LiveItemContainer
            withMargin={withMargin}
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
            <BorderWithPulse />

            <CircularImagePosition>
                <CirclularImage source={get(coverImage, 'sources[0]')} />
            </CircularImagePosition>
        </LiveItemContainer>
    );
};

const renderItem = ({ item, index, dataLength }) => {
    const { contentItem, media } = item;

    return (
        <LiveTouchable
            {...contentItem}
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

const LiveStreamsFeedFeatureConnected = ({ featureId, isLoading }) => {
    // Since we are refetching on a 30 second interval, we don't care
    // about the refetchRef from the parents and don't need to worry
    // about refetching on pull-down
    const { loading, data } = useQuery(GET_LIVE_STREAMS, {
        pollInterval: 30000,
        fetchPolicy: 'network-only',
        skip: isLoading,
        variables: {
            featureId,
        },
    });

    const { liveStreams, title, subtitle } = get(data, 'node', {
        liveStreams: [],
        title: '',
        subtitle: null,
    });

    const style = liveStreams.length === 1 ? { alignItems: 'center' } : {};

    return liveStreams.length > 0 ? (
        <HorizontalFeatureFeed
            Component={LiveStreamsFeedFeature}
            liveStreams={liveStreams}
            title={title}
            subtitle={subtitle}
            style={style}
            isLoading={loading}
        />
    ) : null;
};

LiveStreamsFeedFeatureConnected.propTypes = {
    featureId: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
};

LiveStreamsFeedFeatureConnected.propTypes = {
    isLoading: false,
};

export default LiveStreamsFeedFeatureConnected;
