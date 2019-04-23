import gql from 'graphql-tag';

import { contentItemFragment } from 'ChristFellowship/src/content-single/getContentItem';
import { largeCardFragment } from 'ChristFellowship/src/ui/ContentCardConnected';

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
  ${contentItemFragment}
  ${largeCardFragment}
`;
