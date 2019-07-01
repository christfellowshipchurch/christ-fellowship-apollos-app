import React from 'react';

import { Query } from 'react-apollo';
import { get } from 'lodash';

import { client } from 'ChristFellowship/src/client';
import GET_LIVE_STREAM from 'ChristFellowship/src/live/getLiveStream';
import TouchableCell from './TouchableCell';

const changeLivestream = ({ isLive }) =>
  client.writeQuery({
    query: GET_LIVE_STREAM,
    data: {
      liveStream: {
        __typename: 'LiveStream',
        isLive,
      },
    },
  });

const ChangeLivestream = () => (
  <Query query={GET_LIVE_STREAM}>
    {({ data }) => {
      const isLive = get(data, 'liveStream.isLive', false);
      return (
        <TouchableCell
          handlePress={() => changeLivestream({ isLive: !isLive })}
          iconName={isLive ? 'pause' : 'play'}
          cellText={`${isLive ? 'End' : 'Start'} The Livestream`}
        />
      );
    }}
  </Query>
);

export default ChangeLivestream;
