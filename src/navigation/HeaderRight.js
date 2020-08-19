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

const Spacer = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
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
      <StyledIcon name="umbrella" />
    </TouchableScale>
  ) : null;
};

const HeaderRight = () => {
  const { openSideMenu } = useSideMenu();

  return (
    <IconsContainer>
      <NotificationCenterIconConnected />
      <TouchableScale onPress={openSideMenu}>
        <Spacer>
          <StyledIcon name="bars-alt" />
        </Spacer>
      </TouchableScale>
    </IconsContainer>
  );
};

export default HeaderRight;
