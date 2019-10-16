import gql from 'graphql-tag';

export default gql`
  query getUserLoginTypes {
    getUserLoginTypes {
      sms
      email
    }
  }
`;
