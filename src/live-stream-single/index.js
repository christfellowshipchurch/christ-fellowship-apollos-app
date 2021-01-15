import React from 'react';
import PropTypes from 'prop-types';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { ModalCloseButton, ModalBackButton } from '@apollosproject/ui-kit';
import LiveStreamSingle from './LiveStreamSingle';

const { Screen, Navigator } = createNativeStackNavigator();

const LiveStreamSingleNavigator = ({ route, ...props }) => (
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
      name="LiveStream"
      component={LiveStreamSingle}
      initialParams={route.params}
    />
  </Navigator>
);

LiveStreamSingleNavigator.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({}),
  }),
};

export default LiveStreamSingleNavigator;
