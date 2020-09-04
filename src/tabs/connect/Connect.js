import React, { useState } from 'react';
import { Animated } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';

import { styled } from '@apollosproject/ui-kit';
import { RockAuthedWebBrowser } from '@apollosproject/ui-connected';

import { ConnectFeaturesFeedConnected } from 'features';
import { useLinkRouter } from 'hooks';

import {
  navigationOptions,
  BackgroundView,
  NavigationSpacer,
  useHeaderScrollEffect,
} from '../../navigation';

const FlexedSafeAreaView = styled(() => ({ flex: 1 }))(SafeAreaView);

const Connect = ({ navigation }) => {
  const { routeLink } = useLinkRouter();
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
    if (action === 'READ_PRAYER') {
      navigation.navigate('PrayerRequestSingle', {
        prayerRequestId: relatedNode.id,
        transitionKey: 2,
      });
    }
    if (action === 'OPEN_URL') {
      routeLink(relatedNode.url, { nested: true });
    }
  };

  return (
    <RockAuthedWebBrowser>
      {(openUrl) => (
        <BackgroundView>
          <FlexedSafeAreaView>
            <ConnectFeaturesFeedConnected
              onPressActionItem={handleOnPress({ openUrl })}
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

Connect.navigationOptions = (props) =>
  navigationOptions({
    ...props,
    title: 'Connect',
  });

Connect.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Connect;
