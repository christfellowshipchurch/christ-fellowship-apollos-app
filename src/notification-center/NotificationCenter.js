import React from 'react';

import { SafeAreaView } from 'react-navigation';
import { BackgroundView, H3, PaddedView } from '@apollosproject/ui-kit';

import ThemeMixin from 'ui/DynamicThemeMixin';
import NavigationHeader from '../content-single/NavigationHeader';

const Background = () => (
    <BackgroundView>
        <SafeAreaView forceInset={{ top: 'always', bottom: 'always' }}>
            <PaddedView>
                <H3>Updates</H3>
            </PaddedView>
        </SafeAreaView>
    </BackgroundView>
);

const NotificationCenter = () => (
    <ThemeMixin>
        <Background />
    </ThemeMixin>
);

NotificationCenter.navigationOptions = {
    header: NavigationHeader,
    headerTransparent: true,
    headerMode: 'float',
};

export default NotificationCenter;
