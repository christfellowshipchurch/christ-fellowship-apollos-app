import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { withTheme } from '@apollosproject/ui-kit';

import HeaderButtons from '../HeaderButtons';
import Events from './Events';

const { Navigator, Screen } = createNativeStackNavigator();

const EventsNavigator = (props) => (
  <Navigator initialRouteName="Events" {...props}>
    <Screen component={Events} name="Events" />
  </Navigator>
);

const EnhancedNavigator = withTheme(({ theme, ...props }) => ({
  ...props,
  screenOptions: {
    headerMode: 'screen',
    headerTintColor: theme.colors.primary,
    headerTitleStyle: {
      color: theme.colors.text.primary,
    },
    headerStyle: {
      backgroundColor: theme.colors.background.paper,
      ...Platform.select(theme.shadows.default),
    },
    headerRight: HeaderButtons,
    headerLargeTitle: true,
    headerHideShadow: true,
  },
}))(EventsNavigator);

export default EnhancedNavigator;
