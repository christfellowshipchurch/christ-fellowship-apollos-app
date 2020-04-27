import { createStackNavigator } from 'react-navigation';
import tabBarIcon from '../tabBarIcon';
import Discover from './Discover';

export const BrowseNavigator = createStackNavigator(
  {
    Discover,
  },
  {
    initialRouteName: 'Discover',
    headerLayoutPreset: 'left',
  }
);

BrowseNavigator.navigationOptions = {
  tabBarIcon: tabBarIcon('search'),
};

export default BrowseNavigator;
