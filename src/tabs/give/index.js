import { createStackNavigator } from 'react-navigation';
import tabBarIcon from '../tabBarIcon';
import Give from './Give';

const GiveNavigator = createStackNavigator(
  {
    Give,
  },
  {
    initialRouteName: 'Give',
    headerLayoutPreset: 'left',
  }
);

GiveNavigator.navigationOptions = {
  tabBarIcon: tabBarIcon('envelope-open-dollar'),
};

export default GiveNavigator;
