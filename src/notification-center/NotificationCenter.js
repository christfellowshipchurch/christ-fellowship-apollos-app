import React from 'react';
import NavigationHeader from '../content-single/NavigationHeader';
import NotificationList from './NotificationList';

const NotificationCenter = () => (
    <NotificationList
        notifications={[0, 1, 2, 3, 4, 5].map(() => ({
            title: 'Notification Title',
            subtitle: '',
            content:
                'This is the content of my push notification that I just received from our Christ Fellowship Comms team with all kinds of good information.',
        }))}
    />
);

NotificationCenter.navigationOptions = {
    header: NavigationHeader,
    headerTransparent: true,
    headerMode: 'float',
};

export default NotificationCenter;
