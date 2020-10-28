import gql from 'graphql-tag';

export default gql`
  query getEventGroupings($id: ID!) {
    node(id: $id) {
      ... on EventContentItem {
        eventGroupings {
          name
          instances {
            id
            start
          }
        }
      }
    }

    currentUser {
      id
      profile {
        id
        campus {
          id
          name
        }
      }
    }
  }
`;
