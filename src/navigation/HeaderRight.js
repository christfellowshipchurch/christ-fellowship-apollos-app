import React from 'react';
import { View } from 'react-native';

import {
  TouchableScale,
  Icon,
  withTheme,
  styled,
  NavigationService,
} from '@apollosproject/ui-kit';

import { useFeatureFlag } from 'hooks';
import { useSideMenu } from '../sidemenu';

const IconsContainer = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
}))(View);

const ItemRight = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
  paddingLeft: theme.sizing.baseUnit * 0.5,
}))(View);

const ItemLeft = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
  paddingRight: theme.sizing.baseUnit * 0.5,
}))(View);

const StyledIcon = withTheme(({ theme }) => ({
  size: 24,
  color: theme.colors.text.primary,
  style: {
    opacity: 0.5,
  },
}))(Icon);

const NotificationCenterIconConnected = () => {
  const { enabled } = useFeatureFlag({
    key: 'NOTIFICATION_CENTER',
  });

  return enabled ? (
    <TouchableScale
      onPress={() => NavigationService.navigate('NotificationCenter')}
    >
      <ItemLeft>
        <StyledIcon name="bell" />
      </ItemLeft>
    </TouchableScale>
  ) : null;
};

const HeaderRight = () => {
  const { openSideMenu } = useSideMenu();

  return (
    <IconsContainer>
      <NotificationCenterIconConnected />
      <TouchableScale onPress={openSideMenu}>
        <ItemRight>
          <StyledIcon name="bars-alt" />
        </ItemRight>
      </TouchableScale>
    </IconsContainer>
  );
};

export default HeaderRight;
