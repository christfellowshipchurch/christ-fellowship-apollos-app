import { createBottomTabNavigator } from 'react-navigation';
import { withTheme } from '@apollosproject/ui-kit';

import TabBar from './tabBar';

import Connect from './connect';
import Home from './home';
import Discover from './discover';
import Events from './events';

const TabNavigator = createBottomTabNavigator(
  {
    Home,
    Discover,
    Events,
    Connect,
  },
  {
    tabBarComponent: TabBar,
    lazy: true,
    removeClippedSubviews: true,
    tabBarOptions: {
      // safeAreaInset: { bottom: 'never' },
    },
  }
);

TabNavigator.navigationOptions = {
  header: null,
};

export default withTheme()(TabNavigator);
