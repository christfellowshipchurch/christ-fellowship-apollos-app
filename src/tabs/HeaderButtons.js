import React, { useState, useEffect } from 'react';
import {
  useNavigation,
  DrawerActions,
  useIsFocused,
} from '@react-navigation/native';

import { View } from 'react-native';
import {
  TouchableScale,
  Icon,
  withTheme,
  styled,
  UIText,
} from '@apollosproject/ui-kit';

import { isOwnUser } from 'stream-chat';
import { useStreamChat } from '../stream-chat';
import { useAppBadge } from '../context/AppBadgeProvider';

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

const RelativePosition = styled(({ theme }) => ({
  position: 'relative',
}))(View);

const UnreadCountSpacing = styled(({ theme }) => ({
  position: 'absolute',
  top: -3,
  right: -5,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 16,
  minWidth: 16,
  padding: 2,
  backgroundColor: theme.colors.alert,
  borderRadius: 99,
}))(View);

const UnreadCountText = styled(({ theme }) => ({
  color: theme.colors.white,
  fontSize: 10,
  lineHeight: 0,
}))(UIText);

const StyledIcon = withTheme(({ theme }) => ({
  size: 24,
  fill: theme.colors.text.tertiary,
}))(Icon);

const NotificationIcon = withTheme(({ theme, unreadCount }) => ({
  size: 24,
  name: 'bell',
  fill:
    Number.isInteger(unreadCount) && unreadCount > 0
      ? theme.colors.alert
      : theme.colors.text.tertiary,
}))(Icon);

export const NotificationCenterIconConnected = () => {
  const navigation = useNavigation();
  const { badge } = useAppBadge();
  const maxUnreadCount = 9;

  return (
    <TouchableScale onPress={() => navigation.navigate('ChatChannelList')}>
      <ItemLeft>
        <RelativePosition>
          <NotificationIcon unreadCount={badge} />
          {badge > 0 && (
            <UnreadCountSpacing>
              <UnreadCountText bold>
                {badge > maxUnreadCount ? `${maxUnreadCount}+` : badge}
              </UnreadCountText>
            </UnreadCountSpacing>
          )}
        </RelativePosition>
      </ItemLeft>
    </TouchableScale>
  );
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
