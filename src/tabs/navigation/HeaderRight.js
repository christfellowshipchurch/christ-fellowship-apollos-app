import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';

import { styled, TouchableScale, Avatar } from '@apollosproject/ui-kit';

import NavigationService from '../../NavigationService';
import { getCurrentUser } from './queries';

const AvatarTouchable = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
}))(TouchableScale);

const AvatarConnected = () => {
  const { data, loading, error } = useQuery(getCurrentUser);
  const photo = get(data, 'currentUser.profile.photo', { uri: '' });

  return (
    <AvatarTouchable onPress={() => NavigationService.navigate('Connect')}>
      <Avatar themeSize="sm" source={photo} isLoading={loading} />
    </AvatarTouchable>
  );
};

export default AvatarConnected;
