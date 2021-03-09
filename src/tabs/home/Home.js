import React, { useState } from 'react';
import { View } from 'react-native';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import gql from 'graphql-tag';

import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';
import { styled, BackgroundView } from '@apollosproject/ui-kit';

import {
  FeaturesFeedConnected,
  HorizontalFeaturesFeedConnected,
} from 'features';

const ListHeaderSpacer = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 0.5,
}))(View);

// getHomeFeed uses the HOME_FEATURES in the config.yml
// You can also hardcode an ID if you are confident it will never change
// Or use some other strategy to get a FeatureFeed.id
export const GET_HOME_FEED = gql`
  query getHomeFeatureFeed {
    homeFeedFeatures {
      id
    }

    homeHeaderFeedFeatures {
      id
    }
  }
`;

const Home = ({ navigation }) => {
  const { data } = useQuery(GET_HOME_FEED, {
    fetchPolicy: 'cache-and-network',
  });

  return (
    <BackgroundView>
      <FeaturesFeedConnected
        featureFeedId={data?.homeFeedFeatures?.id}
        navigation={navigation}
        ListHeaderComponent={
          <ListHeaderSpacer>
            <HorizontalFeaturesFeedConnected
              featureFeedId={data?.homeHeaderFeedFeatures?.id}
            />
          </ListHeaderSpacer>
        }
        removeClippedSubviews={false}
        numColumns={1}
      />
    </BackgroundView>
  );
};

Home.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Home;
