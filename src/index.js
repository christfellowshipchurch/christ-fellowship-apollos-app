import React from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';

import { BackgroundView, withTheme } from '@apollosproject/ui-kit';
import Passes from '@apollosproject/ui-passes';
import { MediaPlayer } from '@apollosproject/ui-media-player';
import Auth, { ProtectedRoute } from '@apollosproject/ui-auth';

import Providers from './Providers';
import NavigationService from './NavigationService';
import ContentSingle from './content-single';
import Tabs from './tabs';
import PersonalDetails from './user-settings/PersonalDetails';
import ChangePassword from './user-settings/ChangePassword';
import Location from './user-settings/Locations';
import LandingScreen from './LandingScreen';
import UserWebBrowser from './user-web-browser';
import Onboarding from './ui/Onboarding';

const AppStatusBar = withTheme(({ theme }) => ({
  barStyle: 'dark-content',
  backgroundColor: theme.colors.paper,
}))(StatusBar);

const ProtectedRouteWithSplashScreen = (props) => {
  const handleOnRouteChange = () => SplashScreen.hide();

  return <ProtectedRoute {...props} onRouteChange={handleOnRouteChange} />;
};

const AppNavigator = createStackNavigator(
  {
    ProtectedRoute: ProtectedRouteWithSplashScreen,
    Tabs,
    ContentSingle,
    Auth,
    PersonalDetails,
    ChangePassword,
    Location,
    Passes,
    UserWebBrowser,
    Onboarding,
    LandingScreen,
  },
  {
    initialRouteName: 'ProtectedRoute',
    mode: 'modal',
    headerMode: 'screen',
  }
);

const App = () => (
  <Providers>
    <BackgroundView>
      <AppStatusBar barStyle="dark-content" />
      <AppNavigator
        ref={(navigatorRef) => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
      <MediaPlayer />
    </BackgroundView>
  </Providers>
);

export default App;
