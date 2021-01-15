import React, { useEffect, useState } from 'react';
import { differenceInMilliseconds } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { View } from 'react-native';
import { ApollosPlayerContainer } from '@apollosproject/ui-media-player';
import { ErrorCard, styled, ActivityIndicator } from '@apollosproject/ui-kit';
import { TrackEventWhenLoaded } from '@apollosproject/ui-analytics';
import { InteractWhenLoadedConnected } from '@apollosproject/ui-connected';
import StatusBar from 'ui/StatusBar';
import { useLiveStream } from 'hooks';
import ThemeMixin from '../ui/DynamicThemeMixin';

import LiveStreamPlayer from './LiveStreamPlayer';
import LiveStreamChat from './LiveStreamChat';
import PreLiveStream from './PreLiveStream';
import PostLiveStream from './PostLiveStream';

const BottomInset = styled(({ theme, inset }) => ({
  backgroundColor: theme.colors.background.paper,
  paddingBottom: inset - theme.sizing.baseUnit,
  flex: 1,
}))(View);

const LiveStreamSingle = (props) => {
  const liveStreamId = props.route?.params?.liveStreamId;
  // State
  const {
    id,
    isBefore,
    isAfter,
    loading,
    loadingWithData,
    error,
    startDate,
    uri,
    coverImage,
    title,
    theme,
    streamChatChannel,
  } = useLiveStream({
    liveStreamId,
  });
  const insets = useSafeAreaInsets();

  // Loading and Error State
  if (loadingWithData) return <ActivityIndicator />;
  if (error && !id) return <ErrorCard error={error} />;

  /**
   * If the current time is _before_ the start date, show the Pre Live component
   */
  if (isBefore)
    return (
      <PreLiveStream
        startDate={startDate}
        coverImage={coverImage}
        title={title}
        isLoading={loadingWithData}
      />
    );

  /**
   * If the current time is _after_ the end date, show the Post Live component
   */
  if (isAfter) return <PostLiveStream coverImage={coverImage} />;

  return (
    <ApollosPlayerContainer
      PlayerComponent={LiveStreamPlayer}
      source={uri}
      coverImage={coverImage}
      presentationProps={{
        title,
      }}
      isLive
      autoplay
    >
      <ThemeMixin theme={theme}>
        <StatusBar />
        <InteractWhenLoadedConnected
          isLoading={loading}
          nodeId={liveStreamId}
          action={'COMPLETE'}
        />
        <TrackEventWhenLoaded
          loaded={!!(!loading && title)}
          eventName={'View Live Stream'}
          properties={{
            title,
            liveStreamId,
          }}
        />
        <BottomInset inset={insets.bottom}>
          <LiveStreamChat channelId={streamChatChannel?.channelId} />
        </BottomInset>
      </ThemeMixin>
    </ApollosPlayerContainer>
  );
};

export default LiveStreamSingle;
