import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { View } from 'react-native';
import { styled, BackgroundView } from '@apollosproject/ui-kit';

import {
  FeaturesFeedConnected,
  HorizontalFeaturesFeedConnected,
} from 'features';

const ListHeaderSpacer = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 0.5,
}))(View);

export const GET_HOME_FEED = gql`
  query getHomeFeatureFeed {
    homeFeedFeatures {
      id
      features {
        id
      }
    }

    homeHeaderFeedFeatures {
      id
      features {
        id
      }
    }
  }
`;

const Home = () => {
  const { data, error, loading, refetch, previousData } = useQuery(
    GET_HOME_FEED,
    {
      fetchPolicy: 'cache-and-network',
    }
  );
  const features = data?.homeFeedFeatures?.features;
  const headerFeatures = data?.homeHeaderFeedFeatures?.features;

  const previousFeatures = previousData?.homeFeedFeatures?.features;

  return (
    <BackgroundView>
      <FeaturesFeedConnected
        features={features}
        previousFeatures={previousFeatures}
        refetch={refetch}
        isLoading={loading}
        error={error}
        ListHeaderComponent={
          <ListHeaderSpacer>
            <HorizontalFeaturesFeedConnected features={headerFeatures} />
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
