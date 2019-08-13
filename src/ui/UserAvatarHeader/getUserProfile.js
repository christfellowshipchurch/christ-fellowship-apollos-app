import gql from 'graphql-tag';
import CampusParts from 'ChristFellowship/src/user-settings/Locations/campusFragment';

export default gql`
  query getCurrentUserProfile {
    currentUser {
      id
      profile {
        id
        firstName
        lastName
        nickName
        email
        gender
        birthDate
        ethnicity
        
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
      }
    }
  }
  ${CampusParts}
`;
