import gql from 'graphql-tag';
import { TEXT_FEATURE_FRAGMENT } from './TextFeature';
import { SCRIPTURE_FEATURE_FRAGMENT } from './ScriptureFeature';

const FEATURES_FRAGMENT = `
  fragment FeaturesFragment on Feature {
    id
    ...TextFeatureFragment
    ...ScriptureFeatureFragment
  }
  ${TEXT_FEATURE_FRAGMENT}
  ${SCRIPTURE_FEATURE_FRAGMENT}
`;

export default gql`
  query contentItemFeatures($contentId: ID!) {
    node(id: $contentId) {
      id
      ... on ContentSeriesContentItem {
        features {
          ...FeaturesFragment
        }
      }
      ... on WeekendContentItem {
        features {
          ...FeaturesFragment
        }
      }
    }
  }
  ${FEATURES_FRAGMENT}
`;
