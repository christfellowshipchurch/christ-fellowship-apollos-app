import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { withTheme } from '@apollosproject/ui-kit';

import Wordmark from 'ui/Wordmark';
import HeaderButtons from '../HeaderButtons';
import Home from './Home';

const { Navigator, Screen } = createNativeStackNavigator();

const HomeNavigator = (props) => (
  <Navigator initialRouteName="Home" {...props}>
    <Screen component={Home} name="Home" />
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
    headerLeft: Wordmark,
    headerRight: HeaderButtons,
    headerTitle: '',
    headerHideShadow: true,
  },
}))(HomeNavigator);

export default EnhancedNavigator;
