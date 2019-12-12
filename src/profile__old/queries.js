import gql from 'graphql-tag'
import CampusParts from 'ChristFellowship/src/locations/campusFragment'

export const CURRENT_USER = gql`
  query getCurrentUserProfile {
    currentUser {
      id
      profile {
        id
        firstName
        lastName
        gender
        birthDate

        email
        phoneNumber
        
        campus {
          ...CampusParts
        }

        photo {
          uri
        }
        
        address {
          street1
          street2
          city
          state
          postalCode
        }

        communicationPreferences {
          allowSMS
          allowEmail
        }
      }
    }

    getStatesList {
      id
      values {
        id
        value
      }
    }
  }

  ${CampusParts}
`

export const CURRENT_USER_PROFILE = gql`
query getCurrentUserProfile {
  currentUser {
    id
    profile {
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
  }

  getStatesList {
    id
    values {
      id
      value
    }
  }
}
${CampusParts}
`
