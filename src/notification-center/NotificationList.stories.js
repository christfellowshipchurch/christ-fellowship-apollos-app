import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import moment from 'moment';
import NotificationList from './NotificationList';

storiesOf('cf-notification-center/NotificationList', module).add(
    'default',
    () => (
        <NotificationList
            notifications={[
                {
                    title: 'Basic Notification',
                    subtitle: '',
                    content: 'Here is the content inside of this notification',
                    date: moment().format(),
                },
                {
                    title: 'Notification',
                    subtitle: 'We have a subtitle!',
                    content: 'Here is the content inside of this notification',
                    date: moment().format(),
                },
                {
                    title: 'Just a Title',
                    subtitle: '',
                    content: '',
                    date: moment().format(),
                },
                {
                    title: 'Super Long Content',
                    subtitle:
                        'This is a subtitle that totally got away from us when we were writing it.',
                    content:
                        'This is the content of my push notification that I just received from our Christ Fellowship Comms team with all kinds of good information.',
                    date: moment().format(),
                },
                {
                    title: 'Really Old',
                    subtitle: 'This notification is a super, super old.',
                    content:
                        'This item should show the year at the end of the day of week.',
                    date: moment()
                        .set('year', moment().year() - 1)
                        .format(),
                },
            ]}
        />
    )
);

storiesOf('cf-notification-center/NotificationList', module).add(
    'Empty List',
    () => <NotificationList notifications={[]} />
);
