import React from 'react';
import { useNavigation, DrawerActions } from '@react-navigation/native';

import { View } from 'react-native';
import {
  TouchableScale,
  Icon,
  withTheme,
  styled,
} from '@apollosproject/ui-kit';

import { useFeatureFlag } from 'hooks';

const IconsContainer = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: theme.sizing.baseUnit * 0.5,
}))(View);

const ItemRight = styled(({ theme }) => ({
  paddingLeft: theme.sizing.baseUnit * 0.5,
}))(View);

const ItemLeft = styled(({ theme }) => ({
  paddingRight: theme.sizing.baseUnit * 0.5,
}))(View);

const StyledIcon = withTheme(({ theme }) => ({
  size: 24,
  color: theme.colors.text.primary,
  style: {
    opacity: 0.5,
  },
}))(Icon);

export const NotificationCenterIconConnected = () => {
  const navigation = useNavigation();
  const { enabled } = useFeatureFlag({
    key: 'NOTIFICATION_CENTER',
  });

  return enabled ? (
    <TouchableScale onPress={() => navigation.navigate('NotificationCenter')}>
      <ItemLeft>
        <StyledIcon name="bell" />
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
