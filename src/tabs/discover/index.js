import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

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
    headerRight: HeaderButtons,
    headerLargeTitle: true,
    headerHideShadow: true,
  },
}))(DiscoverNavigator);

export default Discover;
