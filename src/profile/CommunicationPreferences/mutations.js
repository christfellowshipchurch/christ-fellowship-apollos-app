import gql from 'graphql-tag'

export const UDPATE_PHONE_NUMBER = gql`
  mutation updatePhoneNumber($phoneNumber: String!) {
    updatePhoneNumber(
      input: [
        { field: PhoneNumber, value: $phoneNumber }
      ]
    ) {
      phoneNumber
    }
  }
`

export const UPDATE_EMAIL = gql`
  mutation updateEmail($email: String!) {
    updateProfileFields(
      input: [
        { field: Email, value: $email }
      ]
    ) {
      email
    }
  }
`

export const UPDATE_SMS_PREFERENCE = gql`
  mutation updateSMSPreference($allow:Boolean!) {
    updateCommunicationPreference(type:SMS, allow:$allow) {
      communicationPreferences {
        allowSMS
      }
    }
  }
`

export const UPDATE_EMAIL_PREFERENCE = gql`
  mutation updateEmailPreference($allow:Boolean!) {
    updateCommunicationPreference(type:Email, allow:$allow) {
      communicationPreferences {
        allowEmail
      }
    }
  }
`