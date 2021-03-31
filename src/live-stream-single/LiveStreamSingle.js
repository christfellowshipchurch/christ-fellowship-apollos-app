import React, { useContext } from 'react';
import { useLiveStream } from 'hooks';

import { ApollosPlayerContainer } from '@apollosproject/ui-media-player';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ErrorCard,
  ActivityIndicator,
  BackgroundView,
} from '@apollosproject/ui-kit';
import { TrackEventWhenLoaded } from '@apollosproject/ui-analytics';
import { InteractWhenLoadedConnected } from '@apollosproject/ui-connected';
import StatusBar from 'ui/StatusBar';
import ThemeMixin from '../ui/DynamicThemeMixin';
import { ChatChannel } from '../stream-chat';
import LiveStreamPlayer from './LiveStreamPlayer';
import PreLiveStream from './PreLiveStream';
import PostLiveStream from './PostLiveStream';
import CloseButton from './CloseButton';

export const StreamChatChannelContext = React.createContext(null);
export const useStreamChatChannel = () => useContext(StreamChatChannelContext);

const LiveStreamSingle = (props) => {
  const liveStreamId = props.route?.params?.liveStreamId;
  const { bottom } = useSafeAreaInsets();
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
    <StreamChatChannelContext.Provider value={streamChatChannel?.id}>
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
    </StreamChatChannelContext.Provider>
  );
};

export default LiveStreamSingle;
