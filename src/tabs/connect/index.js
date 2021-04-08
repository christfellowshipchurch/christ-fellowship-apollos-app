import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { withTheme } from '@apollosproject/ui-kit';

import HeaderButtons from '../HeaderButtons';
import Connect from './Connect';

const { Navigator, Screen } = createNativeStackNavigator();

const ConnectNavigator = (props) => (
  <Navigator initialRouteName="Connect" {...props}>
    <Screen component={Connect} name="Connect" />
  </Navigator>
);

const EnhancedNavigator = withTheme(({ theme, ...props }) => ({
  ...props,
  screenOptions: {
    headerRight: HeaderButtons,
    headerLargeTitle: true,
    headerHideShadow: true,
  },
}))(ConnectNavigator);

export default Connect;
