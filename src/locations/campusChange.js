import gql from 'graphql-tag';
import CampusFragment from './campusFragment';

export default gql`
  mutation campusChange($campusId: String!) {
    updateUserCampus(campusId: $campusId) {
      id
      campus {
        ...CampusParts
      }
    }
  }
  ${CampusFragment}
`;
