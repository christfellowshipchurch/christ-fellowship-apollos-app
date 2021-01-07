import React, { useState } from 'react';
import { Animated, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import gql from 'graphql-tag';

import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';
import { styled } from '@apollosproject/ui-kit';

import {
  FeaturesFeedConnected,
  HorizontalFeaturesFeedConnected,
  handleActionPress,
} from 'features';

import Wordmark from 'ui/Wordmark';
import {
  navigationOptions,
  BackgroundView,
  NavigationSpacer,
  useHeaderScrollEffect,
} from '../../navigation';

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
  const { scrollY } = useHeaderScrollEffect({ navigation });

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
                  <NavigationSpacer />
                  <HorizontalFeaturesFeedConnected
                    featureFeedId={data?.homeHeaderFeedFeatures?.id}
                    refetchRef={get(refetchRef, 'refetchRef', () => null)}
                    refetchId="HomeFeedFeaturesHeaderConnected"
                  />
                </ListHeaderSpacer>
              }
              scrollEventThrottle={16}
              onScroll={Animated.event([
                {
                  nativeEvent: {
                    contentOffset: { y: scrollY },
                  },
                },
              ])}
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

Home.navigationOptions = (props) =>
  navigationOptions({
    ...props,
    headerTitle: <Wordmark />,
    title: 'Home',
  });

Home.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Home;
