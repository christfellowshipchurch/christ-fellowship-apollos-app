import React from 'react'
import { Alert } from 'react-native'
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-community/async-storage'
import { ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'
import { track } from '@apollosproject/ui-analytics'
import { GET_PUSH_ID } from '@apollosproject/ui-notifications'
import PushNotification from 'react-native-push-notification'

const getLoginState = gql`
  query {
    isLoggedIn @client
  }
`

const defaultContext = {
  navigateToAuth: () => { },
  closeAuth: () => { },
}

const AuthContext = React.createContext(defaultContext)

export const GET_AUTH_TOKEN = gql`
  query authToken {
    authToken @client
  }
`

export const resolvers = {
  Query: {
    authToken: () => AsyncStorage.getItem('authToken'),
    isLoggedIn: (_root, _args, { cache }) => {
      // When logging out, this query returns an error.
      // Rescue the error, and return false.
      try {
        const { authToken } = cache.readQuery({ query: GET_AUTH_TOKEN })
        return !!authToken
      } catch (e) {
        return false
      }
    },
  },
  Mutation: {
    logout: (_root, _args, { client }) => {
      client.resetStore()
      track({ eventName: 'UserLogout', client })
      return null
    },

    handleLogin: async (root, { authToken }, { cache, client }) => {
      try {
        await AsyncStorage.setItem('authToken', authToken)

        await cache.writeQuery({
          query: GET_AUTH_TOKEN,
          data: { authToken },
        })
        await cache.writeQuery({
          query: getLoginState,
          data: { isLoggedIn: true },
        })
        await cache.writeData({
          data: { authToken },
        })

        // On login, we check to see if Push Notifications are already enabled
        // If they are, we want to request permission to get the Device Id
        //    to update our records
        PushNotification.checkPermissions(({ alert, badge, sound }) => {
          if (!!(alert || badge || sound)) {
            PushNotifications.requestPermissions()
          }
        })

        track({ eventName: 'UserLogin', client })
      } catch (e) {
        throw e.message
      }

      return null
    },
  },
}

const Provider = ({ children, ...authContext }) => (
  <AuthContext.Provider value={{ ...defaultContext, ...authContext }}>
    <ApolloConsumer>
      {(client) => {
        client.addResolvers(resolvers)
        return children
      }}
    </ApolloConsumer>
  </AuthContext.Provider>
)

Provider.propTypes = {
  children: PropTypes.node,
  navigateToAuth: PropTypes.func,
  closeAuth: PropTypes.func,
}

Provider.defaultProps = {}

export const AuthConsumer = AuthContext.Consumer

export default Provider
