/**
 * useStreamChatChannel.js
 *
 * Author: Caleb Panza
 * Created: Mar 30, 2021
 *
 * Hook for fetching Stream Chat information and establishing a connection to a Chat Channel for an authenticated user.
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useCurrentUser } from 'hooks';
import { StreamChatClient } from './client';
import supportedReactions from './supportedReactions';

const GET_STREAM_CHAT_CHANNEL = gql`
  query getStreamChatChannel($id: ID!) {
    node(id: $id) {
      id
      ... on StreamChatChannel {
        channelId
        channelType
      }

      ... on StreamChatChannelNode {
        streamChatChannel {
          id
          channelId
          channelType
        }
      }
    }
  }
`;

const useStreamChatChannel = ({ id: streamChatChannelNodeId, relatedNode }) => {
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [
    getStreamChatChannel,
    { data, loading: queryLoading, refetch, called },
  ] = useLazyQuery(GET_STREAM_CHAT_CHANNEL);
  const {
    id: userId,
    firstName,
    lastName,
    photo,
    streamChatToken,
  } = useCurrentUser();
  const connect = async () => {
    const channelId =
      data?.node?.channelId || data?.node?.streamChatChannel?.channelId;
    const channelType =
      data?.node?.channelType || data?.node?.streamChatChannel?.channelType;
    const chatUser = {
      id: userId.split(':')[1],
      name: `${firstName} ${lastName}`,
      image: photo?.uri,
    };
    await StreamChatClient.connectUser(chatUser, streamChatToken);
    setChannel(
      StreamChatClient.channel(channelType, channelId, {
        name: relatedNode?.title || 'Chat',
        relatedNodeId: relatedNode?.id,
      })
    );
  };

  // note : lazy query in order to manually handle skipping the query
  useEffect(
    () => {
      const nodeId = streamChatChannelNodeId || relatedNode?.id;
      const shouldQuery = !called && !queryLoading && !data;
      if (shouldQuery && nodeId) {
        getStreamChatChannel({
          variables: {
            id: nodeId,
          },
        });
      }
    },
    [streamChatChannelNodeId, relatedNode]
  );

  // note : if we have all necessary data points, connect to Stream Chat Channel
  useEffect(
    () => {
      const channelId =
        data?.node?.channelId || data?.node?.streamChatChannel?.channelId;
      const hasAllDataPoints = userId && channelId && streamChatToken;
      if (hasAllDataPoints) {
        connect();
      }
    },
    [userId, data, streamChatToken]
  );

  // note : if our Channel is set up and valid, set loading state to false
  useEffect(
    () => {
      if (channel) setLoading(false);
    },
    [channel]
  );

  return {
    id: streamChatChannelNodeId,
    channelId: data?.node?.channelId,
    channelType: data?.node?.channelType,
    channel,
    userToken: streamChatToken,
    refetch,
    channelProps: {
      supportedReactions,
    },
  };
};

useStreamChatChannel.propTypes = {
  id: PropTypes.string,
  relatedNode: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }),
};
useStreamChatChannel.defaultProps = {};

export default useStreamChatChannel;
