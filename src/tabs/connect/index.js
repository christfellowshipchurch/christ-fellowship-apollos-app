import { createStackNavigator } from 'react-navigation';

import tabBarIcon from '../tabBarIcon';
import Connect from './Connect';

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
  title: 'Profile',
};

export default ConnectNavigator;
