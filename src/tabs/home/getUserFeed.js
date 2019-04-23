import gql from 'graphql-tag';

import { contentItemFragment } from 'ChristFellowship/src/content-single/getContentItem';
import { largeCardFragment } from 'ChristFellowship/src/ui/ContentCardConnected';

export default gql`
  query getUserFeed {
    userFeed {
      edges {
        node {
          ...largeCardFragment
          ...contentItemFragment
        }
      }
    }
  }
  ${contentItemFragment}
  ${largeCardFragment}
`;
