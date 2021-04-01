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
import { StreamChatClient } from '../client';
import supportedReactions from '../supportedReactions';
import { useStreamChat } from '../context';

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
  const [
    getStreamChatChannel,
    { data, loading: queryLoading, refetch, called },
  ] = useLazyQuery(GET_STREAM_CHAT_CHANNEL);

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

  return {
    id: streamChatChannelNodeId,
    channelId:
      data?.node?.channelId || data?.node?.streamChatChannel?.channelId,
    channelType:
      data?.node?.channelType || data?.node?.streamChatChannel?.channelType,
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
