import gql from 'graphql-tag';

export default gql`
  mutation requestPin($phoneNumber: String!) {
    requestSmsLoginPin(phoneNumber: $phoneNumber) {
      success
    }
  }
`;