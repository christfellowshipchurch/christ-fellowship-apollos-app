import gql from 'graphql-tag'

export const GET_SPOUSE = gql`
    query {
        getSpouse {
            id
            firstName
            lastName

            photo {
                uri
            }
        }
    }
`

export const GET_CHILDREN = gql`
    query {
        getChildren {
            id
            firstName
            lastName

            photo {
                uri
            }
        }
    }
`