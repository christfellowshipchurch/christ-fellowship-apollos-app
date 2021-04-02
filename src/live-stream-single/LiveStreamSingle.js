import React, { useEffect } from 'react';
import { useLiveStream } from 'hooks';

import { ApollosPlayerContainer } from '@apollosproject/ui-media-player';

import {
  ErrorCard,
  ActivityIndicator,
  BackgroundView,
} from '@apollosproject/ui-kit';
import { TrackEventWhenLoaded } from '@apollosproject/ui-analytics';
import { InteractWhenLoadedConnected } from '@apollosproject/ui-connected';
import ThemeMixin from '../ui/DynamicThemeMixin';
import { useStreamChat } from '../stream-chat/context';
import { LiveStreamContextProvider } from './context';
import LiveStreamPlayer from './LiveStreamPlayer';
import PreLiveStream from './PreLiveStream';
import PostLiveStream from './PostLiveStream';
import CloseButton from './CloseButton';

const LiveStreamSingle = (props) => {
  const liveStreamId = props.route?.params?.liveStreamId;
  const { setChannel } = useStreamChat();
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
  } = useLiveStream({
    liveStreamId,
  });

  useEffect(
    () => {
      if (liveStreamId && setChannel) {
        setChannel({ relatedNodeId: liveStreamId });
      }
    },
    [liveStreamId]
  );

  // Loading and Error State
  if (loadingWithData)
    return (
      <BackgroundView>
        <ActivityIndicator />
      </BackgroundView>
    );
  if (error && !id)
    return (
      <BackgroundView>
        <ErrorCard error={error} />
      </BackgroundView>
    );

  /**
   * If the current time is _before_ the start date, show the Pre Live component
   */
  if (isBefore)
    return (
      <>
        <CloseButton />
        <PreLiveStream
          startDate={startDate}
          coverImage={coverImage}
          title={title}
          isLoading={loadingWithData}
        />
      </>
    );

  /**
   * If the current time is _after_ the end date, show the Post Live component
   */
  if (isAfter)
    return (
      <>
        <CloseButton />
        <PostLiveStream coverImage={coverImage} />
      </>
    );

  return (
    <ThemeMixin theme={theme}>
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
      <ApollosPlayerContainer
        PlayerComponent={LiveStreamPlayer}
        source={uri}
        coverImage={coverImage}
        presentationProps={{
          title,
        }}
        isLive
        autoplay
      />
      {/* <ApollosPlayerContainer
        PlayerComponent={PlayerComponent}
        source={uri}
        coverImage={coverImage}
        presentationProps={{
          title,
        }}
        isLive
        autoplay
        randomProp
      >
        <StatusBar />

        <CloseButton />
      </ApollosPlayerContainer> */}
    </ThemeMixin>
  );
};

export default LiveStreamSingle;
