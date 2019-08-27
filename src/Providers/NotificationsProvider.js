import { Component } from 'react'
import { Linking, Platform } from 'react-native'
import PropTypes from 'prop-types'
import { withApollo } from 'react-apollo'
import { get } from 'lodash'
import { GET_LOGIN_STATE } from '@apollosproject/ui-auth'

const defaults = {
  pushId: null,
  notificationsEnabled: Platform.OS === 'android',
}

const resolvers = {
  Query: {
    notificationsEnabled: async () => new Promise((resolve) =>
      PushNotification.checkPermissions(({ alert, badge, sound }) =>
        resolve(!!(alert || badge || sound))
      ))
  },
  Mutation: {
    updateDevicePushId: async (root, { pushId }, { cache, client }) => {
      const query = gql`
        query {
          pushId @client
        }
      `
      cache.writeQuery({
        query,
        data: {
          pushId,
        },
      })

      const { data: { isLoggedIn } = {} } = await client.query({
        query: GET_LOGIN_STATE,
      })

      if (isLoggedIn) {
        updatePushId({ pushId, client })
      }
      return null
    },
    updatePushPermissions: (root, { enabled }, { cache }) => {
      cache.writeQuery({
        query: GET_NOTIFICATIONS_ENABLED,
        data: {
          notificationsEnabled: enabled,
        },
      })

      return null
    },
  },
}

class NotificationsProvider extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    navigate: PropTypes.func.isRequired,
    client: PropTypes.shape({
      mutate: PropTypes.func,
      addResolvers: PropTypes.func,
      writeData: PropTypes.func,
      onResetStore: PropTypes.func,
    }).isRequired,
  }

  static navigationOptions = {}

  constructor(props) {
    super(props)
    const { client } = props
    client.addResolvers(resolvers)
    client.writeData({ data: defaults })
    client.onResetStore(() => client.writeData({ data: defaults }))
  }

  componentDidMount() {
    // calls registration of push notifications (see NotificationsProvider for handler)
    // PushNotification.configure()

    Linking.getInitialURL().then((url) => {
      this.navigate(url)
    })
    Linking.addEventListener('url', ({ url }) => this.navigate(url))
  }

  componentWillUnmount() {
    Linking.removeEventListener('url')
  }

  // TODO : navigate through the app based on data sent in the push notification
  // navigate = (rawUrl) => {
  //   if (!rawUrl) return
  //   const url = URL.parse(rawUrl)
  //   const route = url.pathname.substring(1)
  //   const args = querystring.parse(url.query)
  //   this.props.navigate(route, args)
  // }

  navigate = () => true

  onOpened = (openResult) => {
    console.log('Message: ', openResult.notification.payload.body)
    console.log('Data: ', openResult.notification.payload.additionalData)
    console.log('isActive: ', openResult.notification.isAppInFocus)
    console.log('openResult: ', openResult)
    // URL looks like this
    // apolloschurchapp://AppStackNavigator/Connect
    // apolloschurchapp://SomethingElse/Connect
    // apolloschurchapp://SomethingElse/ContentSingle?itemId=SomeItemId:blablalba
    const url = get(openResult, 'notification.payload.additionalData.url')
    if (url) {
      this.navigate(url)
    }
  }

  render() {
    return this.props.children
  }
}

export default withApollo(NotificationsProvider)
