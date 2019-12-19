import gql from 'graphql-tag'
import CampusParts from 'ChristFellowship/src/locations/campusFragment'

export const UPDATE_CURRENT_USER = gql`
mutation updateCurrentUserProfile(
  $profileFields: [UpdateProfileInput]!,
  $address: AddressInput!
  ) {

  updateProfileFields(input: $profileFields) {
    id
    firstName
    lastName
    gender
    birthDate
  }

  updateAddress(address:$address) {
    street1
    street2
    city
    state
    postalCode
  }
}
`

export const UPDATE_PROFILE_FIELDS = gql`
mutation updateCurrentUserProfile($profileFields: [UpdateProfileInput]!) {
  updateProfileFields(input: $profileFields) {
    id
    gender
    birthDate
    
    email
    phoneNumber
    
    communicationPreferences {
      allowSMS
      allowEmail
    }
  }
}
`

export const UPDATE_COMMUNCATION_PREFERENCE = gql`
mutation updateCommunciationPreference(
  $type: UPDATEABLE_COMMUNICATION_PREFERENCES!, 
  $allow: Boolean!) {
    updateCommunicationPreference(type:$type, allow:$allow) {
      communicationPreferences {
        allowEmail
        allowSMS
      }
    }
}
`
