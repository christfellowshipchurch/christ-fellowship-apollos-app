import gql from 'graphql-tag';

import { largeCardFragment } from 'ChristFellowship/src/ui/ContentCardConnected';
import { contentItemFragment } from 'ChristFellowship/src/content-single/getContentItem';

export default gql`
  query getAllLikedContent($first: Int) {
    likedContent(first: $first) {
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
  ${contentItemFragment}
  ${largeCardFragment}
`;
