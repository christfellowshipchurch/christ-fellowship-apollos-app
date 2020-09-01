import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getPrayerRequest($prayerRequestId: ID!) {
    node(id: $prayerRequestId) {
      __typename
      ... on PrayerRequest {
        ...PrayerRequestFragment
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.PRAYER_REQUEST_FRAGMENT}
`;
