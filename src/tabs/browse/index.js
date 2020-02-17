import { createStackNavigator } from 'react-navigation';
import tabBarIcon from '../tabBarIcon';
import Browse from './Browse';

export const BrowseNavigator = createStackNavigator(
  {
    Browse,
  },
  {
    initialRouteName: 'Browse',
  }
);

BrowseNavigator.navigationOptions = {
  tabBarIcon: tabBarIcon('search'),
};

export default BrowseNavigator;
