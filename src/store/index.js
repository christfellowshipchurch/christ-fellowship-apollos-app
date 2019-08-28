import gql from 'graphql-tag'
import { Alert } from 'react-native'
import { schema as mediaPlayerSchema } from '@apollosproject/ui-media-player'
import { updatePushId } from '@apollosproject/ui-notifications'
import { CACHE_LOADED } from '../client/cache' // eslint-disable-line

import PushNotification from 'react-native-push-notification'

// TODO: this will require more organization...ie...not keeping everything in one file.
// But this is simple while our needs our small.

export const schema = `
  type Query {
    devicePushId: String
    cacheLoaded: Boolean
    notificationsEnabled: Boolean
  }

  type Mutation {
    cacheMarkLoaded
    updateDevicePushId(pushId: String!)
    updatePushPermissions(enabled: Boolean!)
  }
  ${mediaPlayerSchema}
`

export const defaults = {
  __typename: 'Query',
  cacheLoaded: false,
}

const GET_LOGGED_IN = gql`
  query {
    isLoggedIn @client
  }
`

export const resolvers = {
  Mutation: {
    cacheMarkLoaded: async (root, args, { cache, client }) => {
      cache.writeQuery({
        query: CACHE_LOADED,
        data: {
          cacheLoaded: true,
        },
      })
      const { data: { isLoggedIn } = {} } = await client.query({
        query: GET_LOGGED_IN,
      })

      // On cache load, we check to see if the user is already logged in
      //    and then check to see if Push Notifications are already enabled
      // If they are, we want to request permission to get the Device Id
      //    to update our records
      if (isLoggedIn) {
        PushNotification.checkPermissions(({ alert, badge, sound }) => {
          if (!!(alert || badge || sound)) {
            PushNotification.requestPermissions()
          }
        })
      }

      return null
    },
  },
}
