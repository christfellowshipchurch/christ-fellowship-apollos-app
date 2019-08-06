import gql from 'graphql-tag';

export default gql`
  query getContentMedia($contentId: ID!) {
    node(id: $contentId) {
      ... on ContentItem {
        id
        title
        parentChannel {
          id
          name
        }
        coverImage {
          sources {
            uri
          }
        }
        videos {
          sources {
            uri
          }
        }
      }
      ... on WeekendContentItem {
        liveStream {
          isLive
          media {
            sources {
              uri
            }
          }
          webViewUrl
        }
      }
    }
  }
`;
