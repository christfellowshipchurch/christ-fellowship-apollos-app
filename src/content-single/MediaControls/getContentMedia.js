import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getContentMedia($contentId: ID!) {
    node(id: $contentId) {
      ... on ContentItem {
        ...contentMediaFragment
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_MEDIA_FRAGMENT}
`;
