import gql from 'graphql-tag';

export const REQUEST_PIN = gql`
  mutation requestPin($phoneNumber: String!) {
    requestSmsLoginPin(phoneNumber: $phoneNumber) {
      success
      isExistingIdentity
    }
  }
`;

export const IS_VALID_IDENTITY = gql`
  mutation isValidIdentity($identity: String!) {
    isValidIdentity(identity: $identity) {
      success
      isExistingIdentity
    }
  }
`;

export const AUTHENTICATE_CREDENTIALS = gql`
  mutation authenticateCredentials($identity: String!, $passcode: String!) {
    authenticateCredentials(identity: $identity, passcode: $passcode) {
      token
    }
  }
`;

export const CREATE_NEW_LOGIN = gql`
  mutation createNewUserAccount($identity: String!, $passcode: String!) {
    createNewUserLogin(identity: $identity, passcode: $passcode) {
      token
    }
  }
`;

export const HANDLE_NEW_LOGIN = gql`
  mutation handleNewUserAccount($identity: String!, $passcode: String!) {
    createNewUserAccount(identity: $identity, passcode: $passcode) {
      token
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation relateUserLoginToPerson(
    $identity: String!
    $passcode: String!
    $firstName: String!
    $lastName: String!
    $birthDate: String!
    $gender: String!
  ) {
    relateUserLoginToPerson(
      identity: $identity
      passcode: $passcode
      input: [
        { field: FirstName, value: $firstName }
        { field: LastName, value: $lastName }
        { field: BirthDate, value: $birthDate }
        { field: Gender, value: $gender }
      ]
    ) {
      token
    }
  }
`;

export const REQUEST_EMAIL_PIN = gql`
  mutation requestEmailLoginPin($email: String!) {
    requestEmailLoginPin(email: $email)
  }
`;

export const HANDLE_LOGIN = gql`
  mutation handleLogin($authToken: String!) {
    handleLogin(authToken: $authToken) @client
  }
`;
