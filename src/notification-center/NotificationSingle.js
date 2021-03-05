/**
 * NotificationSingle.js
 *
 * Author: Caleb Panza
 * Created: Mar 05, 2021
 *
 * description
 */

import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { isEmpty } from 'lodash';
import { TrackEventWhenLoaded } from '@apollosproject/ui-analytics';

import { ScrollView } from 'react-native';
import { BackgroundView, PaddedView } from '@apollosproject/ui-kit';
import ThemeMixin from 'ui/DynamicThemeMixin';
import { Row, DateLabel, Title, Subtitle, Content, Render } from './styles';

const GET_NOTIFICATION = gql`
  query getNotification($id: ID!) {
    node(id: $id) {
      ... on Message {
        id
        title
        subtitle
        body
        date
      }
    }
  }
`;

const NotificationSingle = (props) => {
  const itemId = props.route?.params?.itemId;
  const { loading, data, error } = useQuery(GET_NOTIFICATION, {
    skip: isEmpty(itemId),
    fetchPolicy: 'cache-and-network',
    variable: {
      id: itemId,
    },
  });

  const notification = data?.node;
  const title = notification?.title;
  const date = notification?.date;
  const subtitle = notification?.subtitle;
  const body = notification?.body;

  return (
    <ThemeMixin>
      <BackgroundView>
        <TrackEventWhenLoaded
          isLoading={loading}
          eventName={'View Notification Single'}
          properties={{
            itemId,
            ...notification,
          }}
        />
        <ScrollView>
          <PaddedView>
            <Row>
              <DateLabel date={date} />
            </Row>
            <Render condition={(title && title !== '') || loading}>
              <Title isLoading={loading}>{title}</Title>
            </Render>
            <Render condition={(subtitle && subtitle !== '') || loading}>
              <Subtitle>{subtitle}</Subtitle>
            </Render>
            <Render condition={(body && body !== '') || loading}>
              <Content>{body}</Content>
            </Render>
          </PaddedView>
        </ScrollView>
      </BackgroundView>
    </ThemeMixin>
  );
};

export default NotificationSingle;
