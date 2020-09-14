import gql from 'graphql-tag';

export default gql`
  query getCurrentUserGroups {
    currentUser {
      id
      profile {
        id
        groups {
          ... on Group {
            id
            title
            coverImage {
              sources {
                uri
              }
            }
            avatars
            dateTime {
              start
              end
            }
          }
        }
      }
    }
  }
`;
