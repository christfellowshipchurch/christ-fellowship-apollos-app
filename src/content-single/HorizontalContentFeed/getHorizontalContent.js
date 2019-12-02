import gql from 'graphql-tag';

export default gql`
  query getHorizontalContent($itemId: ID!, $cursor: String) {
    node(id: $itemId) {
      ... on ContentItem {
        id
        childContentItemsConnection(after: $cursor) {
          edges {
            cursor
            node {
              id
              coverImage {
                name
                sources {
                  uri
                }
              }
              parentChannel {
                id
                name
                iconName
              }
              title
              sharing {
                url
                message
                title
              }
            }
          }
        }
        siblingContentItemsConnection(after: $cursor) {
          edges {
            cursor
            node {
              id
              coverImage {
                name
                sources {
                  uri
                }
              }
              parentChannel {
                id
                name
                iconName
              }
              title
              sharing {
                url
                message
                title
              }
            }
          }
        }
      }
    }
  }
`;