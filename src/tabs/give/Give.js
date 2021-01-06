import React, { useState } from 'react';
import { Animated } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { styled } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

import { FeaturesFeedConnected, handleActionPress } from 'features';

import {
  navigationOptions,
  BackgroundView,
  NavigationSpacer,
  useHeaderScrollEffect,
} from '../../navigation';

// getHomeFeed uses the HOME_FEATURES in the config.yml
// You can also hardcode an ID if you are confident it will never change
// Or use some other strategy to get a FeatureFeed.id
export const GET_GIVE_FEED = gql`
  query getGiveFeedFeatures {
    giveFeedFeatures {
      id
    }
  }
`;

const FlexedSafeAreaView = styled(() => ({ flex: 1 }))(SafeAreaView);

const Give = ({ navigation }) => {
  const { data } = useQuery(GET_GIVE_FEED, {
    fetchPolicy: 'cache-and-network',
  });
  const [refetchRef, setRefetchRef] = useState(null);
  const { scrollY } = useHeaderScrollEffect({ navigation });

  return (
    <RockAuthedWebBrowser>
      {(openUrl) => (
        <BackgroundView>
          <FlexedSafeAreaView>
            <FeaturesFeedConnected
              featureFeedId={data?.giveFeedFeatures?.id}
              openUrl={openUrl}
              onPressActionItem={handleActionPress}
              ListHeaderComponent={<NavigationSpacer />}
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
          </FlexedSafeAreaView>
        </BackgroundView>
      )}
    </RockAuthedWebBrowser>
  );
};

Give.navigationOptions = (props) =>
  navigationOptions({
    ...props,
    title: 'Give',
  });

Give.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Give;
