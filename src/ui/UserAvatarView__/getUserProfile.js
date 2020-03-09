import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getCurrentUserProfile {
    currentUser {
      id
      profile {
        id
        firstName
        lastName
        nickName
        gender
        birthDate
        ethnicity

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

        salvationDate
        baptismDate

        communicationPreferences {
          allowSMS
          allowEmail
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.CAMPUS_PARTS_FRAGMENT}
`;
