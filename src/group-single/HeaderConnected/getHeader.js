import gql from 'graphql-tag';

export default gql`
  query getHeader($groupId: ID!) {
    node(id: $groupId) {
      __typename
      id
      ... on GroupItem {
        title
        groupType
        leaders: people(isLeader: true) {
          edges {
            node {
              id
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
