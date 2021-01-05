import ApollosConfig from '@apollosproject/config';
import gql from 'graphql-tag';

export default gql`
  query getFeedFeatures {
    userFeedFeatures {
      ...LiteFeaturesFragment
      ...ActionBarFeatureFragment
      ...AvatarListFeatureFragment
      ... on HorizontalCardListFeature {
        cardType
        primaryAction {
          title
          action
          relatedNode {
            ...RelatedFeatureNodeFragment
          }
        }
      }
    }
  }

  ${ApollosConfig.FRAGMENTS.LITE_FEATURES_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.ACTION_BAR_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.RELATED_NODE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.THEME_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.AVATAR_LIST_FRAGMENT}
`;
