import React from 'react';
import { Animated } from 'react-native';
import { useQuery } from '@apollo/client';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { styled } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

import { FeaturesFeedConnected } from 'features';
import {
  navigationOptions,
  BackgroundView,
  NavigationSpacer,
  useHeaderScrollEffect,
} from '../../navigation';
import VerticalCardListFeatureConnected from './VerticalCardListFeatureConnected';

const additionalFeatures = {
  VerticalCardListFeature: VerticalCardListFeatureConnected,
};

const FlexedSafeAreaView = styled(() => ({ flex: 1 }))(SafeAreaView);

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
  const { scrollY } = useHeaderScrollEffect({ navigation });

  return (
    <RockAuthedWebBrowser>
      {(openUrl) => (
        <BackgroundView>
          <FlexedSafeAreaView>
            <FeaturesFeedConnected
              featureFeedId={data?.eventsFeedFeatures?.id}
              openUrl={openUrl}
              navigation={navigation}
              additionalFeatures={additionalFeatures}
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
            />
          </FlexedSafeAreaView>
        </BackgroundView>
      )}
    </RockAuthedWebBrowser>
  );
};

Events.navigationOptions = (props) =>
  navigationOptions({
    ...props,
    title: 'Events',
  });

Events.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Events;
