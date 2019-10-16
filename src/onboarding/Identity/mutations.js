import gql from 'graphql-tag';

export const REQUEST_PIN = gql`
  mutation requestPin($phoneNumber: String!) {
    requestSmsLoginPin(phoneNumber: $phoneNumber) {
      success
      isExistingIdentity
    }
  }
`

export const IS_VALID_IDENTITY = gql`
  mutation isValidIdentity($identity: String!) {
    isValidIdentity(identity: $identity) {
      success
      isExistingIdentity
    }
  }
`