import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

const { FRAGMENTS } = ApollosConfig;
const {
  LIVE_STREAM_LIST_FEATURE_FRAGMENT,
  PRAYER_LIST_FEATURE_FRAGMENT,
} = FRAGMENTS;

export default gql`
  query getFeaturesFeed($id: ID!) {
    node(id: $id) {
      ... on FeatureFeed {
        id
        features {
          id
          ...LiveStreamListFeatureFragment
          ...PrayerListFeatureFragment
        }
      }
    }
  }

  ${LIVE_STREAM_LIST_FEATURE_FRAGMENT}
  ${PRAYER_LIST_FEATURE_FRAGMENT}
`;
