/**
 * UserFlags.js
 *
 * Author: Caleb Panza
 * Created: Mar 04, 2021
 *
 * User Flags are essentially "feature flags" for specific features in the app.
 *
 */

import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

import { AppState } from 'react-native';
import { useCurrentUser } from 'hooks';

const GET_USER_FLAGS = gql`
  query currentUserFlags {
    currentUserFlags
  }
`;

const UserFlagsContext = React.createContext([]);

// Context Hook
export const useUserFlags = () => useContext(UserFlagsContext);

// Individual Flag Hook
export const useUserFlag = (key) => {
  const flags = useUserFlags();

  return !!key && key !== '' && flags.includes(key);
};

// Provider
export const UserFlagsProvider = ({ children }) => {
  return children;

  const { id } = useCurrentUser();
  const { data, refetch, loading } = useQuery(GET_USER_FLAGS, {
    fetchPolicy: 'network-only',
  });

  const keys = data?.currentUserFlags;
  const value = Array.isArray(keys) ? keys : [];

  /**
   * note : along with pull-to-refresh, we will also listen to App State changes and run `refetch` when our app comes back into 'active' state
   */
  const _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active' && !loading) {
      if (id) refetch();
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  useEffect(
    () => {
      if (id) refetch();
    },
    [id]
  );

  return (
    <UserFlagsContext.Provider value={value}>
      {children}
    </UserFlagsContext.Provider>
  );
};

UserFlagsProvider.propTypes = {
  children: PropTypes.node,
};
