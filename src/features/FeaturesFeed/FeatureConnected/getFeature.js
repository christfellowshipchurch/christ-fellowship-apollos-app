import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

// note : this query has a LOT of fragments and the request can become quite large as the Feature ID increases in size. There have been issues in the past where arbitrary Network Errors were being thrown because of the size of this query. Although currently resolved, this is a good debugging starting point if the issue comes up again
// export default gql`
//   query getFeature($featureId: ID!) {
//     node(id: $featureId) {
//       id
//       ...ActionBarFeatureFragment
//       ...AvatarListFeatureFragment
//       ...HeroListFeatureFragment
//       ...HorizontalCardListFeatureFragment
//       ...VerticalCardListFeatureFragment
//     }
//   }

//   ${ApollosConfig.FRAGMENTS.ACTION_BAR_FEATURE_FRAGMENT}
//   ${ApollosConfig.FRAGMENTS.AVATAR_LIST_FRAGMENT}
//   ${ApollosConfig.FRAGMENTS.HERO_LIST_FEATURE_FRAGMENT}
//   ${ApollosConfig.FRAGMENTS.HORIZONTAL_CARD_LIST_FEATURE_FRAGMENT}
//   ${ApollosConfig.FRAGMENTS.THEME_FRAGMENT}
//   ${ApollosConfig.FRAGMENTS.RELATED_NODE_FRAGMENT}
//   ${ApollosConfig.FRAGMENTS.VERTICAL_CARD_LIST_FEATURE_FRAGMENT}
// `;

export default gql`
  query getBaseFeature($featureId: ID!) {
    node(id: $featureId) {
      id
    }
  }
`;

export const GET_ACTION_BAR_FEATURE = gql`
  query getActionBarFeature($featureId: ID!) {
    node(id: $featureId) {
      id
      ...ActionBarFeatureFragment
    }
  }

  ${ApollosConfig.FRAGMENTS.ACTION_BAR_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.RELATED_NODE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.THEME_FRAGMENT}
`;

export const GET_AVATAR_LIST_FEATURE = gql`
  query getAvatarListFeature($featureId: ID!) {
    node(id: $featureId) {
      id
      ...AvatarListFeatureFragment
    }
  }

  ${ApollosConfig.FRAGMENTS.AVATAR_LIST_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.RELATED_NODE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.THEME_FRAGMENT}
`;
