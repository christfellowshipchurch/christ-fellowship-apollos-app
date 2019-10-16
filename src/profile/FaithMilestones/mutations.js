import gql from 'graphql-tag'

export const UPDATE_BAPTISM = gql`
  mutation updateBaptism($baptism: String!) {
    updateProfileFields(
      input: [
        { field: BaptismDate, value: $baptism }
      ]
    ) {
      baptismDate
    }
  }
`

export const UPDATE_SALVATION = gql`
  mutation updateSalvation($salvation: String!) {
    updateProfileFields(
      input: [
        { field: SalvationDate, value: $salvation }
      ]
    ) {
      salvationDate
    }
  }
`