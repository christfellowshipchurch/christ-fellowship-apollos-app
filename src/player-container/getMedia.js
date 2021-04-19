import ApollosConfig from '@apollosproject/config';
import gql from 'graphql-tag';

// TODO: add support for AudioNode
export default gql`
  query getMedia($nodeId: ID!) {
    node(id: $nodeId) {
      id
      ...VideoNodeFragment
      ...ContentNodeFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.VIDEO_NODE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.CONTENT_NODE_FRAGMENT}
`;
