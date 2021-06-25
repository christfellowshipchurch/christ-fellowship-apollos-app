/**
 * NotificationsProvider.js
 *
 * Author: Caleb Panza
 * Created: Apr 02, 2021
 *
 * note : This file was copied from the file: Provider.js in @apollosproject/ui-notification. There was an issue with the `navigate` method. I've left the Core Apollos code in as a comment just for reference along with a description of the change
 *
 *  todo : We should track the issue and move this file back to the Core code once a change/fix
 *  has been approved and implemented.
 *
 *  note : August 21, 2020 : In preparation for the eventual arrival of a Notification Center, we also have some temporary code inside of
 */

import React, { Component } from 'react';
import { Linking, Platform } from 'react-native';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withApollo } from '@apollo/client/react/hoc';
import { get } from 'lodash';
import OneSignal from 'react-native-onesignal';
import {
  resolvers,
  defaults,
} from '@apollosproject/ui-notifications/src/store';
import PushProvider from '@apollosproject/ui-notifications/src/pushProvider';

import { useLinkRouter } from 'hooks';

const UPDATE_DEVICE_PUSH_ID = gql`
  mutation updateDevicePushId($pushId: String!) {
    updateDevicePushId(pushId: $pushId) @client
  }
`;

const GET_PUSH_ID = gql`
  query {
    pushId @client
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
      writeQuery: PropTypes.func,
      onClearStore: PropTypes.func,
    }).isRequired,
  };

  static navigationOptions = {};

  constructor(props) {
    super(props);
    const { client } = props;
    client.addResolvers(resolvers);
    client.writeQuery({ query: GET_PUSH_ID, data: defaults });
    client.onClearStore(() =>
      client.writeQuery({ query: GET_PUSH_ID, data: defaults })
    );
  }

  componentDidMount() {
    OneSignal.init(this.props.oneSignalKey, {
      kOSSettingsKeyAutoPrompt: false,
    });
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.setSubscription(true);
    OneSignal.inFocusDisplaying(2);
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
  };

  onReceived = async (notification) => {
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
