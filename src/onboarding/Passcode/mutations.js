import gql from 'graphql-tag';

export const AUTHENTICATE_CREDENTIALS = gql`
  mutation authenticateCredentials($username: String!, $password: String!) {
    authenticateCredentials(identity: $username, passcode: $password) {
      token
    }
  }
`
export const HANDLE_LOGIN = gql`
  mutation handleLogin($authToken: String!) {
    handleLogin(authToken: $authToken) @client
  }
`
export const CREATE_NEW_LOGIN = gql`
  mutation createNewUserAccount($identity: String!, $passcode: String!) {
    createNewUserLogin(identity: $identity, passcode: $passcode) {
      token
    }
  }
`
export const HANDLE_NEW_LOGIN = gql`
  mutation handleNewUserAccount($identity: String!, $passcode: String!) {
    createNewUserAccount(identity: $identity, passcode: $passcode) {
      token
    }
  }
`