import hoistNonReactStatic from 'hoist-non-react-statics';
import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import { useDarkModeContext } from 'react-native-dark-mode';

import {
  BackgroundView,
  ThemeMixin,
  NavigationService,
} from '@apollosproject/ui-kit';
import Passes from '@apollosproject/ui-passes';
import { MapViewConnected as Location } from '@apollosproject/ui-mapview';
import { MediaPlayer } from '@apollosproject/ui-media-player';
import { ProtectedRoute } from '@apollosproject/ui-auth';
import Auth from './auth';
import StatusBar from './ui/StatusBar';

import Providers from './Providers';
import ContentSingle from './content-single';
import ContentFeed from './content-feed';
import Tabs from './tabs';
import EditUser from './edit-user';
import NotificationCenter from './notification-center';
import PrayerRequestSingle from './prayer-request-single';
import MyPrayerRequestsFeed from './my-prayer-requests-feed';

import LandingScreen from './LandingScreen';
import Onboarding from './ui/Onboarding';
import AuthBackground from './ui/AuthBackground';

// bugsnag configuration
// eslint-disable-next-line
import bugsnag from './bugsnag';

// Hack to avoid needing to pass emailRequired through the navigator.navigate
const EnhancedAuth = (props) => (
  <ThemeMixin mixin={{ type: 'onboarding' }}>
    <Auth
      {...props}
      BackgroundComponent={AuthBackground}
      emailRequired={false}
    />
  </ThemeMixin>
);
// 😑
hoistNonReactStatic(EnhancedAuth, Auth);

const ProtectedRouteWithSplashScreen = (props) => {
  const handleOnRouteChange = () => SplashScreen.hide();

  return (
    <ProtectedRoute
      {...props}
      onRouteChange={handleOnRouteChange}
      loggedOutRouteName="LandingScreen"
    />
  );
};

const AppContent = createStackNavigator(
  {
    Tabs,
    ContentFeed,
    MyPrayerRequestsFeed,
  },
  {
    initialRouteName: 'Tabs',
    headerMode: 'none',
  }
);

const AppNavigator = createStackNavigator(
  {
    ProtectedRoute: ProtectedRouteWithSplashScreen,
    Tabs: {
      screen: AppContent,
      navigationOptions: {
        header: null,
      },
    },
    ContentSingle,
    Auth: EnhancedAuth,
    Passes,
    Onboarding,
    LandingScreen,
    EditUser,
    Location,
    NotificationCenter,
    PrayerRequestSingle,
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
        <StatusBar />
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
