/**
 * StreamChatClientContext.js
 *
 * Author: Caleb Panza
 * Created: Apr 01, 2021
 *
 * Provides a global context for the connection between user and Stream.IO
 *
 */

import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppState } from 'react-native';
import { OverlayProvider } from 'stream-chat-react-native';
import { isOwnUser } from 'stream-chat';
import { useStreamChatClient, useStreamChatChannel } from '../hooks';

const StreamChatClientContextContext = React.createContext([]);

// Context Hook
export const useStreamChat = () => {
  const {
    chatClient,
    isConnecting,
    channel,
    getStreamChatChannel,
    setChannel,
    setInsets,
    userId,
  } = useContext(StreamChatClientContextContext);
  const [unreadCount, setUnreadCount] = useState(0);

  const _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      const user = chatClient?.user;
      const count = isOwnUser(user) ? user.total_unread_count : 0;
      setUnreadCount(count);
    }
  };

  useEffect(
    () => {
      const user = chatClient?.user;
      const count = isOwnUser(user) ? user.total_unread_count : 0;
      setUnreadCount(count);
      const listener = chatClient?.on((e) => {
        if (Number.isInteger(e?.total_unread_count)) {
          setUnreadCount(e.total_unread_count);
        }
      });

      return () => {
        if (listener) {
          listener.unsubscribe();
        }
      };
    },
    [chatClient]
  );

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  return {
    chatClient,
    isConnecting,
    channel,
    getStreamChatChannel,
    setChannel,
    setInsets,
    userId,
    unreadCount,
  };
};

// Provider
export const StreamChatClientContextProvider = ({ children }) => {
  const [
    getStreamChatChannel,
    { channelId: fetchedChannelId, channelType: fetchedChannelType },
  ] = useStreamChatChannel();
  const { chatClient, isConnecting, userId } = useStreamChatClient();

  const [channel, setChannel] = useState(null);
  const [channelId, setChannelId] = useState(null);
  const [channelType, setChannelType] = useState(null);

  const [insets, setInsets] = useState({});

  const safeAreaInsets = useSafeAreaInsets();

  const cleanChannel = () => {
    setChannelId(null);
    setChannelType(null);
  };

  /**
   * This function serves to best help us set the Channel according to one of 3 possible contexts:
   * 1. We know the exact Stream Channel
   * 2. We have the channelId and channelType, but need to set the Stream Channel
   * 3. We have the Stream Chat Channel Node Id from the server and need to channel data
   * 4. We have a Related Node Id and need to fetch the Stream Chat Channel info to set the channel data
   *
   * note : order of operations is simplest to most complex
   */
  const fetchOrSetChannel = ({
    channel: specifiedChannel,
    nodeId,
    relatedNodeId,
    channelId: specifiedChannelId,
    channelType: specifiedChannelType,
  }) => {
    if (specifiedChannel) {
      cleanChannel();
      setChannel(specifiedChannel);
    } else if (specifiedChannelId && specifiedChannelType) {
      setChannelId(fetchedChannelId);
      setChannelType(fetchedChannelType);
    } else if (nodeId || relatedNodeId) {
      getStreamChatChannel({ nodeId, relatedNodeId });
    }
  };

  /**
   * Listen for a change in state of the channelId.
   */
  useEffect(
    () => {
      const initChannel = async () => {
        if (!chatClient || !channelId || !channelType) return;

        const newChannel = chatClient?.channel(channelType, channelId);

        if (!newChannel?.initialized) {
          await newChannel?.watch();
        }

        setChannel(newChannel);
      };

      initChannel();
    },
    [channelId, channelType]
  );

  useEffect(
    () => {
      setChannelId(fetchedChannelId);
      setChannelType(fetchedChannelType);
    },
    [fetchedChannelId, fetchedChannelType]
  );

  return (
    <StreamChatClientContextContext.Provider
      value={{
        chatClient,
        isConnecting,
        channel,
        getStreamChatChannel,
        setChannel: fetchOrSetChannel,
        setInsets,
        userId,
      }}
    >
      <OverlayProvider
        bottomInset={safeAreaInsets.bottom}
        topInset={safeAreaInsets.top}
      >
        {children}
      </OverlayProvider>
    </StreamChatClientContextContext.Provider>
  );
};

StreamChatClientContextProvider.propTypes = {
  children: PropTypes.node,
};
