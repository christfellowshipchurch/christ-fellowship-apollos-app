import React from 'react';
import { View, Animated, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-navigation';

import { styled, withTheme, Icon, UIText } from '@apollosproject/ui-kit';

import {
  navigationOptions,
  BackgroundView,
  NavigationSpacer,
  useHeaderScrollEffect,
} from '../../navigation';

import { useFeatureFlag } from '../../hooks';

import StatusBar from '../../ui/StatusBar';
import ProfileActionBar from './ProfileActionBar';
import ConnectHeader from './ConnectHeader';
import { MyPrayersListConnected } from './MyPrayers';
import GroupsListConnected from './Groups';

const FeatureSpacing = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit,
}))(View);

const Connect = ({ navigation }) => {
  const { scrollY } = useHeaderScrollEffect({ navigation });

  const { enabled } = useFeatureFlag({
    key: 'GROUPS',
  });

  return (
    <BackgroundView>
      <SafeAreaView
        style={{ flex: 1 }}
        forceInset={{ bottom: 'never', top: 'always' }}
      >
        <StatusBar />
        <ScrollView
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: { y: scrollY },
              },
            },
          ])}
        >
          <NavigationSpacer />
          <ConnectHeader
            onPressIcon={() => navigation.navigate('EditCurrentUser')}
          />
          <FeatureSpacing>
            <ProfileActionBar />
          </FeatureSpacing>

          <FeatureSpacing>
            <MyPrayersListConnected
              onSeeMore={() =>
                navigation.navigate('MyPrayerRequestsFeed', { nested: true })
              }
              onPressItem={(item) =>
                navigation.navigate('PrayerRequestSingle', {
                  prayerRequestId: item.id,
                })
              }
            />
          </FeatureSpacing>
          {enabled ? (
            <FeatureSpacing>
              <GroupsListConnected navigation={navigation} />
            </FeatureSpacing>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </BackgroundView>
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
    navigate: PropTypes.func,
  }),
};

export default Connect;
