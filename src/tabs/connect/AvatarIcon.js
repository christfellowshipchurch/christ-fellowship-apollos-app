import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';

import { styled, Avatar } from '@apollosproject/ui-kit';

import { CURRENT_USER } from './queries';

const Container = styled(() => ({
  paddingBottom: 5,
}))(View);

const StyledAvatar = styled(({ focused, theme }) => ({
  borderColor: theme.colors.primary,
  borderWidth: focused ? 2 : 0,
}))(Avatar);

const AvatarConnected = ({ focused }) => {
  const { data, loading, error } = useQuery(CURRENT_USER);
  const photo = get(data, 'currentUser.profile.photo', { uri: '' });

  return (
    <Container>
      <StyledAvatar
        themeSize="sm"
        source={photo}
        isLoading={loading || error}
        focused={focused}
      />
    </Container>
  );
};

AvatarConnected.propTypes = {
  focused: PropTypes.bool,
};

AvatarConnected.defaultProps = {
  focused: false,
};

export default AvatarConnected;
