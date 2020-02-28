import { createStackNavigator } from 'react-navigation';
import Identity from './Identity';
import Passcode from './Passcode';
import ProfileInformation from './ProfileInformation';
import EnableNotifications from './EnableNotifications';

const OnboardingNavigator = createStackNavigator(
  {
    Identity,
    Passcode,
    ProfileInformation,
    EnableNotifications,
  },
  {
    initialRouteName: 'Identity',
  }
);

OnboardingNavigator.navigationOptions = {
  header: null,
};

export default OnboardingNavigator;
