import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

import getLikedContent from '../getLikedContent';
import RecentlyLikedTileFeed from './RecentlyLikedTileFeed';

const RecentlyLikedTileFeedConnected = ({ navigation }) => (
  <Query
    query={getLikedContent}
    fetchPolicy="cache-and-network"
    variables={{ first: 3 }}
  >
    {({
      loading,
      data: { likedContent: { edges = [] } = { edges: [] } } = {},
    }) => {
      if (!edges.length) return null;
      return (
        <RecentlyLikedTileFeed
          id={'liked'}
          name={'Recently Liked'}
          content={edges.map((e) => e.node)}
          isLoading={loading}
          navigation={navigation}
          loadingStateObject={{
            title: 'Recently Liked',
            isLoading: true,
          }}
        />
      );
    }}
  </Query>
);

RecentlyLikedTileFeedConnected.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default RecentlyLikedTileFeedConnected;
