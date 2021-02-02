import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import Events from './Events';

const { Navigator, Screen } = createNativeStackNavigator();

const EventsNavigator = (props) => (
  <Navigator initialRouteName="Events" {...props}>
    <Screen component={Events} name="Events" />
  </Navigator>
);

export default EventsNavigator;
