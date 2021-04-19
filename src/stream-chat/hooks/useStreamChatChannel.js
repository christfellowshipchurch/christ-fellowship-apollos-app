/**
 * useStreamChatChannel.js
 *
 * Author: Caleb Panza
 * Created: Mar 30, 2021
 *
 * Hook for fetching Stream Chat information from either a Stream Chat Channel Node Id or a Related Node Id
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';

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

const useStreamChatChannel = () => {
  const [channelId, setChannelId] = useState(null);
  const [channelType, setChannelType] = useState(null);
  const [getStreamChatChannel, { data, loading }] = useLazyQuery(
    GET_STREAM_CHAT_CHANNEL
  );

  const fetchStreamChatChannel = ({ nodeId, relatedNodeId }) => {
    if (nodeId || relatedNodeId) {
      getStreamChatChannel({
        fetchPolicy: 'network-only',
        variables: {
          id: nodeId || relatedNodeId,
        },
      });
    }
  };

  useEffect(
    () => {
      if (!loading && data) {
        setChannelId(
          data?.node?.channelId || data?.node?.streamChatChannel?.channelId
        );
        setChannelType(
          data?.node?.channelType || data?.node?.streamChatChannel?.channelType
        );
      }
    },
    [data]
  );
  return [fetchStreamChatChannel, { channelId, channelType }];
};

useStreamChatChannel.propTypes = {};
useStreamChatChannel.defaultProps = {};

export default useStreamChatChannel;
