import gql from 'graphql-tag';

import { contentItemFragment } from 'ChristFellowship/src/content-single/getContentItem';
import { tileCardFragment } from 'ChristFellowship/src/ui/ContentCardConnected';

export default gql`
  query getContentChannels {
    contentChannels {
      id
      name
      childContentItemsConnection(first: 3) {
        edges {
          node {
            id
            ...contentItemFragment
            ...tileCardFragment
          }
        }
      }
    }
  }
  ${contentItemFragment}
  ${tileCardFragment}
`;
