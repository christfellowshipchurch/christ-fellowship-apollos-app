import { createStackNavigator } from 'react-navigation';

import tabBarIcon from '../tabBarIcon';
import More from './More';

const MoreNavigator = createStackNavigator(
  {
    More,
  },
  {
    initialRouteName: 'More',
    headerLayoutPreset: 'left',
  }
);

MoreNavigator.navigationOptions = {
  tabBarIcon: tabBarIcon('bars'),
};

export default MoreNavigator;
