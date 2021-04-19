import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import {
  differenceInSeconds,
  isAfter,
  isBefore,
  parseISO,
  differenceInMilliseconds,
  subSeconds,
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

/**
 * useLiveStream
 * Hook to handle the status and refetching of a single live stream node
 * @param {number} args.liveStreamId | Live Stream Id
 */
const useLiveStream = ({ liveStreamId }) => {
  /**
   * note : there was an issue where even when `skip` was passed a truthy value, it still wasn't skipping the query and this was causing ID parsing errors on the API. They are handled gracefully by the API, but it'll still throw unecessary errors. The following GitHub issues describes the error perfectly and suggests using the fetch-policy as a hacky way to avoid network requests unecessarily being made.
   * https://github.com/apollographql/apollo-client/issues/6190
   */
  const fiveMins = 60 * 5;
  const skip = !liveStreamId || isEmpty(liveStreamId) || liveStreamId === '';

  // State
  const [nowIsBefore, setNowIsBefore] = useState(false);
  const [nowIsAfter, setNowIsAfter] = useState(false);
  const [nextRefetch, setNextRefetch] = useState(null);

  // Fetch
  const [getLiveStream, { data, loading, error, called }] = useLazyQuery(
    GET_LIVE_STREAM
  );
  const queryOptions = {
    variables: { id: liveStreamId || '' },
    skip,
    fetchPolicy: 'network-only',
    // eslint-disable-next-line no-shadow
    onCompleted: ({ data }) => {
      const startDate = data?.node?.eventStartTime
        ? parseISO(data?.node?.eventStartTime)
        : null;
      const endDate = data?.node?.eventEndTime
        ? parseISO(data?.node?.eventEndTime)
        : null;

      if (startDate) setNowIsBefore(isBefore(new Date(), startDate));
      if (endDate) {
        setNowIsAfter(isAfter(new Date(), endDate));

        /**
         * If right now is more than 5 minutes out from the end of the stream, set the next refetch of data to be 5 minutes before the stream ends
         */

        if (differenceInSeconds(endDate, new Date()) >= fiveMins) {
          const fiveMinsBeforeEnd = subSeconds(endDate, fiveMins);
          setNextRefetch(
            differenceInMilliseconds(fiveMinsBeforeEnd, new Date())
          );
        }
      }
    },
  };
  const refetch = () => {
    if (!skip) getLiveStream(queryOptions);
  };

  // Effects
  // Timers for Refetch
  useEffect(
    () => {
      const refetchTimer = setTimeout(() => {
        // Refetch the data
        refetch();

        /**
         * If right now is within the last 5 minutes of the stream, fetch new data every 30 seconds
         */
        const endDate = data?.node?.eventEndTime
          ? parseISO(data?.node?.eventEndTime)
          : null;

        if (differenceInSeconds(endDate, new Date()) < fiveMins) {
          setNextRefetch(30000);
        }
      }, nextRefetch);

      return function cleanup() {
        if (refetchTimer) clearTimeout(refetchTimer);
      };
    },
    [nextRefetch]
  );

  useEffect(
    () => {
      const startDate = data?.node?.eventStartTime
        ? parseISO(data?.node?.eventStartTime)
        : null;
      const endDate = data?.node?.eventEndTime
        ? parseISO(data?.node?.eventEndTime)
        : null;
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

  /**
   * tl;dr : determine when we should first call this query
   *
   * There is currently a bug with the `skip` parameter in the `useQuery` hook. When `skip` is `true`, the query will not return any data nor trigger any state change, although the network request will still run in the background.
   *
   * With this hook, specifically, this causes us to run a query to `node` to get live streams even when the `liveStreamId` is an empty string. This results in a spamming of the following error: `Error parsing ID`. It also results in excess network requests.
   *
   * This hook will listen to state changes in the liveStreamId that is passed in. The `skip` variable will calculate if the Id is a valid identifier and we will call the query. To avoid running this more than is needed, we'll also check to make sure we haven't called the query already so we don't accidentally spam network requests if the component is remounted more than expected.
   */
  useEffect(
    () => {
      if (!skip && !called) {
        refetch();
      }
    },
    [liveStreamId]
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
    startDate: data?.node?.eventStartTime
      ? parseISO(data?.node?.eventStartTime)
      : null,
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
