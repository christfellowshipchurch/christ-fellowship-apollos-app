import React from 'react';
import ApollosConfig from '@apollosproject/config';
import { Providers } from '@apollosproject/ui-kit';
import { AnalyticsProvider } from '@apollosproject/ui-analytics';
import { MediaPlayerProvider } from '@apollosproject/ui-media-player';
import { NotificationsProvider } from '@apollosproject/ui-notifications';
import { LiveProvider } from '@apollosproject/ui-connected';
import { AuthProvider } from '@apollosproject/ui-auth';

import {
    DynamicValue,
    useDynamicValue,
    DarkModeProvider,
} from 'react-native-dark-mode';

import { track, identify } from './amplitude';
import NavigationService from './NavigationService';
import ClientProvider from './client';
import customTheme, { customIcons } from './theme';

const dynamicTheme = new DynamicValue('light', 'dark');

const AppProviders = (props) => {
    const theme = useDynamicValue(dynamicTheme);

    return (
        <ClientProvider {...props}>
            <NotificationsProvider
                oneSignalKey={ApollosConfig.ONE_SIGNAL_KEY}
                navigate={NavigationService.navigate}
            >
                <AuthProvider
                    navigateToAuth={() => NavigationService.navigate('Auth')}
                    navigate={NavigationService.navigate}
                    closeAuth={() => NavigationService.navigate('Onboarding')}
                >
                    <MediaPlayerProvider>
                        <AnalyticsProvider
                            trackFunctions={[track]}
                            identifyFunctions={[identify]}
                        >
                            <LiveProvider>
                                <DarkModeProvider>
                                    <Providers
                                        themeInput={{ ...customTheme, type: theme }}
                                        iconInput={customIcons}
                                        {...props}
                                    />
                                </DarkModeProvider>
                            </LiveProvider>
                        </AnalyticsProvider>
                    </MediaPlayerProvider>
                </AuthProvider>
            </NotificationsProvider>
        </ClientProvider>
    );
};

export default AppProviders;
