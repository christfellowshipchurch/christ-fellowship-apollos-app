import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getLiveStreamListFeature($featureId: ID!) {
    node(id: $featureId) {
      ...LiveStreamListFeatureFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.LIVE_STREAM_LIST_FEATURE_FRAGMENT}
`;
