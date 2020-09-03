import { createBottomTabNavigator } from 'react-navigation';
import { withTheme } from '@apollosproject/ui-kit';

import TabBar from './tabBar';

import Connect from './connect';
import Discover from './discover';
import Events from './events';
import Give from './give';
import Home from './home';

const TabNavigator = createBottomTabNavigator(
  {
    Home,
    Discover,
    Events,
    Give,
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
