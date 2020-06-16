import React from 'react';
import { View } from 'react-native';

import {
  TouchableScale,
  Icon,
  withTheme,
  styled,
} from '@apollosproject/ui-kit';

import { useSideMenu } from '../sidemenu';

const Spacer = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
}))(View);

const Bars = withTheme(({ theme }) => ({
  name: 'bars-alt',
  size: 24,
  color: theme.colors.text.primary,
  style: {
    opacity: 0.5,
  },
}))(Icon);

const AvatarConnected = () => {
  const { openSideMenu } = useSideMenu();

  return (
    <TouchableScale onPress={openSideMenu}>
      <Spacer>
        <Bars />
      </Spacer>
    </TouchableScale>
  );
};

export default AvatarConnected;
