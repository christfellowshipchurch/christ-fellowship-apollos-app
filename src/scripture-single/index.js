import React from 'react';
import PropTypes from 'prop-types';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { ModalCloseButton, ModalBackButton } from '@apollosproject/ui-kit';
import ScriptureSingle from './ScriptureSingle';

const { Screen, Navigator } = createNativeStackNavigator();

const ScriptureSingleNavigator = ({ route, ...props }) => (
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
      name="ScriptureSingle"
      component={ScriptureSingle}
      initialParams={route.params}
    />
  </Navigator>
);

ScriptureSingleNavigator.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({}),
  }),
};

export default ScriptureSingleNavigator;
export { default as ScriptureButton } from './ScriptureButton';
