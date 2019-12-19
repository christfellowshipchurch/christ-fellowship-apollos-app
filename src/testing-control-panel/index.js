import React, { PureComponent } from 'react';
<<<<<<< ours
import { TableView, Divider } from '@apollosproject/ui-kit';
import { UserWebBrowserConsumer } from 'ChristFellowship/src/user-web-browser';
import ChangeLivestream from './ChangeLivestream';
import TouchableCell from './TouchableCell';

import PushNotifications from './EnableTwilioNotifyPN';

=======
import { TableView } from '@apollosproject/ui-kit';
import { UserWebBrowserConsumer } from 'ChristFellowship/src/user-web-browser';
import { WebBrowserConsumer } from 'ChristFellowship/src/ui/WebBrowser';
import TouchableCell from './TouchableCell';

>>>>>>> theirs
export default class TestingControlPanel extends PureComponent {
  static navigationOptions = () => ({
    title: 'Testing Control Panel',
  });

  render() {
    return (
      <TableView>
<<<<<<< ours
        <ChangeLivestream />
        <Divider />
=======
>>>>>>> theirs
        <UserWebBrowserConsumer>
          {(openUserWebView) => (
            <TouchableCell
              handlePress={() =>
                openUserWebView({
                  url:
                    'https://www.whatismybrowser.com/detect/what-http-headers-is-my-browser-sending',
                })
              }
              iconName="share"
              cellText={`Open Web Browser With User Cookie`}
            />
          )}
        </UserWebBrowserConsumer>
<<<<<<< ours
=======
        <WebBrowserConsumer>
          {(openUrl) => (
            <TouchableCell
              handlePress={() =>
                openUrl(
                  'https://apollosrock.newspring.cc',
                  {},
                  { useRockToken: true }
                )
              }
              iconName="share"
              cellText={`Open InAppBrowser With Rock Token`}
            />
          )}
        </WebBrowserConsumer>
>>>>>>> theirs
        <TouchableCell
          handlePress={() => this.props.navigation.navigate('Onboarding')}
          iconName="Avatar"
          cellText={`Launch Onboarding`}
        />
<<<<<<< ours
        <PushNotifications />
=======
>>>>>>> theirs
      </TableView>
    );
  }
}
