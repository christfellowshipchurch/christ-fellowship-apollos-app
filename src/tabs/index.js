import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Platform } from 'react-native';
import { withTheme } from '@apollosproject/ui-kit';

import Drawer from '../drawer';

import Connect from './connect';
import Discover from './discover';
import Events from './events';
import Give from './give';
import Home from './home';

import AvatarIcon from './AvatarIcon';
import TabBarIcon from './TabBarIcon';

const { Navigator, Screen } = createBottomTabNavigator();

const TabNavigator = (props) => (
  <Navigator {...props} lazy>
    <Screen
      name="Home"
      component={Home}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name={'home'} focused={focused} />
        ),
      }}
    />

    <Screen
      name="Discover"
      component={Discover}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name={'search'} focused={focused} />
        ),
      }}
    />

    <Screen
      name="Events"
      component={Events}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name={'calendar'} focused={focused} />
        ),
      }}
    />
    <Screen
      name="Give"
      component={Give}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name={'envelope-open-dollar'} focused={focused} />
        ),
      }}
    />
    <Screen
      name="Connect"
      component={Connect}
      options={{
        tabBarIcon: ({ focused }) => <AvatarIcon focused={focused} />,
      }}
    />
  </Navigator>
);

const ThemedTabNavigator = withTheme(({ theme }) => ({
  headerMode: 'none',
  tabBarOptions: {
    activeTintColor: theme.colors.primary,
    inactiveTintColor: theme.colors.text.tertiary,
    style: {
      backgroundColor: theme?.colors?.background?.paper,
      borderTopWidth: 0,
      paddingTop: theme.sizing.baseUnit * 0.8,
      paddingHorizontal: theme.sizing.baseUnit,
      ...Platform.select(theme?.shadows.default),
    },
  },
}))(TabNavigator);

const StackWithDrawer = () => <Drawer Stack={ThemedTabNavigator} />;

export default StackWithDrawer;
