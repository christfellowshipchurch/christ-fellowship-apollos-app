import React from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { BackgroundView } from '@apollosproject/ui-kit';

import { FeaturesFeedConnected } from 'features';

// getEventsFeed uses the EVENTS_FEATURES in the config.yml
// You can also hardcode an ID if you are confident it will never change
// Or use some other strategy to get a FeatureFeed.id
export const GET_EVENTS_FEED = gql`
  query getEventsFeatureFeed {
    eventsFeedFeatures {
      id
    }
  }
`;

const Events = () => {
  const { data, error, loading } = useQuery(GET_EVENTS_FEED, {
    fetchPolicy: 'cache-first',
  });
  const featuresFeedId = data?.eventsFeedFeatures?.id;

  return (
    <BackgroundView>
      <FeaturesFeedConnected
        featuresFeedId={featuresFeedId}
        isLoading={loading}
        error={error}
        removeClippedSubviews={false}
        numColumns={1}
      />
    </BackgroundView>
  );
};

Events.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Events;
