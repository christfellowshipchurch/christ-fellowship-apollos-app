import { createStackNavigator } from 'react-navigation';

import GroupSingle from './GroupSingle';

const GroupSingleNavigator = createStackNavigator(
  {
    GroupSingle,
  },
  {
    initialRouteName: 'GroupSingle',
    headerMode: 'float',
    headerTransitionPreset: 'fade-in-place',
    navigationOptions: { header: null },
  }
);

export default GroupSingleNavigator;
