import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { View } from 'react-native';
import { styled, BackgroundView } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

import { FeaturesFeedConnected } from 'features';

// getConnectFeed uses the CONNECT_FEATURES in the config.yml
// You can also hardcode an ID if you are confident it will never change
// Or use some other strategy to get a FeatureFeed.id
export const GET_CONNECT_FEED = gql`
  query getConnectFeatureFeed {
    connectFeedFeatures {
      id
      features {
        id
      }
    }
  }
`;

const ItemSeparator = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit * 2,
}))(View);

const Connect = () => {
  const { data, error, loading, refetch } = useQuery(GET_CONNECT_FEED, {
    fetchPolicy: 'cache-and-network',
  });
  const features = data?.connectFeedFeatures?.features;

  return (
    <BackgroundView>
      <FeaturesFeedConnected
        features={features}
        refetch={refetch}
        isLoading={loading}
        error={error}
        removeClippedSubviews={false}
        numColumns={1}
        ItemSeparatorComponent={ItemSeparator}
      />
    </BackgroundView>
  );
};

Connect.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Connect;
