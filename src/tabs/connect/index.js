import { createStackNavigator } from 'react-navigation'

import Connect from './Connect'
import tabBarIcon from '../tabBarIcon'

const ConnectNavigator = createStackNavigator(
  {
    Connect,
  },
  {
    initialRouteName: 'Connect',
    headerMode: 'screen',
  }
);

ConnectNavigator.navigationOptions = {
  tabBarIcon: tabBarIcon('user-circle'),
  title: 'Profile'
};

export default ConnectNavigator
