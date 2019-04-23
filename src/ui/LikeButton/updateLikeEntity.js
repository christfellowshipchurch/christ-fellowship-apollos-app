import gql from 'graphql-tag';

export default gql`
  mutation updateLikeEntity($itemId: ID!, $operation: LIKE_OPERATION!) {
    updateLikeEntity(input: { nodeId: $itemId, operation: $operation }) {
      id
      isLiked
    }
  }
`;
