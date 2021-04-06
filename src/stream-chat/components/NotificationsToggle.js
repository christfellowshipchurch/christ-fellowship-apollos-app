/**
 * NotificationsToggle.js
 *
 * Author: Caleb Panza
 * Created: Apr 02, 2021
 *
 * For a given Stream Chat Channel, toggle the user's notification preferences from enabled to disabled
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'lodash';

import { View, Alert } from 'react-native';
import {
  Touchable,
  styled,
  ThemeMixin,
  Icon,
  withTheme,
} from '@apollosproject/ui-kit';
import { useStreamChat } from '../context';

// :: Styles
// ===========================
const IconSpacing = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit * 0.5, // hack for larger touchable space
}))(View);

const StyledIcon = withTheme(({ theme }) => ({
  fill: theme.colors.text.primary,
}))(Icon);

// :: Components
// ===========================

const NotificationsToggle = () => {
  const { channel, userId } = useStreamChat();
  const muteNotifications = Array.isArray(channel?.data?.muteNotifications)
    ? channel?.data?.muteNotifications
    : [];
  const [muted, setMuted] = useState(muteNotifications.includes(userId));
  const iconName = muted ? 'notification-slash' : 'notification';

  const updateChannel = async () => {
    await channel.updatePartial({
      set: {
        muteNotifications: muted
          ? uniq([...muteNotifications, userId])
          : uniq(muteNotifications.filter((id) => id !== userId)),
      },
    });

    setMuted(!muted);
  };
  const onPress = () => {
    const alertMsg = `Would you like to ${
      muted ? 'enable' : 'disable'
    } notifications for this chat?`;
    Alert.alert('Notification Preference', alertMsg, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Yes', onPress: updateChannel },
    ]);
  };

  return (
    <ThemeMixin>
      <Touchable onPress={onPress}>
        <IconSpacing>
          <StyledIcon name={iconName} size={16} />
        </IconSpacing>
      </Touchable>
    </ThemeMixin>
  );
};

NotificationsToggle.propTypes = {};
NotificationsToggle.defaultProps = {};

export default NotificationsToggle;
