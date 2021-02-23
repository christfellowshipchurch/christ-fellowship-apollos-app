import React, { useState } from 'react';
import { Animated, View, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import gql from 'graphql-tag';

import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';
import { styled, BackgroundView } from '@apollosproject/ui-kit';

import {
  FeaturesFeedConnected,
  HorizontalFeaturesFeedConnected,
  handleActionPress,
} from 'features';

import Wordmark from 'ui/Wordmark';

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
  const [refetchRef, setRefetchRef] = useState(null);

  return (
    <RockAuthedWebBrowser>
      {(openUrl) => (
        <BackgroundView>
          <SafeAreaView>
            <FeaturesFeedConnected
              featureFeedId={data?.homeFeedFeatures?.id}
              openUrl={openUrl}
              navigation={navigation}
              ListHeaderComponent={
                <ListHeaderSpacer>
                  <HorizontalFeaturesFeedConnected
                    featureFeedId={data?.homeHeaderFeedFeatures?.id}
                    refetchRef={get(refetchRef, 'refetchRef', () => null)}
                    refetchId="HomeFeedFeaturesHeaderConnected"
                  />
                </ListHeaderSpacer>
              }
              removeClippedSubviews={false}
              numColumns={1}
              onRef={(ref) => setRefetchRef(ref)}
            />
          </SafeAreaView>
        </BackgroundView>
      )}
    </RockAuthedWebBrowser>
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
