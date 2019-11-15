import gql from 'graphql-tag'

export const GET_EVENT_SCHEDULES = gql`
    query getEventSchedules($id: ID!) {
        currentUser {
            profile {
                campus {
                    name
                }
            }
        }
        
        node(id: $id) {
            ... on ContentItem {
                id
                childContentItemsConnection {
                    edges {
                        node {
                            id
                            ... on EventScheduleItem {
                                dates
                                campuses {
                                    name
                                }
                                location
                            }
                        }
                    }
                }
            }
        }
    }
`