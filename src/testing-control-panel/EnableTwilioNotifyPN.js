import React, { Component } from 'react';

import { Query } from 'react-apollo';
import { get } from 'lodash';

import { client } from 'ChristFellowship/src/client';
import TouchableCell from './TouchableCell';
import PushNotification from 'react-native-push-notification'
import { render } from 'react-dom';

const requestPN = (enable = true) => {
  console.log(`${enable ? '' : 'Not '}Requesting Permission for PN`)

  if (enable) PushNotification.requestPermissions()
  else PushNotification.abandonPermissions()

  PushNotification.checkPermissions(({ alert, badge, sound }) => {
    console.log({ alert, badge, sound })
  })
}

// Testing as a React component class that extends Component instead of an anonymous function
class EnableTwilioNotifyPN extends Component {

  constructor(props) {
    super(props);

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
        Alert.alert(
          'Enabled Push Notifications',
          'Push notifications have been registered and token has been registered',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false },
        );
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // process the notification

        // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
      // senderID: 'YOUR GCM (OR FCM) SENDER ID',

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true
    });
  }

  render() {
    return (
      <React.Fragment>
        <TouchableCell
          handlePress={() => requestPN()}
          iconName='radio-checked'
          cellText='Enable Twilio Notify Push Notifications'
        />
        <TouchableCell
          handlePress={() => requestPN(false)}
          iconName='radio-unchecked'
          cellText='Disable Twilio Notify Push Notifications'
        />
      </React.Fragment>
    );
  }
}
export default EnableTwilioNotifyPN;