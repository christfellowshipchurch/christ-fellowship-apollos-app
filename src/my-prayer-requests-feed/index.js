import React from 'react';
import PropTypes from 'prop-types';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { ModalCloseButton, ModalBackButton } from '@apollosproject/ui-kit';
import MyPrayerRequestsFeed from './MyPrayerRequestsFeed';

const { Screen, Navigator } = createNativeStackNavigator();

const MyPrayerRequestsFeedNavigator = ({ route, ...props }) => (
  <Navigator
    {...props}
    headerMode="screen"
    screenOptions={{
      headerShown: true,
      headerLargeStyle: true,
      headerStyle: { backgroundColor: 'transparent' },
      headerHideShadow: true,
      headerRight: ModalCloseButton,
      headerLeft: ModalBackButton,
      headerTitle: 'My Prayer Requests',
    }}
  >
    <Screen
      name="MyPrayerRequestsFeed"
      component={MyPrayerRequestsFeed}
      initialParams={route.params}
    />
  </Navigator>
);

MyPrayerRequestsFeedNavigator.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({}),
  }),
};

export default MyPrayerRequestsFeed;
