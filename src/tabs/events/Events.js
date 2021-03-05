import React from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { BackgroundView } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

import { FeaturesFeedConnected } from 'features';
import VerticalCardListFeatureConnected from './VerticalCardListFeatureConnected';

const additionalFeatures = {
  VerticalCardListFeature: VerticalCardListFeatureConnected,
};

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

const Events = ({ navigation }) => {
  const { data } = useQuery(GET_EVENTS_FEED, {
    fetchPolicy: 'cache-and-network',
  });

  return (
    <RockAuthedWebBrowser>
      {(openUrl) => (
        <BackgroundView>
          <FeaturesFeedConnected
            featureFeedId={data?.eventsFeedFeatures?.id}
            openUrl={openUrl}
            navigation={navigation}
            additionalFeatures={additionalFeatures}
            removeClippedSubviews={false}
            numColumns={1}
          />
        </BackgroundView>
      )}
    </RockAuthedWebBrowser>
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
