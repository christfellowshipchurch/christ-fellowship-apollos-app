import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getFeature($featureId: ID!) {
    node(id: $featureId) {
      ...ActionBarFeatureFragment
      ...AvatarListFeatureFragment
      ...HeroListFeatureFragment
      ...HorizontalCardListFeatureFragment
      ...VerticalCardListFeatureFragment
    }
  }

  ${ApollosConfig.FRAGMENTS.ACTION_BAR_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.AVATAR_LIST_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.HERO_LIST_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.HORIZONTAL_CARD_LIST_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.THEME_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.RELATED_NODE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.VERTICAL_CARD_LIST_FEATURE_FRAGMENT}
`;
