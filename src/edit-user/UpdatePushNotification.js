import React from 'react';
import { Linking } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { NotificationsConsumer } from '@apollosproject/ui-notifications';
import {
  InputWrapper,
} from '../ui/inputs';

const UpdatePushNotification = () => {

  function defaultGetButtonText({ hasPushPermission, hasPrompted }) {
    if (hasPushPermission) {
      return 'Disable Notifications in Settings';
    }
    if (hasPrompted) {
      return 'Enable Notifications in Settings';
    }
    return 'Enable Notifications';
  }

  return (
    <NotificationsConsumer>
        {( value ) => ( 
          <InputWrapper
            displayValue={defaultGetButtonText({
              hasPrompted: value.hasPrompted,
              hasPushPermission: value.hasPushPermission,
            })}
            icon="bell"
            actionIcon="arrow-next"
            disabled={value.hasPushPermission}
            handleOnPress={() => value.hasPrompted
              ? Linking.openURL('app-settings:')
              : PushNotificationIOS.requestPermissions()
            }
          />
        )}
    </NotificationsConsumer>
  );
};

UpdatePushNotification.propTypes = {
  
};

UpdatePushNotification.defaultProps = {
  
};

export default UpdatePushNotification;
