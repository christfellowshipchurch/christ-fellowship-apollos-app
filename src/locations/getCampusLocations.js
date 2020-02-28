import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getAllCampuses($latitude: Float!, $longitude: Float!) {
    campuses(location: { latitude: $latitude, longitude: $longitude }) {
      ...CampusParts
      distanceFromLocation
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
  ${ApollosConfig.FRAGMENTS.CAMPUS_PARTS_FRAGMENT}
`;
