/** This file was copied from the file: Provider.js in @apollosproject/ui-notification
 *  There was an issue with the `navigate` method. I've left the Core Apollos code in
 *  as a comment just for reference along with a description of the change
 *
 *  We should track the issue and move this file back to the Core code once a change/fix
 *  has been approved and implemented.
 *
 *  UPDATE : August 21, 2020
 *  In preparation for the eventual arrival of a Notification Center, we also have some
 *  temporary code inside of
 */
import React, { Component } from 'react';
import { Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { get, isArray, take } from 'lodash';
import OneSignal from 'react-native-onesignal';
import PushProvider from '@apollosproject/ui-notifications/src/pushProvider';
import {
    resolvers,
    defaults,
} from '@apollosproject/ui-notifications/src/store';

import { useLinkRouter, useNotificationHistory } from 'hooks';

const UPDATE_DEVICE_PUSH_ID = gql`
  mutation updateDevicePushId($pushId: String!) {
    updateDevicePushId(pushId: $pushId) @client
  }
`;

class NotificationsInit extends Component {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node,
        ]).isRequired,
        oneSignalKey: PropTypes.string.isRequired,
        navigate: PropTypes.func.isRequired,
        client: PropTypes.shape({
            mutate: PropTypes.func,
            addResolvers: PropTypes.func,
            writeData: PropTypes.func,
            onClearStore: PropTypes.func,
        }).isRequired,
        routeLink: PropTypes.func,
        onNotification: PropTypes.func,
    };

    static navigationOptions = {};

    constructor(props) {
        super(props);
        const { client } = props;
        client.addResolvers(resolvers);
        client.writeData({ data: defaults });
        client.onClearStore(() => client.writeData({ data: defaults }));
    }

    componentDidMount() {
        OneSignal.init(this.props.oneSignalKey, {
            kOSSettingsKeyAutoPrompt: false,
        });
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
        OneSignal.setSubscription(true);
        Linking.getInitialURL().then((url) => {
            this.navigate(url);
        });
        Linking.addEventListener('url', ({ url }) => this.navigate(url));
    }

    componentWillUnmount() {
        Linking.removeEventListener('url');
        OneSignal.removeEventListener('received');
        OneSignal.removeEventListener('opened');
        OneSignal.removeEventListener('ids');
    }

    navigate = (rawUrl) => {
        if (!rawUrl) return;
        this.props.routeLink(rawUrl);
    };

    onReceived = async (notification) => {
        console.log('Notification received: ', notification);

        /** TL;DR : store the 10 most recent push notifications in local storage
         *
         *  If we don't have any value in Async Storage, add the incoming notification
         *  as an array of the single object.
         *
         *  If there is a value in Async Storage that is _not_ an array, add that object
         *  to an array and, append the new notification, then save back to async
         *
         *  If there is an array in Async Storage, check the length. If the length >= 10,
         *  sort by date and grab the 9 latest. Then append the new notification with timestamp
         *  and save to Async Storage.
         */

        const payload = get(notification, 'payload', {});
        this.props.onNotification({
            title: payload.title,
            subtitle: payload.subtitle,
            body: payload.body,
            id: payload.notificationID,
            date: moment()
                .utc()
                .format(),
        });
    };

    onOpened = (openResult) => {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
        // URL looks like this
        // apolloschurchapp://AppStackNavigator/Connect
        // apolloschurchapp://SomethingElse/Connect
        // apolloschurchapp://SomethingElse/ContentSingle?itemId=SomeItemId:blablalba
        const url = Platform.select({
            ios: get(openResult, 'notification.payload.additionalData.url'),
            android: get(openResult, 'notification.payload.launchURL'),
        });

        if (url) {
            this.navigate(url);
        }
    };

    onIds = (device) => {
        this.props.client.mutate({
            mutation: UPDATE_DEVICE_PUSH_ID,
            variables: { pushId: device.userId },
        });
    };

    render() {
        return <PushProvider>{this.props.children}</PushProvider>;
    }
}

const NotificationsInitWithApollo = withApollo(NotificationsInit);

const NotificationsInitHookProvider = (props) => {
    const { routeLink } = useLinkRouter();
    const { addNotification } = useNotificationHistory();

    return (
        <NotificationsInitWithApollo
            {...props}
            routeLink={routeLink}
            onNotification={addNotification}
        />
    );
};

export default NotificationsInitHookProvider;
