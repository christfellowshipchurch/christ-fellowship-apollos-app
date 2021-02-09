import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

const GET_CARD_PARTS = gql`
  query getCardParts($nodeId: ID!) {
    node(id: $nodeId) {
      id
      __typename
      ...contentCardFragment
      ...accessoryFragment
      ...PrayerRequestFragment
      ...GroupCardFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.ACCESSORY_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.CONTENT_CARD_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.PRAYER_REQUEST_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.GROUP_CARD_FRAGMENT}
`;

export default GET_CARD_PARTS;
