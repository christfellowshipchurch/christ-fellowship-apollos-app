import React from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { View } from 'react-native';
import { styled, BackgroundView } from '@apollosproject/ui-kit';

import { FeaturesFeedConnected } from 'features';
import TabHeader from '../TabHeader';

// getConnectFeed uses the CONNECT_FEATURES in the config.yml
// You can also hardcode an ID if you are confident it will never change
// Or use some other strategy to get a FeatureFeed.id
export const GET_CONNECT_FEED = gql`
  query getConnectFeatureFeed {
    connectFeedFeatures {
      id
    }
  }
`;

const ItemSeparator = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit * 2,
}))(View);

const Connect = () => {
  const { data, error, loading } = useQuery(GET_CONNECT_FEED, {
    fetchPolicy: 'network-only',
  });
  const featuresFeedId = data?.connectFeedFeatures?.id;

  return (
    <BackgroundView>
      <TabHeader title="Connect" />
      <FeaturesFeedConnected
        featuresFeedId={featuresFeedId}
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
