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

import { AppState } from 'react-native';
import { isOwnUser } from 'stream-chat';
import { useStreamChatClient, useStreamChatChannel } from '../hooks';

const StreamChatClientContextContext = React.createContext({});

// Context Hook
export const useStreamChat = () => {
  const {
    chatClient,
    connectionStatus,
    disconnectUser,
    connectUser,
    channel,
    getStreamChatChannel,
    setChannel,
  } = useContext(StreamChatClientContextContext);

  return {
    chatClient,
    connectionStatus,
    disconnectUser,
    connectUser,
    channel,
    getStreamChatChannel,
    setChannel,
  };
};

// Provider
export const StreamChatClientContextProvider = ({ children }) => {
  const {
    chatClient,
    connectionStatus,
    disconnectUser,
    connectUser,
  } = useStreamChatClient();
  const [
    getStreamChatChannel,
    { channelId: fetchedChannelId, channelType: fetchedChannelType },
  ] = useStreamChatChannel();

  const [channel, setChannel] = useState(null);
  const [channelId, setChannelId] = useState(null);
  const [channelType, setChannelType] = useState(null);

  const cleanChannel = () => {
    setChannelId(null);
    setChannelType(null);
  };

  /**
   * fetchOrSetChannel
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
      setChannelId(specifiedChannelId);
      setChannelType(specifiedChannelType);
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
        connectionStatus,
        disconnectUser,
        connectUser,
        channel,
        getStreamChatChannel,
        setChannel: fetchOrSetChannel,
      }}
    >
      {children}
    </StreamChatClientContextContext.Provider>
  );
};

StreamChatClientContextProvider.propTypes = {
  children: PropTypes.node,
};
