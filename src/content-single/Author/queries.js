import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

// eslint-disable-next-line import/prefer-default-export
export const GET_AUTHOR = gql`
  query getAuthor($id: ID!) {
    node(id: $id) {
      ... on ContentItem {
        id
        htmlContent
        ...publishFragment
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.PUBLISH_FRAGMENT}
`;
