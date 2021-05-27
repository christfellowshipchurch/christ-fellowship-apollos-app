/**
 * ProvidersStack.js
 *
 * Author: Caleb Panza
 * Created: Apr 02, 2021
 *
 * Organizational file to keep all App Providers in a cleaner, easier to manage area of our project.
 */

import React from 'react';
import ApollosConfig from '@apollosproject/config';

// :: Imported Providers
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { AnalyticsProvider } from '@apollosproject/ui-analytics';
import { AppearanceProvider } from 'react-native-appearance';
import { AuthProvider } from '@apollosproject/ui-auth';
import { checkOnboardingStatusAndNavigate } from '@apollosproject/ui-onboarding';
import { NavigationService } from '@apollosproject/ui-kit';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// :: Local Providers
import ClientProvider, { client } from '../client';
import { StreamChatClientContextProvider } from '../stream-chat';
import { track, identify } from '../amplitude';
import { UserFlagsProvider } from '../user-flags';
import CoreApollosProviders from './CoreApollosProviders';
import NotificationsProvider from './NotificationsProvider';
import UniversalLinkRouteProvider from './UniversalLinkRouteProvider';

// todo : user flag context
// import { UserFlagsProvider } from './user-flags';

const ProvidersStack = (props) => (
  // <AppearanceProvider>
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
        {/* Removed to avoid compliance issues with iOS 14 App Tracking */}
        {/* ! : no analytics are being collected at this moment */}
        {/* <AnalyticsProvider
          trackFunctions={[track]}
          identifyFunctions={[identify]}
        > */}
        <AnalyticsProvider trackFunctions={[]} identifyFunctions={[]}>
          <CoreApollosProviders {...props}>
            <UserFlagsProvider>
              <StreamChatClientContextProvider>
                <ActionSheetProvider>
                  <UniversalLinkRouteProvider {...props} />
                </ActionSheetProvider>
              </StreamChatClientContextProvider>
            </UserFlagsProvider>
          </CoreApollosProviders>
        </AnalyticsProvider>
      </AuthProvider>
    </NotificationsProvider>
  </ClientProvider>

  // </AppearanceProvider>
);

ProvidersStack.propTypes = {};
ProvidersStack.defaultProps = {};

export default ProvidersStack;
