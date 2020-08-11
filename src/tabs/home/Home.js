import React, { useState } from 'react';
import { Animated, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';
import { styled } from '@apollosproject/ui-kit';

import { FeaturesFeedConnected, FeaturesHeaderConnected } from 'features';

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

const Home = ({ navigation }) => {
  const [refetchRef, setRefetchRef] = useState(null);
  const { scrollY } = useHeaderScrollEffect({ navigation });
  const handleOnPress = ({ openUrl }) => ({ action, relatedNode }) => {
    if (action === 'READ_CONTENT') {
      navigation.navigate('ContentSingle', {
        itemId: relatedNode.id,
        transitionKey: 2,
      });
    }
    if (action === 'READ_EVENT') {
      navigation.navigate('Event', {
        eventId: relatedNode.id,
        transitionKey: 2,
      });
    }
    if (action === 'OPEN_URL') {
      openUrl(relatedNode.url);
    }
  };

  return (
    <RockAuthedWebBrowser>
      {(openUrl) => (
        <BackgroundView>
          <SafeAreaView>
            <FeaturesFeedConnected
              onPressActionItem={handleOnPress({ openUrl })}
              ListHeaderComponent={
                <ListHeaderSpacer>
                  <NavigationSpacer />
                  <FeaturesHeaderConnected
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
