import gql from 'graphql-tag'

export const GET_EVENTS = gql`
    query getEvents {
        allEvents {
            id
            title
            startDate
            endDate

            coverImage {
                name
                sources {
                  uri
                }
              }

            sharing {
                url
                title
                message
            }
        }
    }
`
