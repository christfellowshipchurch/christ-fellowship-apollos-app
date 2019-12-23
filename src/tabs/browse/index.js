import { createStackNavigator } from 'react-navigation';
import { RowContentFeed } from 'ChristFellowship/src/content-feed';
import tabBarIcon from '../tabBarIcon';
import Browse from './Browse';

export const BrowseNavigator = createStackNavigator(
  {
    Browse,
    // RowContentFeed,
  },
  {
    initialRouteName: 'Browse',
  }
);

BrowseNavigator.navigationOptions = {
  tabBarIcon: tabBarIcon('search'),
};

export default BrowseNavigator;
