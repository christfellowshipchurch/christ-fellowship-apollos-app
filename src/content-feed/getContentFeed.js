import gql from 'graphql-tag'

import { LARGE_CARD_FRAGMENT } from 'ChristFellowship/src/ui/ContentCardConnected'
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
              ...largeCardFragment
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
              ...largeCardFragment
            }
          }
        }
      }
    }
  }
  ${CONTENT_ITEM_FRAGMENT}
  ${LARGE_CARD_FRAGMENT}
`
