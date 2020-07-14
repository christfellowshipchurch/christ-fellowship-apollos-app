import ApollosConfig from '@apollosproject/config';
import gql from 'graphql-tag';

export default gql`
  query getHeaderFeatures {
    userHeaderFeatures {
      ...FeedFeaturesFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.FEED_FEATURES_FRAGMENT}
`;
