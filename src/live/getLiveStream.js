import gql from 'graphql-tag';

export default gql`
  query getLiveStream {
    liveStream {
      isLive
      media {
        sources {
          uri
        }
      }
    }
  }
`;
