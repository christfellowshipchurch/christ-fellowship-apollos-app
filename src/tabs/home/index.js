import { createStackNavigator } from 'react-navigation';

import tabBarIcon from '../tabBarIcon';

import Events from '../more/events';
import Home from './Home';

export const HomeNavigator = createStackNavigator(
  {
    Home,
    Events,
  },
  {
    initialRouteName: 'Home',
  }
);

HomeNavigator.navigationOptions = {
  tabBarIcon: tabBarIcon('home'),
};

export default HomeNavigator;
