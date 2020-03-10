import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

console.log({ ApollosConfig });

export const GET_FILTERS = gql`
  query getBrowseFilters {
    getBrowseFilters {
      id
      childContentItemsConnection {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  }
`;

export const GET_CATEGORIES_FROM_FILTERS = gql`
  query getFilterCategories($id: ID!) {
    node(id: $id) {
      id
      ... on ContentItem {
        title

        childContentItemsConnection {
          edges {
            node {
              id
              title
            }
          }
        }
      }
    }
  }
`;

export const GET_CATEGORY_PREVIEW = gql`
  query getFilterCategories($id: ID!) {
    node(id: $id) {
      id
      ... on ContentItem {
        title

        childContentItemsConnection(first: 4) {
          edges {
            node {
              id
              ...contentCardFragment
            }
          }
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_CARD_FRAGMENT}
`;
