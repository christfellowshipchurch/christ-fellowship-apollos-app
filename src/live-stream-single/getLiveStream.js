import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getLiveStream($id: ID!) {
    node(id: $id) {
      __typename
      id
      ...LiveStreamFragment
      ...StreamChatChannelNodeFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.LIVE_STREAM_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.STREAM_CHAT_FRAGMENT}
`;
