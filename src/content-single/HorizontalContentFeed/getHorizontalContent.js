import gql from 'graphql-tag';
import { BASE_CARD_FRAGMENT } from '../../ui/ContentCardConnected/query';

export default gql`
  query getHorizontalContent($itemId: ID!, $cursor: String) {
    node(id: $itemId) {
      ... on ContentItem {
        id
        childContentItemsConnection(after: $cursor) {
          edges {
            cursor
            node {
              ...baseCardFragment
            }
          }
        }
        siblingContentItemsConnection(after: $cursor) {
          edges {
            cursor
            node {
              ...baseCardFragment
            }
          }
        }
      }
    }
  }
  ${BASE_CARD_FRAGMENT}
`;
