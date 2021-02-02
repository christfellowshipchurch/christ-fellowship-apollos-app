import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import Connect from './Connect';

const { Navigator, Screen } = createNativeStackNavigator();

const ConnectNavigator = (props) => (
  <Navigator initialRouteName="Connect" {...props}>
    <Screen component={Connect} name="Connect" />
  </Navigator>
);

export default ConnectNavigator;
