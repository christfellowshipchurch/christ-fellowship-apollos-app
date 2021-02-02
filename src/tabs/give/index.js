import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import Give from './Give';

const { Navigator, Screen } = createNativeStackNavigator();

const GiveNavigator = (props) => (
  <Navigator initialRouteName="Give" {...props}>
    <Screen component={Give} name="Give" />
  </Navigator>
);

export default GiveNavigator;
