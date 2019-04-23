import gql from 'graphql-tag';

export default gql`
  query getScripture($itemId: ID!) {
    node(id: $itemId) {
      __typename
      id
      ... on DevotionalContentItem {
        scriptures {
          id
          html
          reference
        }
      }
    }
  }
`;
