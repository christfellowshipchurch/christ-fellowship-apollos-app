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
  }

  ${CampusParts}
`

export const GET_STATES = gql`
  query getStates {
    getStatesList {
      id
      values {
        id
        value
      }
    }
  }
`

export const GET_USER_PHOTO = gql`
  query CurrentUserPhoto {
    currentUser {
      id
      profile {
        id
        photo {
          uri
        }
      }
    }
  }
`;
