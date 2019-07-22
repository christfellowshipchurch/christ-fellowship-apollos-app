import gql from 'graphql-tag';

export const VERIFY_PIN = gql`
  mutation verifyPin($username: String!, $password: String!) {
    authenticateWithSms(phoneNumber: $username, pin: $password) {
      token
    }
  }
`;

export const VERIFY_PASSWORD = gql`
  mutation authenticate($username: String!, $password: String!) {
    authenticate(identity: $username, password: $password) {
      token
    }
  }
`;

export const HANDLE_LOGIN = gql`
  mutation handleLogin($authToken: String!) {
    handleLogin(authToken: $authToken) @client
  }
`;