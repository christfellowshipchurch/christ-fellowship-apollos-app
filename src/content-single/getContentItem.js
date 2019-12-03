import gql from 'graphql-tag';

export const CONTENT_ITEM_FRAGMENT = gql`
  fragment contentItemFragment on ContentItem {
    id
    title
    summary
    htmlContent
    coverImage {
      name
      sources {
        uri
      }
    }
    theme {
      type
      colors {
        primary
        secondary
        screen
        paper
      }
    }
    parentChannel {
      id
      name
    }
    videos {
      sources {
        uri
      }
    }
    audios {
      sources {
        uri
      }
    }
  }
`;

export const EVENT_ITEM_FRAGMENT = gql`
  fragment eventContentItemFragment on EventContentItem {
    callsToAction {
      call
      action
    }
  }
`;


export default gql`
  query getContentItem($itemId: ID!) {
    node(id: $itemId) {
      __typename
      ... on ContentItem {
        ...contentItemFragment
        ...eventContentItemFragment
      }
    }
  }
  ${CONTENT_ITEM_FRAGMENT}
  ${EVENT_ITEM_FRAGMENT}
`;
