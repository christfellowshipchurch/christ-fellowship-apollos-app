import gql from 'graphql-tag';

import { LARGE_CARD_FRAGMENT } from 'ChristFellowship/src/ui/ContentCardConnected';
import { CONTENT_ITEM_FRAGMENT } from 'ChristFellowship/src/content-single/getContentItem';

export default gql`
  query getAllLikedContent($first: Int, $after: String) {
    likedContent(first: $first, after: $after) {
      pageInfo {
        endCursor
      }
      edges {
        node {
          ... on ContentItem {
            ...contentItemFragment
            ...largeCardFragment
          }
        }
      }
    }
  }
  ${CONTENT_ITEM_FRAGMENT}
  ${LARGE_CARD_FRAGMENT}
`;
