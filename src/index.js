import hoistNonReactStatic from 'hoist-non-react-statics';
import React from 'react';
import { YellowBox } from 'react-native';
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
import { ProtectedRoute } from '@apollosproject/ui-auth';
import { CoreNavigationAnalytics } from '@apollosproject/ui-analytics';
import ScreenOrientation from 'screen-orientation';
import { MediaPlayer } from './media-player';
import Auth from './auth';
import StatusBar from './ui/StatusBar';

import Providers from './Providers';
import ContentSingle from './content-single';
import NodeSingle from './node-single';
import ContentFeed from './content-feed';
import Tabs from './tabs';
import EditUser from './edit-user';
import GroupSingle from './group-single';
import EditGroup from './edit-group';
import NotificationCenter from './notification-center';
import PrayerRequestSingle from './prayer-request-single';
import MyPrayerRequestsFeed from './my-prayer-requests-feed';
import ChannelsList from './chat/ChannelsList';
import Channel from './chat/Channel';

import LandingScreen from './LandingScreen';
import Onboarding from './ui/Onboarding';
import AuthBackground from './ui/AuthBackground';

// bugsnag configuration
// eslint-disable-next-line
import bugsnag from './bugsnag';

// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
YellowBox.ignoreWarnings(['Warning:']);

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
    ChannelsList,
    Channel,
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
    NodeSingle,
    Auth: EnhancedAuth,
    Passes,
    Onboarding,
    LandingScreen,
    EditUser,
    Location,
    GroupSingle,
    EditGroup,
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
        <ScreenOrientation />
        <CoreNavigationAnalytics>
          {(props) => (
            <AppContainer
              ref={(navigatorRef) => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
              theme={mode}
              {...props}
            />
          )}
        </CoreNavigationAnalytics>
        <MediaPlayer />
      </BackgroundView>
    </Providers>
  );
};

export default App;
