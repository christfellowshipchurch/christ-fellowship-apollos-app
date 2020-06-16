import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export const GET_FILTERS = gql`
  query getBrowseFilters {
    browseFilters {
      id
      title
    }
  }
`;

export const GET_CATEGORIES_FROM_FILTER = gql`
  query getCategoriesByFilterId($id: ID!, $cards: Int) {
    node(id: $id) {
      id
      ... on ContentItem {
        title

        childContentItemsConnection {
          edges {
            node {
              id
              title
              childContentItemsConnection(first: $cards) {
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
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_CARD_FRAGMENT}
`;

export const GET_CATEGORY_PREVIEW = gql`
  query getFilterCategories($id: ID!, $first: Int) {
    node(id: $id) {
      id
      ... on ContentItem {
        title

        childContentItemsConnection(first: $first) {
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
