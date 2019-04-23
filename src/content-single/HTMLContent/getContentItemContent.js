import gql from 'graphql-tag';

export default gql`
  query getContentItemHTML($contentId: ID!) {
    node(id: $contentId) {
      ... on ContentItem {
        id
        htmlContent
      }
    }
  }
`;
