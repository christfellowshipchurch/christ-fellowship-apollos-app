import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query myPrayerRequests($first: Int, $after: String) {
    currentUserPrayerRequests(first: $first, after: $after) {
      totalCount
      pageInfo {
        endCursor
      }
      edges {
        node {
          ...PrayerRequestFragment
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.PRAYER_REQUEST_FRAGMENT}
`;
