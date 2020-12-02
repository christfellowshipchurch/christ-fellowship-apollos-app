import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getContentItem($itemId: ID!) {
    node(id: $itemId) {
      __typename
      ... on ContentItem {
        ...contentItemFragment
        ...eventContentItemFragment
        ...publishFragment
        ...informationalContentItemFragment
      }

      ...ThemedNodeFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_ITEM_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.EVENT_ITEM_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.PUBLISH_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.INFORMATIONAL_ITEM_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.THEMED_NODE_FRAGMENT}
`;
