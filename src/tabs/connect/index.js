import { createStackNavigator } from 'react-navigation'

import Connect from './Connect'
import {
  AboutMe,
  AppInformation,
  CommunicationPreferences,
  FaithMilestones,
  FamilyInformation,
  UserSettings
} from 'ChristFellowship/src/profile'

import tabBarIcon from '../tabBarIcon'

const ConnectNavigator = createStackNavigator(
  {
    Connect,
    AboutMe: {
      screen: AboutMe,
      navigationOptions: () => ({ header: null })
    },
    AppInformation: {
      screen: AppInformation,
      navigationOptions: () => ({ header: null })
    },
    // CommunicationPreferences: {
    //   screen: UserSettings,
    //   navigationOptions: () => ({ header: null })
    // },
    // FaithMilestones: {
    //   screen: UserSettings,
    //   navigationOptions: () => ({ header: null })
    // },
    // FamilyInformation: {
    //   screen: UserSettings,
    //   navigationOptions: () => ({ header: null })
    // },
    UserSettings: {
      screen: UserSettings,
      navigationOptions: () => ({ header: null })
    },
  },
  {
    initialRouteName: 'Connect',
    headerMode: 'screen',
  }
);

ConnectNavigator.navigationOptions = {
  tabBarIcon: tabBarIcon('profile'),
};

export default ConnectNavigator
