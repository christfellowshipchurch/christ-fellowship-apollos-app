import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import GET_USER_PROFILE from '../getUserProfile';
import UserAvatarHeader from './UserAvatarHeader';

const UserAvatarHeaderConnected = ({ navigation }) => (
  <Query query={GET_USER_PROFILE} fetchPolicy="cache-and-network">
    {({
      data: {
        currentUser: {
          profile: { photo, firstName, lastName, campus } = {},
        } = {},
      } = {},
      refetch,
    }) => (
      <UserAvatarHeader
        firstName={firstName}
        lastName={lastName}
        location={get(campus, 'name')}
        photo={photo}
        refetch={refetch}
        navigation={navigation}
        disabled
      />
    )}
  </Query>
);

UserAvatarHeaderConnected.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default UserAvatarHeaderConnected;
