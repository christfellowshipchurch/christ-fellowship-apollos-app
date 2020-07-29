/** This file was copied from the file: Provider.js in @apollosproject/ui-notification
 *  There was an issue with the `navigate` method. I've left the Core Apollos code in
 *  as a comment just for reference along with a description of the change
 *
 *  We should track the issue and move this file back to the Core code once a change/fix
 *  has been approved and implemented.
 */
import React, { Component } from 'react';
import { Linking, Platform } from 'react-native';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { get } from 'lodash';
import OneSignal from 'react-native-onesignal';
import PushProvider from '@apollosproject/ui-notifications/src/pushProvider';
import {
    resolvers,
    defaults,
} from '@apollosproject/ui-notifications/src/store';

import { useLinkRouter } from 'hooks';

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
        console.log({ oneSignal: this.props.oneSignalKey });

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
        console.log({ rawUrl });

        if (!rawUrl) return;

        this.props.routeLink(rawUrl);

        /** The bug that is fixed in the code below is one where routes are
         *  incorrectly being cleaned.
         *
         *  Error:
         *  The current structure of Push Notification urls do _not_ require
         *  that `app-link` be in the url, so updating the urls to match the new
         *  structure would mean that anyone running the app <5.2.0 would not be
         *  able to open up deep links.
         *
         *  Current Url Deep Link: `cf://cf/Profile` gets cleaned to `undefined`
         *  New Url Deep Link: `cf://cf/app-link/Profile` gets cleaned to `/Profile`
         *
         *  The given change updates the logic to route the raw url to our useLinkRouter
         *  hook as provided by `NotificationsInitHookProvider` in order to take advantage
         *  of routing urls from the API instead of hardcoded values.
         */

        // const url = URL.parse(rawUrl);
        // const route = url.pathname.substring(1);
        // const cleanedRoute = route.includes('/app-link/')
        //   ? route
        //   : route.split('app-link/')[1];
    };

    onReceived = (notification) => {
        console.log('Notification received: ', notification);
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

    return <NotificationsInitWithApollo {...props} routeLink={routeLink} />;
};

export default NotificationsInitHookProvider;
