import gql from 'graphql-tag';

export default gql`
  mutation updateName($firstName: String!, $lastName: String!) {
    updateProfileFields(
      input: [
        { field: FirstName, value: $firstName }
        { field: LastName, value: $lastName }
      ]
    ) {
      firstName
      lastName
      id
    }
  }
`;
