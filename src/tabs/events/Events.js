import React from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { BackgroundView } from '@apollosproject/ui-kit';
import ApollosConfig from '@apollosproject/config';

import { FeaturesFeedConnected } from 'features';

// getEventsFeed uses the EVENTS_FEATURES in the config.yml
// You can also hardcode an ID if you are confident it will never change
// Or use some other strategy to get a FeatureFeed.id
export const GET_EVENTS_FEED = gql`
  query getEventsFeatureFeed {
    eventsFeedFeatures {
      id
      features {
        id
        ...ActionBarFeatureFragment
        ...AvatarListFeatureFragment
        ...HeroListFeatureFragment
        ...HorizontalCardListFeatureFragment
        ...VerticalCardListFeatureFragment
      }
    }
  }

  ${ApollosConfig.FRAGMENTS.HERO_LIST_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.HORIZONTAL_CARD_LIST_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.VERTICAL_CARD_LIST_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.RELATED_NODE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.ACTION_BAR_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.AVATAR_LIST_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.THEME_FRAGMENT}
`;

const Events = () => {
  const { data, error, loading, refetch } = useQuery(GET_EVENTS_FEED, {
    fetchPolicy: 'cache-and-network',
  });
  const features = data?.eventsFeedFeatures?.features;

  return (
    <BackgroundView>
      <FeaturesFeedConnected
        features={features}
        refetch={refetch}
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
