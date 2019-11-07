import React from 'react'
import { StatusBar } from 'react-native'
import { createAppContainer, createStackNavigator } from 'react-navigation'
import SplashScreen from 'react-native-splash-screen'

import './icon-library'

import { BackgroundView, withTheme } from '@apollosproject/ui-kit'
import Passes from '@apollosproject/ui-passes'
import { MediaPlayer } from '@apollosproject/ui-media-player'
import Auth, { ProtectedRoute } from '@apollosproject/ui-auth'

import Providers from './Providers'
import NavigationService from './NavigationService'
import ContentSingle from './content-single'
import Tabs from './tabs'
import Location from './profile/UserSettings/Locations'
import UserWebBrowser from './user-web-browser'
import Login from './login'
import { PrivacyPolicy, TermsOfUse, ValueProp } from './app-information'

const AppStatusBar = withTheme(({ theme }) => ({
  barStyle: 'dark-content',
  backgroundColor: theme.colors.paper,
}))(StatusBar)

const ProtectedRouteWithSplashScreen = (props) => {
  const handleOnRouteChange = () => SplashScreen.hide()

  return <ProtectedRoute {...props} onRouteChange={handleOnRouteChange} />
}

const AppContent = createStackNavigator({
  Tabs,
  ContentSingle,
  Auth,
  Location,
  Passes,
  UserWebBrowser,
}, {
  initialRouteName: 'Tabs',
  mode: 'modal',
  headerMode: 'screen',
})

const AppInfo = createStackNavigator({
  PrivacyPolicy,
  TermsOfUse,
  ValueProp
}, {
  initialRouteName: 'PrivacyPolicy',
  mode: 'modal',
  headerMode: 'screen',
})



const AppNavigator = createStackNavigator(
  {
    ProtectedRoute: ProtectedRouteWithSplashScreen,
    Tabs: AppContent,
    LandingScreen: Login,
    AppInfo
  },
  {
    initialRouteName: 'ProtectedRoute',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false,
    }
  }
)

const AppContainer = createAppContainer(AppNavigator)

const App = () => (
  <Providers>
    <BackgroundView>
      <AppStatusBar barStyle="dark-content" />
      <AppContainer
        ref={(navigatorRef) => {
          NavigationService.setTopLevelNavigator(navigatorRef)
        }}
      />
      <MediaPlayer />
    </BackgroundView>
  </Providers>
)

export default App
