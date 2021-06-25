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
import { AuthProvider } from '@apollosproject/ui-auth';
import { checkOnboardingStatusAndNavigate } from '@apollosproject/ui-onboarding';
import { NavigationService } from '@apollosproject/ui-kit';

// :: Local Providers
import ClientProvider, { client } from '../client';
import { track, identify } from '../amplitude';
import { UserFlagsProvider } from '../user-flags';
import CurrentUserProvider from './CurrentUserProvider';
import NotificationsProvider from './NotificationsProvider';
import UniversalLinkRouteProvider from './UniversalLinkRouteProvider';

// todo : user flag context
// import { UserFlagsProvider } from './user-flags';

const ProvidersStack = (props) => (
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
        <CurrentUserProvider>
          <AnalyticsProvider
            trackFunctions={[track]}
            identifyFunctions={[identify]}
          >
            <UserFlagsProvider>
              <ActionSheetProvider>
                <UniversalLinkRouteProvider {...props} />
              </ActionSheetProvider>
            </UserFlagsProvider>
          </AnalyticsProvider>
        </CurrentUserProvider>
      </AuthProvider>
    </NotificationsProvider>
  </ClientProvider>
);

ProvidersStack.propTypes = {};
ProvidersStack.defaultProps = {};

export default ProvidersStack;
