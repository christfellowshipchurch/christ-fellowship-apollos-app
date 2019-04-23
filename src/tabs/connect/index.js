import { createStackNavigator } from 'react-navigation';

import UserSettings from 'ChristFellowship/src/user-settings';

import TestingControlPanel from '../../testing-control-panel';
import tabBarIcon from '../tabBarIcon';
import Connect from './Connect';
import LikedContentList from './LikedContentList';

const ConnectNavigator = createStackNavigator(
  {
    Connect,
    TestingControlPanel,
    UserSettings,
    LikedContentList,
  },
  {
    initialRouteName: 'Connect',
    headerMode: 'screen',
  }
);

ConnectNavigator.navigationOptions = {
  tabBarIcon: tabBarIcon('profile'),
};

export default ConnectNavigator;
