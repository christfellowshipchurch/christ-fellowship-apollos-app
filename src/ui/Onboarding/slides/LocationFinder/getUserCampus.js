import gql from 'graphql-tag';
import CampusParts from 'ChristFellowship/src/user-settings/Locations/campusFragment';

export default gql`
  query getCurrentCampus {
    currentUser {
      id
      profile {
        campus {
          ...CampusParts
        }
      }
    }
  }
  ${CampusParts}
`;
