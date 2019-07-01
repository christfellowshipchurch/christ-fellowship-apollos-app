import React from 'react';
import Config from 'react-native-config';
import { Providers } from '@apollosproject/ui-kit';
import { AuthProvider } from '@apollosproject/ui-auth';
import { AnalyticsProvider } from '@apollosproject/ui-analytics';
import { MediaPlayerProvider } from '@apollosproject/ui-media-player';
import { NotificationsProvider } from '@apollosproject/ui-notifications';

import NavigationService from './NavigationService';
import ClientProvider from './client';
import customTheme, { customIcons } from './theme';

const AppProviders = (props) => (
  <ClientProvider {...props}>
    <NotificationsProvider
      oneSignalKey={Config.ONE_SIGNAL_KEY}
      navigate={NavigationService.navigate}
    >
      <AuthProvider
        navigateToAuth={() => NavigationService.navigate('Auth')}
        closeAuth={() => NavigationService.navigate('Onboarding')}
      >
        <MediaPlayerProvider>
          <AnalyticsProvider>
            <Providers
              themeInput={customTheme}
              iconInput={customIcons}
              {...props}
            />
          </AnalyticsProvider>
        </MediaPlayerProvider>
      </AuthProvider>
    </NotificationsProvider>
  </ClientProvider>
);

export default AppProviders;
