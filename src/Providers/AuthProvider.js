import React from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import { track } from '@apollosproject/ui-analytics';
import PushNotification from 'react-native-push-notification'

import { GET_LOGIN_STATE } from '@apollosproject/ui-auth';

const defaultContext = {
  navigateToAuth: () => { },
  closeAuth: () => { },
};

const AuthContext = React.createContext(defaultContext);

export const GET_AUTH_TOKEN = gql`
  query authToken {
    authToken @client
  }
`;

export const resolvers = {
  Query: {
    authToken: () => AsyncStorage.getItem('authToken'),
    isLoggedIn: (_root, _args, { cache }) => {
      // When logging out, this query returns an error.
      // Rescue the error, and return false.
      try {
        const { authToken } = cache.readQuery({ query: GET_AUTH_TOKEN });
        return !!authToken;
      } catch (e) {
        return false;
      }
    },
  },
  Mutation: {
    // handles all evvents that should fire after a user logs out
    logout: (_root, _args, { client }) => {
      // resets client
      client.resetStore();

      // tracks the event of the user logging out
      track({ eventName: 'UserLogout', client });

      return null;
    },

    // handles all events that should fire after a user logs in
    handleLogin: async (root, { authToken }, { cache, client }) => {
      console.log("Handling Login")
      try {
        // stores local cache of authToken
        await AsyncStorage.setItem('authToken', authToken);

        // writes auth token to cache
        await cache.writeQuery({
          query: GET_AUTH_TOKEN,
          data: { authToken },
        });

        await cache.writeQuery({
          query: GET_LOGIN_STATE,
          data: { isLoggedIn: true },
        });

        await cache.writeData({
          data: { authToken },
        });

        // calls registration of push notifications (see NotificationsProvider for handler)

        // if PN are enabled, request permissions
        // if PN are not enabled, do not request permissions and just update the User Profile to have PN set to Disabled
        // PushNotification.requestPermissions()

        // tracks the event of a user logging in
        track({ eventName: 'UserLogin', client });
      } catch (e) {
        throw e.message;
      }

      return null;
    },
  },
};

const Provider = ({ children, ...authContext }) => (
  <AuthContext.Provider value={{ ...defaultContext, ...authContext }}>
    <ApolloConsumer>
      {(client) => {
        client.addResolvers(resolvers);
        return children;
      }}
    </ApolloConsumer>
  </AuthContext.Provider>
);

Provider.propTypes = {
  children: PropTypes.node,
  navigateToAuth: PropTypes.func,
  closeAuth: PropTypes.func,
};

Provider.defaultProps = {};

export const AuthConsumer = AuthContext.Consumer;

export default Provider;
