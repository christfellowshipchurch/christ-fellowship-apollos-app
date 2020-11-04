import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { get } from 'lodash';
import { TrackEventWhenLoaded } from '@apollosproject/ui-analytics';

import NavigationHeader from 'ui/NavigationHeader';
import NotificationList from './NotificationList';

const GET_NOTIFICATIONS = gql`
  query getNotifications {
    notificationCenter {
      edges {
        node {
          id
          title(hyphenated: true)
          subtitle(hyphenated: true)
          body(hyphenated: true)
          date
        }
      }
    }
  }
`;

const mapNotificationEdges = (data) =>
  get(data, 'notificationCenter.edges', []).map(({ node }) => node);

const NotificationListConnected = () => {
  const { loading, data, error, refetch } = useQuery(GET_NOTIFICATIONS, {
    fetchPolicy: 'cache-and-network',
  });

  return (
    <>
      <TrackEventWhenLoaded
        isLoading={loading}
        eventName={'View Notification Center'}
        properties={{
          navigationPlacement: 'Header Navigation',
        }}
      />
      <NotificationList
        notifications={mapNotificationEdges(data)}
        isLoading={loading}
        error={error}
        refetch={refetch}
      />
    </>
  );
};

NotificationListConnected.navigationOptions = {
  header: NavigationHeader,
  headerTransparent: true,
  headerMode: 'float',
};

export default NotificationListConnected;
