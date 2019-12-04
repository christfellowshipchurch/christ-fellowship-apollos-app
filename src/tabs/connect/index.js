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
    CommunicationPreferences: {
      screen: CommunicationPreferences,
      navigationOptions: () => ({ header: null })
    },
    FaithMilestones: {
      screen: FaithMilestones,
      navigationOptions: () => ({ header: null })
    },
    FamilyInformation: {
      screen: FamilyInformation,
      navigationOptions: () => ({ header: null })
    },
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
  tabBarIcon: tabBarIcon('user-circle'),
};

export default ConnectNavigator
