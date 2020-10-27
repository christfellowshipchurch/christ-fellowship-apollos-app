import gql from 'graphql-tag';

export default gql`
  query getGroup($groupId: ID!) {
    node(id: $groupId) {
      id
      ... on CheckInableNode {
        checkin {
          title
          message
          options {
            startDateTime
            isCheckedIn
          }
        }
      }
    }
  }
`;
