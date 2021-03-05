/**
 * UserFlags.js
 *
 * Author: Caleb Panza
 * Created: Mar 04, 2021
 *
 * User Flags are essentially "feature flags" for specific features in the app.
 *
 */

import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

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
  const { data } = useQuery(GET_USER_FLAGS, {
    fetchPolicy: 'network-only',
  });

  const keys = data?.currentUserFlags;
  const value = Array.isArray(keys) ? keys : [];

  return (
    <UserFlagsContext.Provider value={value}>
      {children}
    </UserFlagsContext.Provider>
  );
};
