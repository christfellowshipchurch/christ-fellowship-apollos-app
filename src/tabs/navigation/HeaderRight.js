import React from 'react';

import { TouchableScale, Icon, withTheme } from '@apollosproject/ui-kit';

import { useSideMenu } from '../../sidemenu';

const Bars = withTheme(({ theme }) => ({
  name: 'bars-alt',
  size: 24,
  color: theme.colors.text.primary,
  style: {
    margin: theme.sizing.baseUnit,
    opacity: 0.5,
  },
}))(Icon);

const AvatarConnected = () => {
  const { openSideMenu } = useSideMenu();

  return (
    <TouchableScale onPress={openSideMenu}>
      <Bars />
    </TouchableScale>
  );
};

export default AvatarConnected;
