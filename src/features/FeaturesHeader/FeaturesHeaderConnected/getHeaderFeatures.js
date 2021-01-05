import ApollosConfig from '@apollosproject/config';
import gql from 'graphql-tag';

export default gql`
  query getHeaderFeatures {
    userHeaderFeatures {
      ...LiteFeaturesFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.LITE_FEATURES_FRAGMENT}
`;
