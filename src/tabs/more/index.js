import { createStackNavigator } from 'react-navigation';

import tabBarIcon from '../tabBarIcon';
import More from './More';
import Events from './events';

const MoreNavigator = createStackNavigator(
  {
    More,
    // Events,
  },
  {
    initialRouteName: 'More',
    headerMode: 'screen',
  }
);

MoreNavigator.navigationOptions = {
  tabBarIcon: tabBarIcon('bars'),
};

export default MoreNavigator;
