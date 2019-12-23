// import hoistNonReactStatic from 'hoist-non-react-statics';
import React from 'react';
import { StatusBar } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';

import './icon-library';

import { BackgroundView, withTheme } from '@apollosproject/ui-kit';
import Passes from '@apollosproject/ui-passes';
import { MediaPlayer } from '@apollosproject/ui-media-player';
import Auth, { ProtectedRoute } from '@apollosproject/ui-auth';

import Providers from './Providers';
import NavigationService from './NavigationService';
import ContentSingle from './content-single';
import { RowContentFeed } from './content-feed';
import Tabs from './tabs';
import Location from './locations';
import UserWebBrowser from './user-web-browser';
import Login from './login';
import { PrivacyPolicy, TermsOfUse, ValueProp } from './app-information';
import { EditCurrentUserProfile } from './profile';
import Settings from './settings';
import Events from './tabs/more/events';

const ProtectedRouteWithSplashScreen = (props) => {
  const handleOnRouteChange = () => SplashScreen.hide();

  return <ProtectedRoute {...props} onRouteChange={handleOnRouteChange} />;
};

const AppContent = createStackNavigator(
  {
    Tabs,
    ContentSingle,
    Auth,
    Location,
    Passes,
    UserWebBrowser,
    EditCurrentUserProfile,
  },
  {
    initialRouteName: 'Tabs',
    mode: 'modal',
    headerMode: 'screen',
  }
);

const AppInfo = createStackNavigator(
  {
    Settings,
    PrivacyPolicy,
    TermsOfUse,
    ValueProp,
  },
  {
    initialRouteName: 'Settings',
    // mode: 'modal',
    headerMode: 'screen',
  }
);

// TODO : refactor this... it's garbage
const AppContentFeeds = createStackNavigator(
  {
    RowContentFeed,
  },
  {
    initialRouteName: 'RowContentFeed',
    // mode: 'modal',
    headerMode: 'screen',
    navigationOptions: {
      gesturesEnabled: true,
    },
  }
);

const EventFeeds = createStackNavigator(
  {
    Events,
  },
  {
    initialRouteName: 'Events',
    // mode: 'modal',
    headerMode: 'screen',
    navigationOptions: {
      gesturesEnabled: true,
    },
  }
);

const AppNavigator = createStackNavigator(
  {
    ProtectedRoute: ProtectedRouteWithSplashScreen,
    Tabs: AppContent,
    LandingScreen: Login,
    AppInfo,
    AppContentFeeds,
    EventFeeds,
  },
  {
    initialRouteName: 'ProtectedRoute',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false,
    },
  }
);

const AppContainer = createAppContainer(AppNavigator);

const App = () => (
  <Providers>
    <BackgroundView>
      <AppContainer
        ref={(navigatorRef) => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
      <MediaPlayer />
    </BackgroundView>
  </Providers>
);

export default App;
