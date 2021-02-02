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

import AvatarIcon from './connect/AvatarIcon';
import TabBarIcon from './tabBarIcon';
import HeaderButtons from './HeaderButtons';

const { Navigator, Screen } = createBottomTabNavigator();

/**
 * Created this `EnhancedNavigator` helper since we use the exact same screen options for Events, Give and Connect
 */
const EnhancedNavigator = (Component, screenOptions) =>
  withTheme(({ theme, ...props }) => ({
    ...props,
    screenOptions: {
      headerTintColor: theme.colors.action.secondary,
      headerTitleStyle: {
        color: theme.colors.text.primary,
      },
      headerStyle: {
        backgroundColor: theme.colors.background.paper,
        ...Platform.select(theme.shadows.default),
        ...screenOptions?.headerStyle,
      },
      headerLargeTitle: true,
      headerHideShadow: true,
      headerRight: HeaderButtons,
    },
  }))(Component);

const EnhancedEvents = EnhancedNavigator(Events);
const EnhancedGive = EnhancedNavigator(Give);
const EnhancedConnect = EnhancedNavigator(Connect);

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
        title: 'Discover',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name={'search'} focused={focused} />
        ),
      }}
    />
    <Screen
      name="Events"
      component={EnhancedEvents}
      options={{
        title: 'Events',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name={'calendar'} focused={focused} />
        ),
      }}
    />
    <Screen
      name="Give"
      component={EnhancedGive}
      options={{
        title: 'Give',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name={'envelope-open-dollar'} focused={focused} />
        ),
      }}
    />
    <Screen
      name="Connect"
      component={EnhancedConnect}
      options={{
        title: 'Connect',
        tabBarIcon: ({ focused }) => <AvatarIcon focused={focused} />,
      }}
    />
  </Navigator>
);

const ThemedTabNavigator = withTheme(({ theme }) => ({
  screenOptions: {
    headerShown: true,
    headerLargeStyle: true,
  },
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
