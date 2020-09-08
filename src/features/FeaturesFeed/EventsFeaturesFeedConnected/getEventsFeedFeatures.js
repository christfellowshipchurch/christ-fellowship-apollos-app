import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getEventsFeedFeatures {
    eventsFeedFeatures {
      ...FeedFeaturesFragment
      ...ActionBarFeatureFragment
      ...AvatarListFeatureFragment
      ... on HorizontalCardListFeature {
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

  ${ApollosConfig.FRAGMENTS.FEED_FEATURES_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.ACTION_BAR_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.RELATED_NODE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.THEME_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.AVATAR_LIST_FRAGMENT}
`;
