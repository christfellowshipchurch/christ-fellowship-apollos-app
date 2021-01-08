import React, { useState } from 'react';
import { Animated, View } from 'react-native';
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

const Connect = ({ navigation }) => {
  const { data } = useQuery(GET_CONNECT_FEED, {
    fetchPolicy: 'network-only',
  });
  const [refetchRef, setRefetchRef] = useState(null);
  const { scrollY } = useHeaderScrollEffect({ navigation });

  console.log({ data });

  return (
    <RockAuthedWebBrowser>
      {(openUrl) => (
        <BackgroundView>
          <FlexedSafeAreaView>
            <FeaturesFeedConnected
              featureFeedId={data?.connectFeedFeatures?.id}
              openUrl={openUrl}
              navigation={navigation}
              ListHeaderComponent={<NavigationSpacer />}
              ItemSeparatorComponent={ItemSeparator}
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

Connect.navigationOptions = (props) =>
  navigationOptions({
    ...props,
    title: 'Profile',
  });

Connect.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Connect;
