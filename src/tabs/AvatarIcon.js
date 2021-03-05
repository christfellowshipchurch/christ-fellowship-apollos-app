import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { get } from 'lodash';

import { View } from 'react-native';
import { styled, Avatar } from '@apollosproject/ui-kit';

const GET_USER_PHOTO = gql`
  query CurrentUserPhoto {
    currentUser {
      id
      profile {
        id
        photo {
          uri
        }
      }
    }
  }
`;

const Container = styled(() => ({
  paddingBottom: 5,
}))(View);

const StyledAvatar = styled(({ focused, theme }) => ({
  borderColor: theme.colors.primary,
  borderWidth: focused ? 2 : 0,
}))(Avatar);

const AvatarConnected = ({ focused }) => {
  const { data, loading, error } = useQuery(GET_USER_PHOTO, {
    fetchPolicy: 'cache-and-network',
  });
  const photo = get(data, 'currentUser.profile.photo', { uri: '' });

  return (
    <Container>
      <StyledAvatar
        themeSize={22}
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
