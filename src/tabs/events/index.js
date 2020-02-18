import { createStackNavigator } from 'react-navigation';

import tabBarIcon from '../tabBarIcon';
import Events from './Events';

const EventsNavigator = createStackNavigator(
  {
    Events,
  },
  {
    initialRouteName: 'Events',
    headerLayoutPreset: 'left',
  }
);

EventsNavigator.navigationOptions = {
  tabBarIcon: tabBarIcon('calendar'),
};

export default EventsNavigator;
