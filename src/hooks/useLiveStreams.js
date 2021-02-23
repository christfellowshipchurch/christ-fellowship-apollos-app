import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { get, isEmpty, isNumber } from 'lodash';
import {
  differenceInSeconds,
  isAfter,
  isBefore,
  parseISO,
  differenceInMilliseconds,
  subSeconds,
  isWithinInterval,
  compareAsc,
  closestTo,
} from 'date-fns';
import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

/**
 * Filter For Valid Stream
 * A valid live streams includes both a valid ISO string for the Event Start and Event End. To be passed in to the Array.filter method.
 *
 * @param {string} args.eventStartTime  | ISO String for Start Date/Time
 * @param {string} args.eventEndTime    | ISO String for End Date/Time
 */
const filterForValidStream = ({ eventStartTime, eventEndTime }) => {
  const startIsInvalid = !eventStartTime || isEmpty(eventStartTime);
  const endIsInvalid = !eventEndTime || isEmpty(eventEndTime);

  if (startIsInvalid || endIsInvalid) return false;

  const start = parseISO(eventStartTime);
  const end = parseISO(eventEndTime);

  return !!start && !!end;
};

/**
 * Filter For Current Live Streams
 * A current live stream is defined as a live stream where the current time is between the Event Start and Event End. To be passed in to the Array.filter method.
 *
 * @param {string} args.eventStartTime  | ISO String for Start Date/Time
 * @param {string} args.eventEndTime    | ISO String for End Date/Time
 */
const filterForCurrentStreams = ({ eventStartTime, eventEndTime }) => {
  const start = parseISO(eventStartTime);
  const end = parseISO(eventEndTime);

  return isWithinInterval(new Date(), { start, end });
};

/**
 * Filter For Future Live Streams
 * A future live stream is defined as a live stream where the current time is before the Event Start. To be passed in to the Array.filter method.
 *
 * @param {string} args.eventStartTime  | ISO String for Start Date/Time
 */
const filterForFutureStreams = ({ eventStartTime }) => {
  const start = parseISO(eventStartTime);

  return isBefore(new Date(), start);
};

/**
 * Evaluate Next Refetch
 * @param {array} liveStreams
 * @returns integer
 *
 */
const evaluateNextRefetch = (liveStreams) => {
  /**
   * TL;DR Find the next change of live stream status (either live to not-live, or not-live to live) and trigger a refetch at that time.
   *
   * We're going to pull 2 values, the soonest start time of an upcoming stream and the soonest end time of a currently live stream. Once we have those values, we're going to select the soonest of them and set the refetch time to be at that time.
   *
   * This trigger will refilter all live streams that we currently have fetched from the server and recalculate the next closest change in status.
   */
  const nextStart = liveStreams
    .filter(filterForValidStream)
    .filter(filterForFutureStreams)
    .map(({ eventStartTime }) => parseISO(eventStartTime))
    .sort(compareAsc)
    .find(() => true);
  const nextEnd = liveStreams
    .filter(filterForValidStream)
    .filter(filterForCurrentStreams)
    .map(({ eventEndTime }) => parseISO(eventEndTime))
    .sort(compareAsc)
    .find(() => true);
  const datesArray = [nextStart, nextEnd].filter((n) => !!n);
  if (datesArray.length) {
    const nextStatusChange = closestTo(new Date(), datesArray);
    return differenceInMilliseconds(nextStatusChange, new Date());
  }

  return null;
};

/**
 * useLiveStreams
 * Hook to handle the status of a collection of live streams passed in.
 * It was determined that data should not be fetched in this in order to allow for us to handle data fetching with a more specific context (think a live stream feature vs. querying for `liveStreams`)
 *
 * @param {array} liveStreams | Live Stream objects that should be managed
 */
const useLiveStreams = (liveStreams) => {
  const skip = !Array.isArray(liveStreams) || liveStreams.length === 0;
  const [nextRefetch, setNextRefetch] = useState(null);

  // Effects
  useEffect(
    () => {
      let refetchTimer = null;

      if (!skip) {
        if (isNumber(nextRefetch) && nextRefetch > 0) {
          refetchTimer = setTimeout(() => {
            const milSecs = evaluateNextRefetch(liveStreams);
            if (milSecs) {
              setNextRefetch(milSecs);
            }
          }, nextRefetch);
        } else {
          const milSecs = evaluateNextRefetch(liveStreams);
          if (milSecs) {
            setNextRefetch(milSecs);
          }
        }
      }

      return function cleanup() {
        if (refetchTimer) clearTimeout(refetchTimer);
      };
    },
    [nextRefetch, liveStreams]
  );

  return {
    liveStreams,
    currentStreams: skip
      ? []
      : liveStreams
          .filter(filterForValidStream)
          .filter(filterForCurrentStreams),
    futureStreams: skip
      ? []
      : liveStreams.filter(filterForValidStream).filter(filterForFutureStreams),
    streamsAreLive:
      !skip &&
      liveStreams.filter(filterForValidStream).filter(filterForCurrentStreams)
        .length > 0,
  };
};

useLiveStreams.propTypes = {
  liveStreams: PropTypes.arrayOf(PropTypes.shape({})),
};

useLiveStreams.defaultProps = {
  liveStreams: [],
};

export default useLiveStreams;
