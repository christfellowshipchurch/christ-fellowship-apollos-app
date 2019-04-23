import gql from 'graphql-tag';

export default gql`
  mutation updateDetails($gender: String!, $birthDate: String!) {
    updateProfileFields(
      input: [
        { field: Gender, value: $gender }
        { field: BirthDate, value: $birthDate }
      ]
    ) {
      gender
      birthDate
      id
    }
  }
`;
