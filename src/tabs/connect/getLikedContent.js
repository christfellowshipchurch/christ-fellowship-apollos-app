import gql from 'graphql-tag';

import { BASE_CARD_FRAGMENT } from '../../ui/ContentCardConnected';

export default gql`
  query getAllLikedContent($first: Int, $after: String) {
    likedContent(first: $first, after: $after) {
      pageInfo {
        endCursor
      }
      edges {
        node {
          ... on ContentItem {
            isLiked
            ...baseCardFragment
          }
        }
      }
    }
  }
  ${BASE_CARD_FRAGMENT}
`;
