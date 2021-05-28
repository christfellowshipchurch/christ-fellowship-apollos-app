import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

const { FRAGMENTS } = ApollosConfig;
const {
  VIDEO_NODE_FRAGMENT,
  SCRIPTURE_FRAGMENT,
  RELATED_NODE_FRAGMENT,
} = FRAGMENTS;

export const PUBLICATION_FRAGMENT = gql`
  fragment PublicationNodeFragment on PublicationNode {
    author {
      firstName
      lastName

      photo {
        uri
      }
    }

    publishDate
  }
`;

export const ACTIONS_FRAGMENT = gql`
  fragment ActionsFragment on FeatureAction {
    action
    title
    relatedNode {
      ...RelatedFeatureNodeFragment
    }
  }

  ${RELATED_NODE_FRAGMENT}
`;

export const EVENT_GROUPINGS_FRAGMENT = gql`
  fragment EventGroupingsFragment on EventContentItem {
    eventGroupings {
      name
      instances {
        id
        start
      }
    }
  }
`;

export const CONTENT_FRAGMENT = gql`
  fragment ContentFragment on ContentItem {
    title
    summary
    coverImage {
      sources {
        uri
      }
    }
    htmlContent
  }
`;

export default gql`
  query getContentItem($itemId: ID!) {
    node(id: $itemId) {
      __typename
      id
      ...ContentFragment
      ...PublicationNodeFragment
      ...EventGroupingsFragment

      ... on ScriptureNode {
        scriptures {
          ...ScriptureFragment
        }
      }

      ...VideoNodeFragment

      ... on FeaturesNode {
        featureFeed {
          id
        }
      }
    }
  }

  ${CONTENT_FRAGMENT}
  ${EVENT_GROUPINGS_FRAGMENT}
  ${PUBLICATION_FRAGMENT}
  ${SCRIPTURE_FRAGMENT}
  ${VIDEO_NODE_FRAGMENT}
`;
