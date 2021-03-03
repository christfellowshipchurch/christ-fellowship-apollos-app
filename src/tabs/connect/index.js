import React from 'react';
import { Platform } from 'react-native';
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
    headerTintColor: theme.colors.action.secondary,
    headerTitleStyle: {
      color: theme.colors.text.primary,
    },
    headerStyle: {
      backgroundColor: theme.colors.background.paper,
      ...Platform.select(theme.shadows.default),
    },
    headerRight: HeaderButtons,
    headerHideShadow: true,
  },
}))(ConnectNavigator);

export default EnhancedNavigator;
