import { createStackNavigator } from 'react-navigation'
import ContentFeed from 'ChristFellowship/src/content-feed'
import tabBarIcon from '../tabBarIcon'
import Browse from './Browse'

export const BrowseNavigator = createStackNavigator(
  {
    Browse,
    ContentFeed,
  },
  {
    initialRouteName: 'Browse',
  }
)

BrowseNavigator.navigationOptions = {
  tabBarIcon: tabBarIcon('search'),
}

export default BrowseNavigator
