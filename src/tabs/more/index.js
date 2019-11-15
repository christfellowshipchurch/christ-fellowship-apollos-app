import { createStackNavigator } from 'react-navigation'

import More from './More'
import Events from './events'

import tabBarIcon from '../tabBarIcon'

const MoreNavigator = createStackNavigator(
  {
    More,
    Events,
  },
  {
    initialRouteName: 'More',
    headerMode: 'screen',
  }
)

MoreNavigator.navigationOptions = {
  tabBarIcon: tabBarIcon('bars'),
}

export default MoreNavigator
