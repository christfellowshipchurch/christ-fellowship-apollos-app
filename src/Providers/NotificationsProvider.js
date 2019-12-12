import gql from 'graphql-tag'
import { Platform } from 'react-native'
import { useMutation } from 'react-apollo'
import { get } from 'lodash'
import PushNotification from 'react-native-push-notification'

const UPDATE_DEVICE_PUSH_ID = gql`
  mutation updateDevicePushId($enabled:Boolean, $bindingType:String, $address:String) {
    updateUserPushSettingsTN(input:{ enabled: $enabled, bindingType: $bindingType, address: $address}) {
      firstName
      lastName
    }
  }
`

const BINDING_TYPE = {
  ios: "apn",
  android: "gcn"
}

const PushNotificationProvider = ({ children }) => {
  const [updateDevicePushId] = useMutation(UPDATE_DEVICE_PUSH_ID, {
    // This keeps the data cache from updating to the return value of the mutation
    //
    // Since this is a Provider, we don't want to continually update state
    //    as this results in an infinite loop of the mutation being called
    ignoreResults: true,
  })

  PushNotification.configure({
    // Called when Token is generated (iOS and Android)
    onRegister: (address) => {
      const token = get(address, 'token', '')
      const bindingType = get(BINDING_TYPE, Platform.OS, "")
      const variables = { enabled: true, bindingType, address: token }

      // Updates the Device Id with the address of the device on register
      updateDevicePushId({ variables })
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: (notification) => {
      // TODO : process the notification

      // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
      notification.finish(PushNotificationIOS.FetchResult.NoData)
    },

    // ANDROID ONLY: GCM or FCM Sender ID (product_number)
    // senderID: 'YOUR GCM (OR FCM) SENDER ID',

    // IOS ONLY: Permissions to register
    permissions: {
      alert: true,
      badge: true,
      sound: true
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    // does not request permissions automatically
    requestPermissions: false
  })

  return children
}

export default PushNotificationProvider
