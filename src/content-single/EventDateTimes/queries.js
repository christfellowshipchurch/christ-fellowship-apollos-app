import gql from 'graphql-tag';

export const GET_EVENT_SCHEDULES = gql`
  query getEventSchedules($id: ID!) {
    currentUser {
      profile {
        campus {
          name
        }
      }
    }

    node(id: $id) {
      ... on ContentItem {
        id
        childContentItemsConnection {
          edges {
            node {
              id
              ... on EventScheduleItem {
                dates
                campuses {
                  name
                }
                location
              }
            }
          }
        }
      }
    }
  }
`;

export const CURRENT_USER_CAMPUS = gql`
  query getCurrentUserProfile {
    currentUser {
      id
      profile {
        id
        campus {
          name
        }
      }
    }
  }
`;
