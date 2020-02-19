import hoistNonReactStatic from 'hoist-non-react-statics';
import React from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import {
  DynamicValue,
  useDynamicValue,
  useDarkModeContext,
} from 'react-native-dark-mode';

import './icon-library';

import { BackgroundView, withTheme } from '@apollosproject/ui-kit';
import Passes from '@apollosproject/ui-passes';
import { MapViewConnected as Location } from '@apollosproject/ui-mapview';
import { MediaPlayer } from '@apollosproject/ui-media-player';
import Auth, { ProtectedRoute } from '@apollosproject/ui-auth';

import Providers from './MainProvider';
import NavigationService from './NavigationService';
import ContentSingle from './content-single';
import { RowContentFeed } from './content-feed';
import Tabs from './tabs';
// import Location from './locations';
import UserWebBrowser from './user-web-browser';
import Login from './login';
import { PrivacyPolicy, TermsOfUse, ValueProp } from './app-information';
import {
  CurrentUserProfile as Connect,
  EditCurrentUserProfile,
} from './profile';
import Settings from './settings';

import LandingScreen from './LandingScreen';
import Onboarding from './ui/Onboarding';

import TestNavigation from './TestNavigation';

// Hack to avoid needing to pass emailRequired through the navigator.navigate
const EnhancedAuth = (props) => <Auth {...props} emailRequired />;
// 😑
hoistNonReactStatic(EnhancedAuth, Auth);

const ProtectedRouteWithSplashScreen = (props) => {
  const handleOnRouteChange = () => SplashScreen.hide();

  return <ProtectedRoute {...props} onRouteChange={handleOnRouteChange} />;
};

const dynamicBarStyle = new DynamicValue('dark-content', 'light-content');

const AppStatusBar = withTheme(({ theme, barStyle }) => ({
  barStyle,
  backgroundColor: theme.colors.paper,
}))(StatusBar);

const DynamicAppStatusBar = () => {
  const barStyle = useDynamicValue(dynamicBarStyle);

  return <AppStatusBar barStyle={barStyle} />;
};

const AppNavigator = createStackNavigator(
  {
    ProtectedRoute: ProtectedRouteWithSplashScreen,
    Tabs,
    ContentSingle,
    Auth: EnhancedAuth,
    Passes,
    UserWebBrowser,
    Onboarding,
    LandingScreen,
    TestNavigation,
  },
  {
    initialRouteName: 'ProtectedRoute',
    mode: 'modal',
    headerMode: 'screen',
  }
);

const AppContainer = createAppContainer(AppNavigator);

const App = () => {
  const mode = useDarkModeContext();
  return (
    <Providers>
      <BackgroundView>
        <DynamicAppStatusBar />
        <AppContainer
          ref={(navigatorRef) => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
          theme={mode}
        />
        <MediaPlayer />
      </BackgroundView>
    </Providers>
  );
};

export default App;
