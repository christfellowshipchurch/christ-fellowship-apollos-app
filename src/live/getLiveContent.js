import gql from 'graphql-tag';

export default gql`
  query getLiveContent {
    liveStreams {
      isLive
      eventStartTime
      media {
        sources {
          uri
        }
      }
      webViewUrl

      contentItem {
        ... on WeekendContentItem {
          id
        }
      }
    }
  }
`;
