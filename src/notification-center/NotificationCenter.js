import React from 'react';

import { BackgroundView, H1 } from '@apollosproject/ui-kit';

import NavigationHeader from '../content-single/NavigationHeader';

const NotificationCenter = () => (
    <BackgroundView
        style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}
    >
        <H1>Welcome to your fancy new Notification Center</H1>
    </BackgroundView>
);

NotificationCenter.navigationOptions = {
    header: NavigationHeader,
    headerTransparent: true,
    headerMode: 'float',
};

export default NotificationCenter;
