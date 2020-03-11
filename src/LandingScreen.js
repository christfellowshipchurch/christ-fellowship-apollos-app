import React from 'react';

import UILandingScreen from './ui/LandingScreen';
import AuthBackgroundComponent from './ui/AuthBackground';

const LandingScreen = ({ navigation }) => (
  <UILandingScreen
    onPressPrimary={() => navigation.push('Auth')}
    onPressSecondary={() => navigation.push('PrivacyPolicy')}
    textColor={'white'}
    BackgroundComponent={<AuthBackgroundComponent />}
    buttonTitle="Let's go!"
  />
);

LandingScreen.navigationOptions = {
  header: null,
};

export default LandingScreen;
