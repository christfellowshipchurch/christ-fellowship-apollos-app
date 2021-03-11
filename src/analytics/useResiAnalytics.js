/**
 * useResiAnalytics.js
 *
 * Author: Caleb Panza
 * Created: Mar 09, 2021
 *
 * Resi analytics hook
 */

import URL from 'url';
import { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client';
import { RestLink } from 'apollo-link-rest';
import gql from 'graphql-tag';
import { get, isEmpty } from 'lodash';

// Set `RestLink` with your endpoint
const restLink = new RestLink({
  uri: 'https://webevents.livingasone.com/api/v1',
});

// Setup your client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: restLink,
});

const GET_STATS_URL = gql`
  query getStatusUrl($eventId: String) {
    eventProfiles
      @rest(
        type: "EventProfiles"
        path: "eventProfiles/latest/$eventId?clientId=$clientId"
      ) {
      statsUrl
      statsUpdateFreq
      clientId
    }
  }
`;

const getResiUrlConfiguration = (uri) => {
  const url = URL.parse(uri);
  const { hostname, query } = url;
  const eventId = get(query, 'eventId');

  return {
    isValid: hostname === 'resi.media' && !isEmpty(eventId),
    eventId,
  };
};

const getStatsUrl = (eventId, callback) => {
  const getUrl = `https://webevents.livingasone.com/api/v1/eventProfiles/latest/${eventId}`;
  fetch(getUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((json) => callback(json))
    .catch((error) => {
      console.warn('Resi Analytics Hook get', error);
    });
};

const postCurrentState = (url) => {
  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audioBandwidth: null,
      bitrateSetting: null,
      bitrateSwitchCount: null,
      bufferingTime: null,
      currentPosition: null,
      distBehindLive: null,
      droppedFrames: null,
      estimatedBandwidth: null,
      fullScreen: null,
      live: null,
      state: null,
      totalTimeWatched: 0,
      videoBandwidth: null,
      videoHeight: 0,
      videoWidth: 0,
    }),
  }).catch((error) => {
    console.warn('Resi Analytics Hook post', error);
  });
};

const useResiAnalytics = (url) => {
  const [postUrl, setPostUrl] = useState(null);
  const { isValid, eventId } = getResiUrlConfiguration(url);

  if (isValid) {
    getStatsUrl(eventId, ({ statsUrl }) => {
      if (!isEmpty) {
        setPostUrl(statsUrl);
      }
    });
  }

  useEffect(
    () => {
      const postInterval = setInterval(() => {
        if (!isEmpty(postUrl)) {
          postCurrentState(postUrl);
        }
      }, 30000);

      return function cleanup() {
        if (postInterval) clearInterval(postInterval);
      };
    },
    [postUrl]
  );
};

export default useResiAnalytics;
