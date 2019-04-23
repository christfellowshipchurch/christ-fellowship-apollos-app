import React, { memo } from 'react';
import { Query, ApolloConsumer } from 'react-apollo';
import PropTypes from 'prop-types';

import {
  requestPushPermissions,
  getNotificationsEnabled,
} from 'ChristFellowship/src/notifications';

import AskNotifications from '.';

// eslint-disable-next-line react/display-name
const AskNotificationsConnected = memo(
  ({ onPressPrimary, onPressSecondary, ...props }) => (
    <ApolloConsumer>
      {(client) => (
        <Query query={getNotificationsEnabled}>
          {({ data: { notificationsEnabled = false } = {} }) => (
            <AskNotifications
              onPressButton={() => requestPushPermissions({ client })}
              buttonDisabled={notificationsEnabled}
              buttonText={
                notificationsEnabled
                  ? 'Notifications Enabled!'
                  : 'Yes, enable notifications'
              }
              onPressPrimary={notificationsEnabled ? onPressPrimary : null} // if notifications are enabled show the primary nav button (next/finish)
              onPressSecondary={
                // if notifications are not enabled show the secondary nav button (skip)
                notificationsEnabled ? null : onPressSecondary || onPressPrimary // if onPressSecondary exists use it else default onPressPrimary
              }
              {...props}
            />
          )}
        </Query>
      )}
    </ApolloConsumer>
  )
);

AskNotificationsConnected.propTypes = {
  onPressPrimary: PropTypes.func,
  onPressSecondary: PropTypes.func,
};

export default AskNotificationsConnected;
