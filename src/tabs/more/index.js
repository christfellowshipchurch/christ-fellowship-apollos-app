import { createStackNavigator } from 'react-navigation';

import tabBarIcon from '../tabBarIcon';
import More from './More';
import InlineWebView from './InlineWebView';

const MoreNavigator = createStackNavigator(
  {
    More,
    InlineWebView,
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
