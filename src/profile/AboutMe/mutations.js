import gql from 'graphql-tag'

export const UDPATE_GENDER = gql`
  mutation updateGender($gender: String!) {
    updateProfileFields(
      input: [
        { field: Gender, value: $gender }
      ]
    ) {
      gender
    }
  }
`

export const UPDATE_BIRTHDATE = gql`
  mutation updateBirthDate($birthDate: String!) {
    updateProfileFields(
      input: [
        { field: BirthDate, value: $birthDate }
      ]
    ) {
      birthDate
    }
  }
`

export const UPDATE_ETHNICITY = gql`
  mutation updateEthnicity($ethnicity: String!) {
    updateProfileFields(
      input: [
        { field: Ethnicity, value: $ethnicity }
      ]
    ) {
      ethnicity
    }
  }
`