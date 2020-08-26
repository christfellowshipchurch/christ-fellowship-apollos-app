import gql from 'graphql-tag';

export default gql`
  mutation addAttendance($id: ID!) {
    addMemberAttendance(id: $id) {
      id
    }
  }
`;
