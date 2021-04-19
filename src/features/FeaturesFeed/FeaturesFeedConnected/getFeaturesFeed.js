import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

const { FRAGMENTS } = ApollosConfig;
const {
  ACTION_BAR_FEATURE_FRAGMENT,
  AVATAR_LIST_FRAGMENT,
  CONTENT_BLOCK_FEATURE_FRAGMENT,
  HERO_LIST_FEATURE_FRAGMENT,
  HORIZONTAL_CARD_LIST_FEATURE_FRAGMENT,
  RELATED_NODE_FRAGMENT,
  THEME_FRAGMENT,
  VERTICAL_CARD_LIST_FEATURE_FRAGMENT,
} = FRAGMENTS;

export default gql`
  query getFeaturesFeed($id: ID!) {
    node(id: $id) {
      ... on FeatureFeed {
        id
        features {
          id
          ...ActionBarFeatureFragment
          ...AvatarListFeatureFragment
          ...ContentBlockFeatureFragment
          ...HeroListFeatureFragment
          ...HorizontalCardListFeatureFragment
          ...VerticalCardListFeatureFragment
        }
      }
    }
  }

  ${ACTION_BAR_FEATURE_FRAGMENT}
  ${AVATAR_LIST_FRAGMENT}
  ${CONTENT_BLOCK_FEATURE_FRAGMENT}
  ${HERO_LIST_FEATURE_FRAGMENT}
  ${HORIZONTAL_CARD_LIST_FEATURE_FRAGMENT}
  ${RELATED_NODE_FRAGMENT}
  ${THEME_FRAGMENT}
  ${VERTICAL_CARD_LIST_FEATURE_FRAGMENT}
`;
