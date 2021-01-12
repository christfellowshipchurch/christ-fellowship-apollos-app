import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getScripture($nodeId: ID!) {
    node(id: $nodeId) {
      __typename
      id
      ... on ScriptureNode {
        scriptures {
          ...ScriptureFragment
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.SCRIPTURE_FRAGMENT}
`;
