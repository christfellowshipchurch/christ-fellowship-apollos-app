import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export const GET_MY_PRAYERS = gql`
  query GET_MY_PRAYERS($first: Int, $after: String) {
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
