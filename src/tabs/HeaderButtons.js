import React from 'react';
import { useNavigation, DrawerActions } from '@react-navigation/native';

import { View } from 'react-native';
import {
  TouchableScale,
  Icon,
  withTheme,
  styled,
} from '@apollosproject/ui-kit';

import { useUserFlag } from 'hooks';
import { useStreamChat } from '../stream-chat';

const IconsContainer = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
}))(View);

const ItemRight = styled(({ theme }) => ({
  paddingLeft: theme.sizing.baseUnit * 0.5,
}))(View);

const ItemLeft = styled(({ theme }) => ({
  paddingRight: theme.sizing.baseUnit * 0.5,
}))(View);

const StyledIcon = withTheme(({ theme }) => ({
  size: 24,
  fill: theme.colors.text.tertiary,
}))(Icon);

const NotificationIcon = withTheme(({ theme, unreadCount }) => ({
  size: 24,
  name:
    Number.isInteger(unreadCount) && unreadCount > 0
      ? 'notification-alert'
      : 'bell',
  fill:
    Number.isInteger(unreadCount) && unreadCount > 0
      ? theme.colors.alert
      : theme.colors.text.tertiary,
}))(Icon);

export const NotificationCenterIconConnected = () => {
  const navigation = useNavigation();
  const enabled = useUserFlag('NOTIFICATION_CENTER');
  const { unreadCount } = useStreamChat();

  return enabled || true ? (
    <TouchableScale onPress={() => navigation.navigate('ChatChannelList')}>
      <ItemLeft>
        <NotificationIcon unreadCount={unreadCount} />
      </ItemLeft>
    </TouchableScale>
  ) : null;
};

export const DrawerButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableScale
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    >
      <ItemRight>
        <StyledIcon name="bars-alt" />
      </ItemRight>
    </TouchableScale>
  );
};

const HeaderButtons = () => (
  <IconsContainer>
    <NotificationCenterIconConnected />
    <DrawerButton />
  </IconsContainer>
);

export default HeaderButtons;
