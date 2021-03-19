import React from 'react';
import PropTypes from 'prop-types';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { ModalCloseButton, ModalBackButton } from '@apollosproject/ui-kit';
import PrayerRequestSingle from './PrayerRequestSingle';

const { Screen, Navigator } = createNativeStackNavigator();

const PrayerRequestSingleNavigator = ({ route, ...props }) => (
  <Navigator
    {...props}
    headerMode="screen"
    screenOptions={{
      headerTranslucent: true,
      headerStyle: { backgroundColor: 'transparent' },
      headerHideShadow: true,
      headerRight: ModalCloseButton,
      headerLeft: ModalBackButton,
      headerTitle: '',
    }}
  >
    <Screen
      name="PrayerRequestSingle"
      component={PrayerRequestSingle}
      initialParams={route.params}
    />
  </Navigator>
);

PrayerRequestSingleNavigator.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({}),
  }),
};

export default PrayerRequestSingle;
