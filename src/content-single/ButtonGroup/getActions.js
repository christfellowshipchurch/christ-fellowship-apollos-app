import gql from 'graphql-tag';

export default gql`
  query getContentActions($id: ID!) {
    node(id: $id) {
      ... on EventContentItem {
        callsToAction {
          call
          action
        }
      }

      ... on InformationalContentItem {
        callsToAction {
          call
          action
        }
      }
    }
  }
`;
