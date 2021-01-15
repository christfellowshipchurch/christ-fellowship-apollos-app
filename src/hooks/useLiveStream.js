import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { get, isEmpty } from 'lodash';
import {
  isValid,
  isAfter,
  isBefore,
  parseISO,
  differenceInMilliseconds,
} from 'date-fns';
import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

const GET_LIVE_STREAM = gql`
  query getLiveStream($id: ID!) {
    node(id: $id) {
      __typename
      id
      ...LiveStreamFragment
      ...StreamChatChannelNodeFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.LIVE_STREAM_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.STREAM_CHAT_FRAGMENT}
`;

const useLiveStream = ({ liveStreamId }) => {
  const { data, loading, error } = useQuery(GET_LIVE_STREAM, {
    variables: { id: liveStreamId },
    skip: !liveStreamId || isEmpty(liveStreamId),
    fetchPolicy: 'network-only',
  });
  const [nowIsBefore, setNowIsBefore] = useState(false);
  const [nowIsAfter, setNowIsAfter] = useState(false);

  const startDate = data?.node?.eventStartTime
    ? parseISO(data?.node?.eventStartTime)
    : null;
  const endDate = data?.node?.eventEndTime
    ? parseISO(data?.node?.eventEndTime)
    : null;

  //   Effects
  useEffect(
    () => {
      if (startDate) setNowIsBefore(isBefore(new Date(), startDate));
      if (endDate) setNowIsAfter(isAfter(new Date(), endDate));
    },
    [data]
  );

  useEffect(
    () => {
      // Set a timer if the current time is before the start of the event
      const startTimerId = nowIsBefore
        ? setTimeout(() => {
            setNowIsBefore(false);
          }, differenceInMilliseconds(startDate, new Date()))
        : null;
      const endTimerId = !nowIsAfter
        ? setTimeout(() => {
            setNowIsAfter(isAfter(new Date(), endDate));
          }, differenceInMilliseconds(endDate, new Date()))
        : null;

      // Clean up out timers if a user exits before the timer goes off
      return function cleanup() {
        if (startTimerId) clearTimeout(startTimerId);
        if (endTimerId) clearTimeout(endTimerId);
      };
    },
    [nowIsBefore]
  );

  return {
    id: data?.node?.id,
    loadingWithData: loading && !data?.node?.id,
    loading,
    error,
    isLive: data?.node?.isLive,
    isBefore: nowIsBefore,
    isAfter: data?.node?.eventEndTime
      ? isAfter(new Date(), parseISO(data?.node?.eventEndTime))
      : false,
    startTime: data?.node?.eventStartTime,
    endTime: data?.node?.eventEndTime,
    startDate,
    endDate: data?.node?.eventEndTime
      ? parseISO(data?.node?.eventEndTime)
      : null,
    coverImage: data?.node?.relatedNode?.coverImage?.sources[0],
    uri: data?.node?.media?.sources[0],
    title: data?.node?.relatedNode?.title,
    theme: data?.node?.theme,
    streamChatChannel: data?.node?.streamChatChannel,
  };
};

useLiveStream.propTypes = {
  liveStreamId: PropTypes.string,
};

export default useLiveStream;
