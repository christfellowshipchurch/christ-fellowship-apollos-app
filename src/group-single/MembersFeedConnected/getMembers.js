import gql from 'graphql-tag';

export default gql`
  query getMembers(
    $groupId: ID!
    $first: Int
    $after: String
    $isLeader: Boolean
  ) {
    node(id: $groupId) {
      __typename
      id
      ... on GroupItem {
        people(first: $first, after: $after, isLeader: $isLeader) {
          pageInfo {
            endCursor
          }
          edges {
            node {
              id
              firstName
              nickName
              photo {
                uri
              }
            }
          }
        }
      }
    }
  }
`;
