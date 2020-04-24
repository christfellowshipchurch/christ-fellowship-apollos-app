import gql from 'graphql-tag';

export const getCurrentUser = gql`
  query {
    currentUser {
      id
      profile {
        id
        photo {
          uri
        }
      }
    }
  }
`;

export const getLoginState = gql`
  query {
    isLoggedIn @client
  }
`;
