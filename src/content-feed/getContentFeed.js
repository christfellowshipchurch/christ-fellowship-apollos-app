import gql from 'graphql-tag'

import { ACCESSORY_FRAGMENT, BASE_CARD_FRAGMENT } from 'ChristFellowship/src/ui/ContentCardConnected'
import { CONTENT_ITEM_FRAGMENT } from '../content-single/getContentItem'

export default gql`
  query getContentFeed($itemId: ID!, $after: String, $first: Int) {
    node(id: $itemId) {
      ... on ContentChannel {
        childContentItemsConnection(after: $after, first: $first) {
          pageInfo {
            endCursor
          }
          edges {
            node {
              ...contentItemFragment
              ...baseCardFragment
              ...accessoryFragment
            }
          }
        }
      }

      ... on ContentItem {
        id
        childContentItemsConnection(after: $after, first: $first) {
          pageInfo {
            endCursor
          }
          edges {
            node {
              ...contentItemFragment
              ...accessoryFragment
              ...baseCardFragment
            }
          }
        }
      }
    }
  }
  ${CONTENT_ITEM_FRAGMENT}
  ${ACCESSORY_FRAGMENT}
  ${BASE_CARD_FRAGMENT}
`;
