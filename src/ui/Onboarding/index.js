import React from 'react';

import {
  Identity, Passcode, ProfileInformation, EnableNotifications
} from './slides'

import { createStackNavigator } from 'react-navigation';

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

const Onboarding = (props) => <OnboardingNavigator {...props} />

export default OnboardingNavigator
