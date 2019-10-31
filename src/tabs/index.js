import { createBottomTabNavigator } from 'react-navigation'

import TabBar from './tabBar'

import Connect from './connect'
import Home from './home'
import Discover from './discover'
import Browse from './browse'
import More from './more'

const TabNavigator = createBottomTabNavigator(
  {
    Home,
    Browse,
    Discover,
    Connect,
    More,
  },
  {
    tabBarComponent: TabBar,
    lazy: true,
    removeClippedSubviews: true,
  }
);

TabNavigator.navigationOptions = {
  header: null,
}

export default TabNavigator
