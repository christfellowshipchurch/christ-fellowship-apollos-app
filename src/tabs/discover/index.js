import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { Platform } from 'react-native';
import { withTheme } from '@apollosproject/ui-kit';
import HeaderButtons from '../HeaderButtons';

import Discover from './Discover';

const { Navigator, Screen } = createNativeStackNavigator();

const DiscoverNavigator = (props) => (
  <Navigator initialRouteName="Discover" {...props}>
    <Screen component={Discover} name="Discover" />
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
    headerHideShadow: true,
    headerRight: HeaderButtons,
  },
}))(DiscoverNavigator);

export default EnhancedNavigator;
