import { createStackNavigator } from 'react-navigation'
import More from './More'
import tabBarIcon from '../tabBarIcon'

const MoreNavigator = createStackNavigator(
  {
    More,
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
