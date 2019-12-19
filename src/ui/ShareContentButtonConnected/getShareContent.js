import gql from 'graphql-tag';

export default gql`
  query getShareContent($itemId: ID!) {
    node(id: $itemId) {
      ... on ContentItem {
        id
        sharing {
          url
          message
          title
        }
      }
    }
  }
`;
