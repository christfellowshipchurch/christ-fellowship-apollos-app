import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { SafeAreaView } from 'react-navigation';
import { View } from 'react-native';
import { styled, BackgroundView } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

import { FeaturesFeedConnected } from 'features';

const FlexedSafeAreaView = styled(() => ({ flex: 1 }))(SafeAreaView);

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
  const { data } = useQuery(GET_CONNECT_FEED, {
    fetchPolicy: 'network-only',
  });
  const [refetchRef, setRefetchRef] = useState(null);

  return (
    <RockAuthedWebBrowser>
      {(openUrl) => (
        <BackgroundView>
          <FlexedSafeAreaView>
            <FeaturesFeedConnected
              featureFeedId={data?.connectFeedFeatures?.id}
              openUrl={openUrl}
              ItemSeparatorComponent={ItemSeparator}
              removeClippedSubviews={false}
              numColumns={1}
              onRef={(ref) => setRefetchRef(ref)}
            />
          </FlexedSafeAreaView>
        </BackgroundView>
      )}
    </RockAuthedWebBrowser>
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
