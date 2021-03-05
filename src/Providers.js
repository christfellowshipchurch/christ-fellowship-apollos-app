import React from 'react';
import ApollosConfig from '@apollosproject/config';

import { AnalyticsProvider } from '@apollosproject/ui-analytics';
// import { NotificationsProvider } from '@apollosproject/ui-notifications';
import { LiveProvider } from '@apollosproject/ui-connected';
import { checkOnboardingStatusAndNavigate } from '@apollosproject/ui-onboarding';
import { AuthProvider } from '@apollosproject/ui-auth';

import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import {
  Providers,
  BackgroundView,
  NavigationService,
} from '@apollosproject/ui-kit';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import NotificationsProvider from './NotificationsProvider';
import AppStateProvider from './AppStateProvider';
import { UserFlagsProvider } from './user-flags';

import { track, identify } from './amplitude';
import ClientProvider, { client } from './client';
import customTheme, { customIcons } from './theme';

const AppProviders = (props) => {
  /**
   * note : In order to make sure that we don't accidentally set our base theme to an invalid value, we'll just check to make sure that we have either `light` or `dark` as the current scheme
   */
  const scheme = useColorScheme();
  const safeTheme = scheme === 'light' || scheme === 'dark' ? scheme : 'light';

  return (
    <ClientProvider {...props}>
      <NotificationsProvider
        oneSignalKey={ApollosConfig.ONE_SIGNAL_KEY}
        navigate={NavigationService.navigate}
      >
        <AuthProvider
          navigateToAuth={() => NavigationService.navigate('Auth')}
          navigate={NavigationService.navigate}
          closeAuth={() =>
            checkOnboardingStatusAndNavigate({
              client,
              navigation: NavigationService,
            })
          }
        >
          <UserFlagsProvider>
            <AnalyticsProvider
              trackFunctions={[track]}
              identifyFunctions={[identify]}
            >
              <Providers
                themeInput={{ ...customTheme, type: safeTheme }}
                iconInput={customIcons}
                {...props}
              >
                <BackgroundView>
                  <ActionSheetProvider>
                    <AppStateProvider {...props} />
                  </ActionSheetProvider>
                </BackgroundView>
              </Providers>
            </AnalyticsProvider>
          </UserFlagsProvider>
        </AuthProvider>
      </NotificationsProvider>
    </ClientProvider>
  );
};

const AppProvidersWithAppearance = (props) => (
  <AppearanceProvider>
    <AppProviders {...props} />
  </AppearanceProvider>
);

export default AppProvidersWithAppearance;
