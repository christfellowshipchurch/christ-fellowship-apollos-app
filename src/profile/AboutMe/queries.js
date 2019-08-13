import gql from 'graphql-tag'

export const GET_ETHNICITY_LIST = gql`
  query {
    getEthnicityList {
      id
      values {
        id
        value
      }
    }
  }
`

export const GET_STATES_LIST = gql`
  query {
    getStatesList {
      id
      values {
        id
        value
      }
    }
  }
`