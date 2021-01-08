import hoistNonReactStatic from 'hoist-non-react-statics';
import React from 'react';
import { Platform, YellowBox } from 'react-native';
import { useDarkModeContext } from 'react-native-dark-mode';
import 'react-native-gesture-handler'; // required for react-navigation
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';

import {
  BackgroundView,
  ThemeMixin,
  NavigationService,
  withTheme,
} from '@apollosproject/ui-kit';
import Passes from '@apollosproject/ui-passes';
import { MapViewConnected as Location } from '@apollosproject/ui-mapview';
import { ProtectedRoute } from '@apollosproject/ui-auth';
import ScreenOrientation from 'screen-orientation';
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

import 'core-js/features/promise';

enableScreens(); // improves performance for react-navigation

// ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
YellowBox.ignoreWarnings(['Warning:']);

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

// Hack to avoid needing to pass emailRequired through the navigator.navigate
const EnhancedAuth = (props) => <Auth {...props} emailRequired={false} />;
// 😑
hoistNonReactStatic(EnhancedAuth, Auth);

const { Navigator, Screen } = createNativeStackNavigator();
const ThemedNavigator = withTheme(({ theme, ...props }) => ({
  ...props,
  screenOptions: {
    headerTintColor: theme.colors.action.secondary,
    headerTitleStyle: {
      color: theme.colors.text.primary,
    },
    // headerStyle: {
    //   backgroundColor: theme.colors.background.paper,
    //   ...Platform.select(theme.shadows.default),
    // },
    headerShown: false,
    stackPresentation: 'modal',
  },
}))(Navigator);

const App = (props) => (
  <Providers>
    <BackgroundView>
      <StatusBar />
      <ScreenOrientation />
      <NavigationContainer
        ref={NavigationService.setTopLevelNavigator}
        // theme={mode}
      >
        <ThemedNavigator initialRouteName="ProtectedRoute" {...props}>
          <Screen
            name="Auth"
            component={EnhancedAuth}
            options={{
              title: 'Login',
              gestureEnabled: false,
              stackPresentation: 'push',
            }}
          />
          {/* <Screen
              name="Channel"
              component={Channel}
              options={{ title: 'Channel' }}
            /> */}
          {/* <Screen
              name="ChannelsList"
              component={ChannelsList}
              options={{ title: 'ChannelsList' }}
            /> */}
          {/* <Screen
              name="ContentFeed"
              component={ContentFeed}
              options={{ title: 'Content Feed' }}
            /> */}
          <Screen
            name="ContentSingle"
            component={ContentSingle}
            options={{ title: 'Content' }}
          />
          {/* <Screen
              name="EditGroup"
              component={EditGroup}
              options={{ title: 'Edit Group' }}
            /> */}
          {/* <Screen
              name="EditUser"
              component={EditUser}
              options={{ title: 'Edit User' }}
            /> */}
          {/* <Screen
              name="GroupSingle"
              component={GroupSingle}
              options={{ title: 'Group' }}
            /> */}
          <Screen
            name="LandingScreen"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          {/* <Screen
              name="Location"
              component={Location}
              options={{ headerShown: true }}
            /> */}
          {/* <Screen
              name="MyPrayerRequestsFeed"
              component={MyPrayerRequestsFeed}
              options={{ title: 'My Prayer Requests' }}
            /> */}
          {/* <Screen
              name="NodeSingle"
              component={NodeSingle}
              options={{ title: 'Node' }}
            /> */}
          {/* <Screen
              name="NotificationCenter"
              component={NotificationCenter}
              options={{ title: 'Notification Center' }}
            /> */}
          <Screen
            name="Onboarding"
            component={Onboarding}
            options={{
              title: 'Onboarding',
              gestureEnabled: false,
              stackPresentation: 'push',
            }}
          />
          {/* <Screen
              name="Passes"
              component={Passes}
              options={{ title: 'Check-In Pass' }}
            /> */}
          {/* <Screen
              name="PrayerRequestSingle"
              component={PrayerRequestSingle}
              options={{ title: 'Prayer Request Single' }}
            /> */}
          <Screen
            name="ProtectedRoute"
            component={ProtectedRouteWithSplashScreen}
          />
          <Screen name="Tabs" component={Tabs} options={{ title: 'Home' }} />
        </ThemedNavigator>
      </NavigationContainer>
    </BackgroundView>
  </Providers>
);

export default App;
