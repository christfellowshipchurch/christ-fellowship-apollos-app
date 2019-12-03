import gql from 'graphql-tag';

import { BASE_CARD_FRAGMENT } from 'ChristFellowship/src/ui/ContentCardConnected';

export default gql`
  query getUserFeed($first: Int, $after: String) {
    userFeed(first: $first, after: $after) {
      pageInfo {
        endCursor
      }
      edges {
        node {
          ...baseCardFragment
        }
      }
    }
  }
  ${BASE_CARD_FRAGMENT}
`;
