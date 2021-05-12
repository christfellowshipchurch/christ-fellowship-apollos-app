import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { isEmpty } from 'lodash';

import { FeaturesFeedConnected } from 'features';
import { ItemSeparatorComponent } from '../ContentBody';

const GET_FEATURE_FEED = gql`
  query getTitle($nodeId: ID!) {
    node(id: $nodeId) {
      id
      ... on FeaturesNode {
        featureFeed {
          id
        }
      }
    }
  }
`;

const FeaturesFeed = ({ nodeId }) => {
  const skip = !nodeId || isEmpty(nodeId);
  const { data, loading, error } = useQuery(GET_FEATURE_FEED, {
    variables: { nodeId },
    skip,
    fetchPolicy: 'network-only',
  });
  const featureFeedId = data?.node?.featureFeed?.id;

  if (isEmpty(featureFeedId)) return null;

  return (
    <FeaturesFeedConnected
      featuresFeedId={featureFeedId}
      isLoading={loading}
      error={error}
      removeClippedSubviews={false}
      numColumns={1}
      scrollEnabled={false}
      ItemSeparatorComponent={ItemSeparatorComponent}
    />
  );
};

FeaturesFeed.propTypes = {
  nodeId: PropTypes.string,
};

FeaturesFeed.defaultProps = {};

export default FeaturesFeed;
