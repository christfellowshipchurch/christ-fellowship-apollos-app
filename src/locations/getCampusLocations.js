import gql from 'graphql-tag';
import CampusFragment from './campusFragment';

export default gql`
  query getAllCampuses($latitude: Float!, $longitude: Float!) {
    campuses(location: { latitude: $latitude, longitude: $longitude }) {
      ...CampusParts
    }
    currentUser {
      id
      profile {
        id
        campus {
          ...CampusParts
        }
      }
    }
  }
  ${CampusFragment}
`;
