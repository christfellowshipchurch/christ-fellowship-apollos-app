import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';

import {
  styled,
  TouchableScale,
  Avatar,
  Icon,
  withTheme,
} from '@apollosproject/ui-kit';

import { useSideMenu } from '../../sidemenu';
import NavigationService from '../../NavigationService';
import { getCurrentUser } from './queries';

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

  // return null;

  return (
    <TouchableScale onPress={openSideMenu}>
      <Bars />
    </TouchableScale>
  );
};

export default AvatarConnected;
