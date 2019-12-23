import { createBottomTabNavigator } from 'react-navigation';
import { withTheme } from '@apollosproject/ui-kit';

import TabBar from './tabBar';

import Connect from './connect';
import Home from './home';
import Browse from './browse';
import More from './more';

const TabNavigator = createBottomTabNavigator(
  {
    Home,
    Browse,
    Connect,
    More,
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
