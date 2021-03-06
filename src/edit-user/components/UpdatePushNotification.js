import React from 'react';
import PropTypes from 'prop-types';

import {
  checkNotifications,
  openSettings,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';
import { NotificationsConsumer } from '@apollosproject/ui-notifications';
import { Switch } from 'ui/inputs';

const updateNotficationSettings = (update) => {
  checkNotifications().then((checkRes) => {
    if (checkRes.status === RESULTS.DENIED) {
      requestNotifications(['alert', 'badge', 'sound']).then(() => {
        update();
      });
    } else {
      openSettings();
    }
  });
};

const UpdatePushNotification = ({ onRequestPushPermissions }) => {
  // When updating notifications from the Settings app, it will not
  // update button text unless app is closed and reopened.
  // For now we used more generic text("Update")
  // in order to avoid confusion. We plan on updating this in the future.

  function defaultGetButtonText({ hasPushPermission, hasPrompted }) {
    if (hasPushPermission) {
      return 'Update Notifications in Settings';
    }
    if (hasPrompted) {
      return 'Update Notifications in Settings';
    }
    return 'Enable Notifications';
  }

  return (
    <NotificationsConsumer>
      {(value) => (
        <Switch
          label={defaultGetButtonText(value)}
          value={value.hasPushPermission}
          onValueChange={() => {
            onRequestPushPermissions(value.checkPermissions);
          }}
        />
      )}
    </NotificationsConsumer>
  );
};

UpdatePushNotification.propTypes = {
  onRequestPushPermissions: PropTypes.func,
};

UpdatePushNotification.defaultProps = {
  onRequestPushPermissions: updateNotficationSettings,
};

export default UpdatePushNotification;
