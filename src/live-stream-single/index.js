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
      headerShown: false,
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
