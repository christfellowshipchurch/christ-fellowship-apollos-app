import gql from 'graphql-tag'

export const GET_FILTERS = gql`
    query getBrowseFilters {
        contentChannels {
            id
            childContentItemsConnection {
                edges {
                    node {
                        id
                        title
                    }
                }
            }
        }
    }
`

export const GET_CATEGORIES_FROM_FILTERS = gql`
    query getCategoriesFromFilter($filterId: ID!) {
        node(id: $filterId) {
            ...on ContentItem {
                title

                childContentItemsConnection {
                    edges {
                        node {
                            id
                            title

                            childContentItemsConnection(first: 3) {
                                edges {
                                    node {
                                        title
                                    }
                                }
                            }

                        }
                    }
                }

            }
        }
    }
`

export const GET_CONTENT_FROM_CATEGORY_ID = gql`    
    query getAllContentFromCategoryId($categoryId: ID!) {
        node(id: $categoryId) {
            ...on ContentItem {
                title
          			id
                childContentItemsConnection {
                    edges {
                        node {
                            title
                        }
                    }
                }
            }
        }
    }
`