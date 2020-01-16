import gql from 'graphql-tag';

export const COVER_IMAGE_FRAGMENT = gql`
  fragment coverImageFragment on ContentItem {
    coverImage {
      sources {
        uri
      }
    }
  }
`;

export const THEME_FRAGMENT = gql`
  fragment themeFragment on ContentItem {
    theme {
      type
      colors {
        primary
        secondary
        screen
        paper
      }
    }
  }
`;

export const CONTENT_CARD_METRICS_FRAGMENT = gql`
  fragment contentCardMetricsFragment on ContentItem {
    isLiked
    likedCount
  }
`;

export const ACCESSORY_FRAGMENT = gql`
  fragment accessoryFragment on ContentItem {
    ... on ContentSeriesContentItem {
      tags
      icon
    }
    ... on UniversalContentItem {
      tags
      icon
    }
    ... on DevotionalContentItem {
      tags
      icon
    }
    ... on MediaContentItem {
      tags
      icon
    }
    ... on EventContentItem {
      nextOccurrence
      events {
        start
      }
    }
  }
`;

export const BASE_CARD_FRAGMENT = gql`
  fragment baseCardFragment on ContentItem {
    id
    __typename
    ...contentCardMetricsFragment
    ...coverImageFragment
    ...themeFragment
    title
    hyphenatedTitle: title(hyphenated: true)
    summary
    ... on MediaContentItem {
      videos {
        sources {
          uri
        }
      }
      parentChannel {
        id
        name
      }
    }
    ... on WeekendContentItem {
      videos {
        sources {
          uri
        }
      }
      parentChannel {
        id
        name
      }
    }
    ... on DevotionalContentItem {
      parentChannel {
        id
        name
      }
    }
    ...themeFragment
    ...accessoryFragment
    title
    summary
  }
  ${CONTENT_CARD_METRICS_FRAGMENT}
  ${COVER_IMAGE_FRAGMENT}
  ${THEME_FRAGMENT}
  ${ACCESSORY_FRAGMENT}
`;

export const TILE_CARD_FRAGMENT = gql`
  fragment tileCardFragment on ContentItem {
    ... on ContentSeriesContentItem {
      id
      ...themeFragment
      ...coverImageFragment
      ...contentCardMetricsFragment
    }
    ... on UniversalContentItem {
      ...baseCardFragment
    }
    ... on DevotionalContentItem {
      ...baseCardFragment
    }
    ... on MediaContentItem {
      ...baseCardFragment
    }
  }
  ${BASE_CARD_FRAGMENT}
  ${THEME_FRAGMENT}
  ${COVER_IMAGE_FRAGMENT}
  ${CONTENT_CARD_METRICS_FRAGMENT}
`;

const GET_CONTENT_CARD = gql`
  query getContentCard($contentId: ID!) {
    node(id: $contentId) {
      id
      __typename
      ...baseCardFragment
    }
  }
  ${BASE_CARD_FRAGMENT}
`;

export default GET_CONTENT_CARD;
