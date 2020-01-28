import React from 'react';
import { StatusBar } from 'react-native';
import { Providers } from '@apollosproject/ui-kit';
import { AnalyticsProvider } from '@apollosproject/ui-analytics';
import { MediaPlayerProvider } from '@apollosproject/ui-media-player';

import { useDarkMode } from 'react-native-dark-mode';

import NavigationService from '../NavigationService';
import ClientProvider from '../client';
import customTheme, { customIcons } from '../theme';

import NotificationsProvider from './NotificationsProvider';
import AuthProvider from './AuthProvider';
import { track, identify } from '../amplitude';

const AppProviders = (props) => {
  const isDarkMode = useDarkMode();
  const theme = isDarkMode ? 'dark' : 'light';
  const barStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <ClientProvider {...props}>
      <NotificationsProvider navigate={NavigationService.navigate}>
        <AuthProvider
          navigateToAuth={() => NavigationService.navigate('Auth')}
          closeAuth={() => NavigationService.navigate('Tabs')}
        >
          <MediaPlayerProvider>
            <AnalyticsProvider
              trackFunctions={[track]}
              identifyFunctions={[identify]}
            >
              <StatusBar barStyle={barStyle} />
              <Providers
                themeInput={{ ...customTheme, type: theme }}
                iconInput={customIcons}
                {...props}
              />
            </AnalyticsProvider>
          </MediaPlayerProvider>
        </AuthProvider>
      </NotificationsProvider>
    </ClientProvider>
  );
};

export default AppProviders;
