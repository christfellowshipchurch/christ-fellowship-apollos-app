import gql from 'graphql-tag';

export const contentMediaFragment = gql`
  fragment contentMediaFragment on ContentItem {
    id
    title
    parentChannel {
      id
      name
    }
    coverImage {
      sources {
        uri
      }
    }
    videos {
      sources {
        uri
      }
    }
  }
`;

export default gql`
  query getContentMedia($contentId: ID!) {
    node(id: $contentId) {
      ... on ContentItem {
        ...contentMediaFragment
      }
    }
  }
  ${contentMediaFragment}
`;
