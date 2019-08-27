import { Platform, Alert } from 'react-native'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'

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

const updateDeviceId = async ({ pushId, enabled }) => {
  const [updateDevicePushId] = useMutation(UPDATE_DEVICE_PUSH_ID, {
    // doesn't update the data cache from the return value of the mutation
    // since this is a Provider, we don't want to continually update state
    // this results in an infinite loop of the mutation being called
    ignoreResults: true,
  })
  const bindingType = get(BINDING_TYPE, Platform.OS, "")
  const variables = { enabled, bindingType, address: pushId }

  Alert.alert(
    'Alert Title',
    `${JSON.stringify(variables)}`,
    [
      { text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ],
    { cancelable: false },
  )


  await updateDevicePushId({ variables })
};

export default updateDeviceId