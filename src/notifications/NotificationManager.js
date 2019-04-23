import URL from 'url';
import querystring from 'querystring';
import { Component } from 'react';
import { Linking } from 'react-native';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import OneSignal from 'react-native-onesignal';
import Config from 'react-native-config';
import { get } from 'lodash';

import NavigationService from '../NavigationService';

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
  };

  static navigationOptions = {};

  static propTypes = {
    client: PropTypes.shape({
      mutate: PropTypes.func,
    }),
  };

  componentDidMount() {
    OneSignal.init(Config.ONE_SIGNAL_KEY, {
      kOSSettingsKeyAutoPrompt: false,
    });
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.configure();
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
    const url = URL.parse(rawUrl);
    const route = url.pathname.substring(1);
    const args = querystring.parse(url.query);
    NavigationService.navigate(route, args);
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
    // ChristFellowship://AppStackNavigator/Connect
    // ChristFellowship://SomethingElse/Connect
    // ChristFellowship://SomethingElse/ContentSingle?itemId=SomeItemId:blablalba
    const url = get(openResult, 'notification.payload.additionalData.url');
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
    return this.props.children;
  }
}

export default withApollo(NotificationsInit);
