import gql from 'graphql-tag'
import CampusParts from 'ChristFellowship/src/locations/campusFragment'

export const UPDATE_CURRENT_USER = gql`
mutation updateBaptism($input: [UpdateProfileInput]!) {
  updateProfileFields(
    input: $input
  ) {
    id
    firstName
    lastName
    gender
    birthDate
    
    campus {
      ...CampusParts
    }
    
    address {
      street1
      street2
      city
      state
      postalCode
    }
  }

  ${CampusParts}
}
`
