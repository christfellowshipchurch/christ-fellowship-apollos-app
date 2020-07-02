import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

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

  ${ApollosConfig.FRAGMENTS.CAMPUS_PARTS_FRAGMENT}
`;

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
`;

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

export const GET_PROFILE_ACTIONS = gql`
  query profileActions {
    profileLinks {
      name
      uri
      icon
      openInApp
      theme {
        colors {
          primary
        }
      }
    }
  }
`;
export const GET_USER_GROUPS = gql`
  query CurrentUserGroups {
    currentUser {
      id
      profile {
        id
        groups {
          id
          name
          title
          summary
          members {
            id
            firstName
          }
          leaders {
            id
            firstName
          }
        }
      }
    }
  }
`;
