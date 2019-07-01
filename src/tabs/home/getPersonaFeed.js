import gql from 'graphql-tag';

import { CONTENT_ITEM_FRAGMENT } from 'ChristFellowship/src/content-single/getContentItem';
import { LARGE_CARD_FRAGMENT } from 'ChristFellowship/src/ui/ContentCardConnected';

export default gql`
  query getPersonaFeed {
    personaFeed(first: 4) {
      edges {
        node {
          ...largeCardFragment
          ...contentItemFragment
        }
      }
    }
  }
  ${CONTENT_ITEM_FRAGMENT}
  ${LARGE_CARD_FRAGMENT}
`;
